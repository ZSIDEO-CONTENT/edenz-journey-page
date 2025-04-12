
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from api.routers import auth, students, documents, recommendations, consultations, chat, questionnaires, processing
from api.db import initialize_database
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(title="Edenz API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database on startup
@app.on_event("startup")
async def startup_db_client():
    try:
        logger.info("Initializing database...")
        initialize_database()
        logger.info("Database initialization complete")
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        # Continue running the app even if DB init fails

# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(students.router, prefix="/api")
app.include_router(documents.router, prefix="/api")
app.include_router(recommendations.router, prefix="/api")
app.include_router(consultations.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
app.include_router(questionnaires.router, prefix="/api")
app.include_router(processing.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Welcome to the Edenz API"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/api/version")
async def version():
    return {"version": app.version}
