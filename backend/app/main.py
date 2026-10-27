from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import Base, engine
from app.api import (
    routes_auth,
    routes_products,
    routes_analysis,
    routes_analytics,
    routes_dataset,
    routes_model
)

# Ensure database tables exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="ReviewIQ AI — Aspect-Based Sentiment Analysis of Customer Reviews using NLP",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routes
app.include_router(routes_auth.router, prefix=settings.API_V1_STR)
app.include_router(routes_products.router, prefix=settings.API_V1_STR)
app.include_router(routes_analysis.router, prefix=settings.API_V1_STR)
app.include_router(routes_analytics.router, prefix=settings.API_V1_STR)
app.include_router(routes_dataset.router, prefix=settings.API_V1_STR)
app.include_router(routes_model.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "app": settings.PROJECT_NAME,
        "tagline": "Turn Customer Opinions into Actionable Intelligence.",
        "status": "online",
        "docs": "/docs",
        "version": "1.0.0"
    }

@app.get("/api/health")
def health():
    return {"status": "healthy"}
