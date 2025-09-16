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

DATA_DIR = "./data"

@app.post("/api/run-optimization")
def run_optimization_post():
    generate_priority_df()
    return {"message": "Optimization complete"}

@app.get("/api/run-optimization")
def run_optimization_get(limit: int = 100):
    ranked = pd.read_csv(os.path.join(DATA_DIR,"priority_score.csv"))
    return {"data": ranked.head(limit).to_dict(orient="records")}

