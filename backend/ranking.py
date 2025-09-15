import os
import re
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def safe_read_csv(path, **kwargs):
    if os.path.exists(path):
        return pd.read_csv(path, **kwargs)
    else:
        return None

def generate_priority_df():
    DATA_DIR = "../data"
    PLANNING_TIME = pd.Timestamp("2025-09-01T21:00:00")

    fitness_df = safe_read_csv(os.path.join(DATA_DIR, "fitness_certificates.csv"))
    wo_df = safe_read_csv(os.path.join(DATA_DIR, "work_orders_maximo.csv"))
    branding_df = safe_read_csv(os.path.join(DATA_DIR, "branding_schedule.csv"))
    mileage_df = safe_read_csv(os.path.join(DATA_DIR, "mileage_logs.csv"))
    cleaning_df = safe_read_csv(os.path.join(DATA_DIR, "cleaning_schedule.csv"))
    stabling_df = safe_read_csv(os.path.join(DATA_DIR, "stabling_layout.csv"))
    cleaning_df_prev = safe_read_csv(os.path.join(DATA_DIR, "cleaning_schedule_prev.csv"))
    
    all_train_ids = set()
    for df in [fitness_df, wo_df, branding_df, mileage_df, cleaning_df, stabling_df]:
        if 'train_id' in df.columns:
            all_train_ids.update(df['train_id'].dropna().unique())

    all_trains = sorted(list(all_train_ids))
    if len(all_trains) == 0:
        raise RuntimeError("No train IDs found in provided files. Ensure `train_id` is present in your CSVs.")

    df = pd.DataFrame({"train_id": all_trains})
    

    fitness_df['valid_to_dt'] = pd.to_datetime(fitness_df['valid_to'], errors='coerce')
    fitness_min = fitness_df.groupby('train_id')['valid_to_dt'].min().reset_index().rename(columns={'valid_to_dt':'fitness_valid_till'})

    df['fitness_days_left'] = (pd.to_datetime(fitness_min['fitness_valid_till']) - PLANNING_TIME).dt.days
    df['fitness_days_left'] = df['fitness_days_left'].fillna(-9999).clip(lower=0)  # negative => expired

    def fitness_priority(days_left):
        if days_left < 0:
            return 0.0   # expired
        return 1.0 / (1.0 + days_left)

    df['fitness_priority_raw'] = df['fitness_days_left'].apply(fitness_priority)

    wo_df['status_norm'] = wo_df['status'].str.lower().fillna('')
    wo_open = wo_df[wo_df['status_norm'].str.contains('open', na=False)]

    open_counts = wo_open.groupby('train_id').size().rename('open_wo_count')
    open_hours = wo_open.groupby('train_id')['estimated_hours'].sum(min_count=1).rename('open_wo_hours')

    wo_summary = pd.concat([open_counts, open_hours], axis=1).reset_index().fillna(0)
    wo_summary['open_wo_count'] = wo_summary['open_wo_count'].astype(int)
    wo_summary['open_wo_hours'] = wo_summary['open_wo_hours'].astype(float)
    df = df.merge(wo_summary, on='train_id', how='left')
    df[['open_wo_count', 'open_wo_hours']] = df[['open_wo_count', 'open_wo_hours']].fillna(0)

    branding_df['start_date_dt'] = pd.to_datetime(branding_df['start_date'], errors='coerce').dt.date
    branding_df['end_date_dt'] = pd.to_datetime(branding_df['end_date'], errors='coerce').dt.date
    today_date = PLANNING_TIME.date()
    branding_df['active'] = (~branding_df['start_date_dt'].isna()) & (~branding_df['end_date_dt'].isna()) & (branding_df['start_date_dt'] <= today_date) & (branding_df['end_date_dt'] >= today_date)
    active_brand = branding_df[branding_df['active']].copy()
    brand_hours = active_brand.groupby('train_id')['required_exposure_hours_per_day'].sum().rename('branding_hours').reset_index()
    df = df.merge(brand_hours, on='train_id', how='left')
    df['branding_hours'] = df['branding_hours'].fillna(0).astype(float)

    mileage_df['odometer_km'] = pd.to_numeric(mileage_df['odometer_km'], errors='coerce').fillna(0)
    odom = mileage_df.sort_values('recorded_at').groupby('train_id').tail(1)[['train_id','odometer_km']].rename(columns={'odometer_km':'cumulative_km'})
    delta = mileage_df.sort_values('recorded_at').groupby('train_id').tail(1)[['train_id','delta_km']]
    df = df.merge(odom, on='train_id', how='left')
    df = df.merge(delta, on='train_id', how='left')
    df['cumulative_km'] = pd.to_numeric(df['cumulative_km'].fillna(0), errors='coerce').astype(float)
    df['delta_km'] = pd.to_numeric(df['delta_km'].fillna(0), errors='coerce').astype(float)


    cleaning_df_prev['scheduled_end_dt'] = pd.to_datetime(cleaning_df_prev['scheduled_end'], errors='coerce')
    cleaning_df_prev['scheduled_start_dt'] = pd.to_datetime(cleaning_df_prev['scheduled_start'], errors='coerce')
    last_clean = cleaning_df_prev.sort_values('scheduled_end_dt').groupby('train_id').tail(1)[['train_id','scheduled_end_dt','scheduled_start_dt','cleaning_type','manpower_required']].copy()
    last_clean = last_clean.rename(columns={'scheduled_end_dt':'last_clean_end','scheduled_start_dt':'last_clean_start','type':'last_clean_type','manpower_required':'last_clean_manpower'})

    df['clean_age_hours'] = (PLANNING_TIME - pd.to_datetime(last_clean['last_clean_end'])).dt.total_seconds() / 3600.0
    df['clean_age_hours'] = df['clean_age_hours'].fillna(99999.0)
    df['clean_freshness_raw'] = (1.0 - (np.minimum(df['clean_age_hours'], 72.0) / 72.0)).clip(0.0, 1.0)

    type_duration_mins = {
        'daily': 15,
        'outside_cleaning': 120,
        'heavy': 180
    }
    start_window = PLANNING_TIME
    end_window = PLANNING_TIME + pd.Timedelta(hours=24)
    cleaning_df['scheduled_start_dt'] = pd.to_datetime(cleaning_df['scheduled_start'], errors='coerce')
    cleaning_df['scheduled_end_dt'] = pd.to_datetime(cleaning_df['scheduled_end'], errors='coerce')
    mask_window = (cleaning_df['scheduled_start_dt'] >= start_window) & (cleaning_df['scheduled_start_dt'] < end_window)
    today_jobs = cleaning_df[mask_window].copy()

    def duration_hours(row):
        t = str(row.get('cleaning_type', '')).lower().strip()
        t = t.replace(' ', '_')         
        mins = type_duration_mins.get(t, type_duration_mins['daily'])
        return float(mins) / 60.0

    if not today_jobs.empty:
        today_jobs['duration_hours'] = today_jobs.apply(duration_hours, axis=1)
        today_jobs['manpower_required'] = pd.to_numeric(today_jobs['manpower_required'], errors='coerce').fillna(0.0)
        today_jobs['load'] = today_jobs['duration_hours'] * today_jobs['manpower_required']
        load_by_train = today_jobs.groupby('train_id')['load'].sum().rename('today_clean_load').reset_index()
    else:
        load_by_train = pd.DataFrame(columns=['train_id','today_clean_load'])

    df = df.merge(load_by_train, on='train_id', how='left')
    df['today_clean_load'] = df['today_clean_load'].fillna(0.0)
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

    pos_map = stabling_df[['train_id','position']].dropna()

    map
    pos_map['parsed'] = pos_map['position'].apply(parse_position)
    pos_map[['line_id','slot_idx']] = pd.DataFrame(pos_map['parsed'].tolist(), index=pos_map.index)
    df = df.merge(pos_map[['train_id','position','line_id','slot_idx']], on='train_id', how='left')

    def assign_slots_by_group(g):
        if g['slot_idx'].notna().any():
            # fill missing slot_idx by first available small integers not used
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
    df[group_key] = df[group_key].fillna(df['position'])
    df[group_key] = df[group_key].fillna(df['train_id'])

    assigned = df.groupby(group_key, group_keys=False).apply(assign_slots_by_group).reset_index(drop=True)
    if 'slot_idx_assigned' in assigned.columns:
        assigned['shunt_depth'] = assigned['slot_idx_assigned'].fillna(0).astype(int)
    else:
        assigned['shunt_depth'] = 0
    df = assigned

    max_depth = max(1, int(df['shunt_depth'].max()))
    df.drop('position', axis=1, inplace=True)


    REQUIRED_RAKES = 12
    SHUNT_LAMBDA = 0.25
    W_FITNESS = 0.15
    W_JOB = 0.20
    W_BRANDING = 0.25
    W_MILEAGE = 0.25
    W_CLEAN = 0.15
    OUTPUT_PATH = os.path.join(DATA_DIR, "ranked_induction.csv")

    CLEAN_UPCOMING_ALPHA = 0.8
    def minmax_col(s):
        s2 = s.copy().astype(float)
        if s2.isna().all():
            return s2.fillna(0.0)
        lo, hi = s2.min(), s2.max()
        if hi == lo:
            return pd.Series(0.0, index=s2.index)
        return (s2 - lo) / (hi - lo)

    def compute_scores(df):

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
        df['clean_freshness'] = minmax_col(df['clean_freshness_raw'])
        df['clean_today_penalty_norm'] = df['clean_today_penalty']  # already 0..1
        df['cleaning_score'] = minmax_col(df['cleaning_score_raw'])
        out = df[['train_id',
                          'clean_age_hours',
                          'clean_freshness_raw','clean_freshness',
                          'today_clean_load','clean_today_penalty_norm',
                          'cleaning_score_raw','cleaning_score']].copy()
        out = out.rename(columns={
            'clean_today_penalty_norm': 'clean_today_penalty'
        })
        out = df[['train_id']].merge(out, on='train_id', how='left')
        out['clean_age_hours'] = out['clean_age_hours'].fillna(99999.0)
        out['clean_freshness_raw'] = out['clean_freshness_raw'].fillna(0.0)
        out['clean_freshness'] = out['clean_freshness'].fillna(0.0)
        out['today_clean_load'] = out['today_clean_load'].fillna(0.0)
        out['clean_today_penalty'] = out['clean_today_penalty'].fillna(0.0)
        out['cleaning_score_raw'] = out['cleaning_score_raw'].fillna(0.0)
        out['cleaning_score'] = out['cleaning_score'].fillna(0.0)
        feature_scores = feature_scores.merge(out[['train_id', 'cleaning_score']], on='train_id', how='left')

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


        return df, feature_scores

    def rank_trains(df):
        df, feature_scores = compute_scores(df)
        df['eligible'] = (df['fitness_days_left'] > 0) & (df['open_wo_hours'] <= 0)
        df = df.sort_values(
            by=['eligible', 'priority_score'],
            ascending=[False, False]  # eligible=True first, then highest score first
        ).reset_index(drop=True)
        return df, feature_scores

    priority_df, feature_scores = rank_trains(df)

    avg_fitness_days = df['fitness_days_left'].mean()
    avg_branding_hours = df['branding_hours'].mean()
    avg_delta_km = df['delta_km'].mean()
    avg_clean_age = df['clean_age_hours'].mean()
    avg_clean_load = df['today_clean_load'].mean()
    median_position = df['slot_idx'].median()

    def get_comparative_reasons(row):
        reasons = []

        if row['fitness_days_left'] <= 0:
            reasons.append(f"-Expired fitness certificate")
        elif row['fitness_days_left'] > avg_fitness_days * 1.1:  # 10% threshold
            reasons.append(f"+Fitness: High days left ({row['fitness_days_left']} vs. avg {avg_fitness_days:.1f})")
        elif row['fitness_days_left'] < avg_fitness_days * 0.9:
            reasons.append(f"-Fitness: Low days left ({row['fitness_days_left']} vs. avg {avg_fitness_days:.1f})")

        if row['open_wo_count'] > 0:
            wo = wo_df[wo_df['train_id'] == row['train_id']]
            if not wo.empty:
                job = wo.iloc[0]['asset']
                estimated_hours = wo.iloc[0]['estimated_hours']
                reasons.append(f"Ineligible: Open work order on {job} ({estimated_hours} hrs approx.)")

        if row['branding_hours'] > avg_branding_hours * 1.1:
            reasons.append(f"+Branding: High exposure hours ({row['branding_hours']} vs. avg {avg_branding_hours:.1f})")
        elif row['branding_hours'] < avg_branding_hours * 0.9:
            reasons.append(f"-Branding: Low exposure hours ({row['branding_hours']} vs. avg {avg_branding_hours:.1f})")

        if row['delta_km'] > avg_delta_km * 1.1:
            reasons.append(f"-Mileage: High traveled distance ({row['delta_km']} km vs. avg {avg_delta_km:.1f})")
        elif row['delta_km'] < avg_delta_km * 0.9:
            reasons.append(f"+Mileage: Low traveled distance ({row['delta_km']} km vs. avg {avg_delta_km:.1f})")

        if row['clean_age_hours'] < avg_clean_age * 0.9:
            reasons.append(f"+Cleaning: Recently cleaned ({row['clean_age_hours']:.1f} hrs ago vs. avg {avg_clean_age:.1f})")
        elif row['clean_age_hours'] > avg_clean_age * 1.1:
            reasons.append(f"-Cleaning: Long since last clean ({row['clean_age_hours']:.1f} hrs ago vs. avg {avg_clean_age:.1f})")
        if row['today_clean_load'] > avg_clean_load * 1.1:
            reasons.append(f"-Cleaning: High load today ({row['today_clean_load']:.1f} hrs vs. avg {avg_clean_load:.1f})")

        if row['slot_idx'] < median_position:
            reasons.append(f"+Stabling: Forward position on stabling line - minimal shunting")
        elif row['slot_idx'] > median_position:
            reasons.append(f"-Stabling: Rear position on stabling line - high shunting")

        return " | ".join(reasons) if reasons else "Balanced across features"

    df['reasons'] = df.apply(get_comparative_reasons, axis=1)

    priority_df = priority_df.merge(
        df[['train_id', 'reasons']],
        on='train_id',
        how='left'
    )
    priority_df.to_csv("../data/priority_score.csv", index=False)
