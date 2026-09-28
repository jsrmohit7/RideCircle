from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, users, rides, ratings, reports
from app.core.config import settings

app = FastAPI(
    title="RideCircle API",
    description="API for the RideCircle student mobility platform.",
    version="1.0.0"
)

origins = settings.FRONTEND_URL.split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(rides.router)
app.include_router(ratings.router)
app.include_router(reports.router)

@app.get("/health")
def health_check():
    return {"status": "ok"}

