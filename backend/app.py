from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os
from backend.ranking import generate_priority_df

app = FastAPI(title="Galactus Ranking API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js dev
    allow_methods=["*"],
    allow_headers=["*"],
)

'''
@app.get("/api/ranked")
def get_ranked(limit: int = 100):
    if not os.path.exists(OUTPUT_CSV):
        return {"data": []}
    df = pd.read_csv(OUTPUT_CSV)
    return {"count": len(df), "data": df.head(limit).to_dict(orient="records")}
'''

@app.post("/api/run-optimization")
def run_optimization_post():
    generate_priority_df()
    return {"message": "Optimization complete"}

@app.get("/api/run-optimization")
def run_optimization_get(limit: int = 100):
    ranked = pd.read_csv("../data/priority_score.csv")
    return {"data": ranked.head(limit).to_dict(orient="records")}

