from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd
import io
from typing import Optional
import os
import re
import numpy as np

app = FastAPI(title="Galactus Ranking API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js dev
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Galactus Ranking API is running"}

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}

def safe_read_csv_from_upload(upload_file: UploadFile):
    """Read CSV from uploaded file"""
    if not upload_file or not upload_file.filename:
        return None
    
    try:
        content = upload_file.file.read()
        upload_file.file.seek(0)  # Reset file pointer for potential re-reading
        return pd.read_csv(io.StringIO(content.decode('utf-8')))
    except Exception as e:
        print(f"Error reading {upload_file.filename}: {str(e)}")
        return None

def process_train_optimization(
    fitness_df, wo_df, branding_df, mileage_df, cleaning_df, 
    stabling_df=None, cleaning_df_prev=None
):
    """Process train optimization logic"""
    
    PLANNING_TIME = pd.Timestamp("2025-09-01T21:00:00")
    
    # Collect all train IDs
    all_train_ids = set()
    for df in [fitness_df, wo_df, branding_df, mileage_df, cleaning_df]:
        if df is not None and 'train_id' in df.columns:
            all_train_ids.update(df['train_id'].dropna().unique())
    
    if stabling_df is not None and 'train_id' in stabling_df.columns:
        all_train_ids.update(stabling_df['train_id'].dropna().unique())

    all_trains = sorted(list(all_train_ids))
    if len(all_trains) == 0:
        raise ValueError("No train IDs found in provided files. Ensure `train_id` column is present in your CSVs.")

    df = pd.DataFrame({"train_id": all_trains})

    # Process fitness certificates
    if fitness_df is not None and not fitness_df.empty:
        fitness_df['valid_to_dt'] = pd.to_datetime(fitness_df['valid_to'], errors='coerce')
        fitness_min = fitness_df.groupby('train_id')['valid_to_dt'].min().reset_index().rename(columns={'valid_to_dt':'fitness_valid_till'})
        df = df.merge(fitness_min, on='train_id', how='left')
        df['fitness_days_left'] = (df['fitness_valid_till'] - PLANNING_TIME).dt.days
    else:
        df['fitness_days_left'] = 0
    
    df['fitness_days_left'] = df['fitness_days_left'].fillna(-9999).clip(lower=0)

    def fitness_priority(days_left):
        if days_left < 0:
            return 0.0
        return 1.0 / (1.0 + days_left)

    df['fitness_priority_raw'] = df['fitness_days_left'].apply(fitness_priority)

    # Process work orders
    if wo_df is not None and not wo_df.empty:
        wo_df['status_norm'] = wo_df['status'].str.lower().fillna('')
        wo_open = wo_df[wo_df['status_norm'].str.contains('open', na=False)]

        open_counts = wo_open.groupby('train_id').size().rename('open_wo_count')
        open_hours = wo_open.groupby('train_id')['estimated_hours'].sum(min_count=1).rename('open_wo_hours')

        wo_summary = pd.concat([open_counts, open_hours], axis=1).reset_index().fillna(0)
        wo_summary['open_wo_count'] = wo_summary['open_wo_count'].astype(int)
        wo_summary['open_wo_hours'] = wo_summary['open_wo_hours'].astype(float)
        df = df.merge(wo_summary, on='train_id', how='left')
    
    df[['open_wo_count', 'open_wo_hours']] = df[['open_wo_count', 'open_wo_hours']].fillna(0)

    # Process branding schedule
    if branding_df is not None and not branding_df.empty:
        branding_df['start_date_dt'] = pd.to_datetime(branding_df['start_date'], errors='coerce').dt.date
        branding_df['end_date_dt'] = pd.to_datetime(branding_df['end_date'], errors='coerce').dt.date
        today_date = PLANNING_TIME.date()
        branding_df['active'] = (~branding_df['start_date_dt'].isna()) & (~branding_df['end_date_dt'].isna()) & (branding_df['start_date_dt'] <= today_date) & (branding_df['end_date_dt'] >= today_date)
        active_brand = branding_df[branding_df['active']].copy()
        if not active_brand.empty:
            brand_hours = active_brand.groupby('train_id')['required_exposure_hours_per_day'].sum().rename('branding_hours').reset_index()
            df = df.merge(brand_hours, on='train_id', how='left')
    
    df['branding_hours'] = df['branding_hours'].fillna(0).astype(float)

    # Process mileage logs
    if mileage_df is not None and not mileage_df.empty:
        mileage_df['odometer_km'] = pd.to_numeric(mileage_df['odometer_km'], errors='coerce').fillna(0)
        odom = mileage_df.sort_values('recorded_at').groupby('train_id').tail(1)[['train_id','odometer_km']].rename(columns={'odometer_km':'cumulative_km'})
        if 'delta_km' in mileage_df.columns:
            delta = mileage_df.sort_values('recorded_at').groupby('train_id').tail(1)[['train_id','delta_km']]
            df = df.merge(delta, on='train_id', how='left')
        df = df.merge(odom, on='train_id', how='left')
    
    df['cumulative_km'] = pd.to_numeric(df['cumulative_km'].fillna(0), errors='coerce').astype(float)
    df['delta_km'] = pd.to_numeric(df['delta_km'].fillna(0), errors='coerce').astype(float)

    # Process previous cleaning schedule
    if cleaning_df_prev is not None and not cleaning_df_prev.empty:
        cleaning_df_prev['scheduled_end_dt'] = pd.to_datetime(cleaning_df_prev['scheduled_end'], errors='coerce')
        last_clean = cleaning_df_prev.sort_values('scheduled_end_dt').groupby('train_id').tail(1)[['train_id','scheduled_end_dt']].copy()
        df = df.merge(last_clean.rename(columns={'scheduled_end_dt':'last_clean_end'}), on='train_id', how='left')
        df['clean_age_hours'] = (PLANNING_TIME - df['last_clean_end']).dt.total_seconds() / 3600.0
    else:
        df['clean_age_hours'] = 99999.0
    
    df['clean_age_hours'] = df['clean_age_hours'].fillna(99999.0)
    df['clean_freshness_raw'] = (1.0 - (np.minimum(df['clean_age_hours'], 72.0) / 72.0)).clip(0.0, 1.0)

    # Process current cleaning schedule
    type_duration_mins = {
        'daily': 15,
        'outside_cleaning': 120,
        'heavy': 180
    }
    
    if cleaning_df is not None and not cleaning_df.empty:
        start_window = PLANNING_TIME
        end_window = PLANNING_TIME + pd.Timedelta(hours=24)
        cleaning_df['scheduled_start_dt'] = pd.to_datetime(cleaning_df['scheduled_start'], errors='coerce')
        mask_window = (cleaning_df['scheduled_start_dt'] >= start_window) & (cleaning_df['scheduled_start_dt'] < end_window)
        today_jobs = cleaning_df[mask_window].copy()

        def duration_hours(row):
            t = str(row.get('cleaning_type', '')).lower().strip().replace(' ', '_')
            mins = type_duration_mins.get(t, type_duration_mins['daily'])
            return float(mins) / 60.0

        if not today_jobs.empty:
            today_jobs['duration_hours'] = today_jobs.apply(duration_hours, axis=1)
            today_jobs['manpower_required'] = pd.to_numeric(today_jobs['manpower_required'], errors='coerce').fillna(0.0)
            today_jobs['load'] = today_jobs['duration_hours'] * today_jobs['manpower_required']
            load_by_train = today_jobs.groupby('train_id')['load'].sum().rename('today_clean_load').reset_index()
        else:
            load_by_train = pd.DataFrame(columns=['train_id','today_clean_load'])
    else:
        load_by_train = pd.DataFrame(columns=['train_id','today_clean_load'])

    df = df.merge(load_by_train, on='train_id', how='left')
    df['today_clean_load'] = df['today_clean_load'].fillna(0.0)

    # Process stabling layout
    def parse_position(position):
        if pd.isna(position):
            return (None, None)
        pid = str(position).strip()
        m = re.search(r'(?i)\bline[_\-]?(\d+)[_\-]?pos[_\-]?(\d+)\b', pid)
        if m:
            line_num = m.group(1)
            slot_num = int(m.group(2))
            return (f"line_{line_num}", int(slot_num))
        return (pid, None)

    if stabling_df is not None and not stabling_df.empty:
        pos_map = stabling_df[['train_id','position']].dropna()
        pos_map['parsed'] = pos_map['position'].apply(parse_position)
        pos_map[['line_id','slot_idx']] = pd.DataFrame(pos_map['parsed'].tolist(), index=pos_map.index)
        df = df.merge(pos_map[['train_id','position','line_id','slot_idx']], on='train_id', how='left')
    else:
        df['position'] = df['train_id']
        df['line_id'] = 'default_line'
        df['slot_idx'] = None

    # Assign slots by group
    def assign_slots_by_group(g):
        if g['slot_idx'].notna().any():
            used = set([int(x) for x in g['slot_idx'].dropna().astype(int).tolist()])
            next_slot = 0
            res = []
            for _, r in g.iterrows():
                if pd.notna(r['slot_idx']):
                    res.append(int(r['slot_idx']))
                else:
                    while next_slot in used:
                        next_slot += 1
                    res.append(next_slot)
                    used.add(next_slot)
            g['slot_idx_assigned'] = res
        else:
            g = g.sort_values(by=['position','train_id'])
            g['slot_idx_assigned'] = list(range(len(g)))
        return g

    group_key = 'line_id' if 'line_id' in df.columns and df['line_id'].notna().any() else 'position'
    df[group_key] = df[group_key].fillna(df.get('position', df['train_id']))

    assigned = df.groupby(group_key, group_keys=False).apply(assign_slots_by_group).reset_index(drop=True)
    if 'slot_idx_assigned' in assigned.columns:
        assigned['shunt_depth'] = assigned['slot_idx_assigned'].fillna(0).astype(int)
    else:
        assigned['shunt_depth'] = 0
    df = assigned

    max_depth = max(1, int(df['shunt_depth'].max()))

    # Constants for scoring
    SHUNT_LAMBDA = 0.25
    W_FITNESS = 0.15
    W_JOB = 0.20
    W_BRANDING = 0.25
    W_MILEAGE = 0.25
    W_CLEAN = 0.15
    CLEAN_UPCOMING_ALPHA = 0.8

    def minmax_col(s):
        s2 = s.copy().astype(float)
        if s2.isna().all():
            return s2.fillna(0.0)
        lo, hi = s2.min(), s2.max()
        if hi == lo:
            return pd.Series(0.0, index=s2.index)
        return (s2 - lo) / (hi - lo)

    # Compute scores
    feature_scores = pd.DataFrame({'train_id': df['train_id']})
    feature_scores['fitness_score'] = minmax_col(df['fitness_priority_raw'])
    feature_scores['job_score'] = 1.0 - minmax_col(df['open_wo_hours'].astype(float))
    feature_scores['branding_score'] = minmax_col(df['branding_hours'].astype(float))

    km = df['cumulative_km'].astype(float)
    km_mean = km.mean() if not km.isna().all() else 0.0
    max_abs = max(1.0, (km - km_mean).abs().max())
    feature_scores['mileage_score'] = (1.0 - (km - km_mean).abs() / max_abs).clip(0.0, 1.0)

    df['clean_today_penalty'] = minmax_col(df['today_clean_load'])
    df['cleaning_score_raw'] = df['clean_freshness_raw'] * (1.0 - CLEAN_UPCOMING_ALPHA * df['clean_today_penalty'])
    df['cleaning_score_raw'] = df['cleaning_score_raw'].clip(0.0, 1.0)
    df['cleaning_score'] = minmax_col(df['cleaning_score_raw'])

    feature_scores = feature_scores.merge(df[['train_id', 'cleaning_score']], on='train_id', how='left')

    df['S'] = df['shunt_depth'].astype(float) / float(max_depth)
    feature_scores['shunt_penalty'] = df['S']

    df['priority_score'] = (
        W_FITNESS * feature_scores['fitness_score'] +
        W_JOB * feature_scores['job_score'] +
        W_BRANDING * feature_scores['branding_score'] +
        W_MILEAGE * feature_scores['mileage_score'] +
        W_CLEAN * feature_scores['cleaning_score']
    ) - SHUNT_LAMBDA * feature_scores['shunt_penalty']

    df['priority_score'] = minmax_col(df['priority_score'])

    # Determine eligibility and rank
    df['eligible'] = (df['fitness_days_left'] > 0) & (df['open_wo_hours'] <= 0)
    df = df.sort_values(
        by=['eligible', 'priority_score'],
        ascending=[False, False]
    ).reset_index(drop=True)

    # Generate reasons and recommendations
    avg_fitness_days = df['fitness_days_left'].mean()
    avg_branding_hours = df['branding_hours'].mean()
    avg_delta_km = df['delta_km'].mean()
    avg_clean_age = df['clean_age_hours'].mean()
    avg_clean_load = df['today_clean_load'].mean()
    median_position = df['slot_idx'].median() if 'slot_idx' in df.columns else 0

    def get_reasons_and_recommendations(row):
        reasons = []
        recommendations = []

        if row['fitness_days_left'] <= 0:
            reasons.append("Expired fitness certificate")
            recommendations.append("Renew fitness certificate immediately")
        elif row['fitness_days_left'] < 30:
            reasons.append(f"Fitness expiring soon ({row['fitness_days_left']:.0f} days)")
            recommendations.append("Schedule fitness renewal")

        if row['open_wo_count'] > 0:
            reasons.append(f"Open work orders ({row['open_wo_hours']:.1f} hrs estimated)")
            recommendations.append("Complete pending maintenance work")

        if row['branding_hours'] > avg_branding_hours * 1.1:
            reasons.append(f"High branding exposure required ({row['branding_hours']:.1f} hrs)")
            recommendations.append("Prioritize for passenger service")
        elif row['branding_hours'] < avg_branding_hours * 0.5:
            recommendations.append("Consider for freight or non-passenger service")

        if row['delta_km'] > avg_delta_km * 1.2:
            reasons.append(f"High recent mileage ({row['delta_km']:.1f} km)")
            recommendations.append("Schedule for maintenance check")

        if row['clean_age_hours'] > 48:
            reasons.append(f"Long since last cleaning ({row['clean_age_hours']:.1f} hrs ago)")
            recommendations.append("Schedule cleaning before service")

        if row['today_clean_load'] > avg_clean_load * 1.2:
            reasons.append("High cleaning workload scheduled today")
            recommendations.append("Consider alternative trains to reduce cleaning bottleneck")

        if 'slot_idx' in row and pd.notna(row['slot_idx']) and row['slot_idx'] > median_position:
            reasons.append("Requires significant shunting operations")
            recommendations.append("Plan shunting operations in advance")

        return {
            'reasons': " | ".join(reasons) if reasons else "Balanced performance across all metrics",
            'recommendations': " | ".join(recommendations) if recommendations else "Ready for immediate deployment"
        }

    reason_rec = df.apply(get_reasons_and_recommendations, axis=1, result_type='expand')
    df['reasons'] = reason_rec['reasons']
    df['recommendations'] = reason_rec['recommendations']

    return df

@app.post("/api/run-optimization")
async def run_optimization(
    maintainance_: Optional[UploadFile] = File(None),
    fitness_certificates_: Optional[UploadFile] = File(None),
    cleaning_schedule_: Optional[UploadFile] = File(None),
    branding_schedule_: Optional[UploadFile] = File(None),
    work_order_maximo_: Optional[UploadFile] = File(None),
    mileage_logs_: Optional[UploadFile] = File(None),
    stabling_layout_: Optional[UploadFile] = File(None),
    cleaning_schedule_prev_: Optional[UploadFile] = File(None)
):
    """Run optimization with uploaded CSV files and return results directly"""
    try:
        # Read uploaded CSV files
        fitness_df = safe_read_csv_from_upload(fitness_certificates_)
        wo_df = safe_read_csv_from_upload(work_order_maximo_)
        branding_df = safe_read_csv_from_upload(branding_schedule_)
        mileage_df = safe_read_csv_from_upload(mileage_logs_)
        cleaning_df = safe_read_csv_from_upload(cleaning_schedule_)
        stabling_df = safe_read_csv_from_upload(stabling_layout_)
        cleaning_df_prev = safe_read_csv_from_upload(cleaning_schedule_prev_)

        # Validate required files
        required_files = {
            'fitness_certificates': fitness_df,
            'work_order_maximo': wo_df,
            'branding_schedule': branding_df,
            'mileage_logs': mileage_df,
            'cleaning_schedule': cleaning_df
        }
        
        missing_files = [name for name, df in required_files.items() if df is None]
        if missing_files:
            raise HTTPException(
                status_code=400, 
                detail=f"Required CSV files missing: {missing_files}"
            )

        # Run optimization
        result_df = process_train_optimization(
            fitness_df=fitness_df,
            wo_df=wo_df,
            branding_df=branding_df,
            mileage_df=mileage_df,
            cleaning_df=cleaning_df,
            stabling_df=stabling_df,
            cleaning_df_prev=cleaning_df_prev
        )

        # Prepare response data
        response_data = []
        for _, row in result_df.iterrows():
            response_data.append({
                'train_id': row['train_id'],
                'priority_score': round(float(row['priority_score']), 4),
                'eligible': bool(row['eligible']),
                'fitness_days_left': int(row['fitness_days_left']),
                'open_work_orders': int(row['open_wo_count']),
                'reasons': row['reasons'],
                'recommendations': row['recommendations']
            })

        return JSONResponse(content={
            'success': True,
            'message': 'Optimization completed successfully',
            'total_trains': len(result_df),
            'eligible_trains': len(result_df[result_df['eligible']]),
            'results': response_data
        })

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Optimization failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)