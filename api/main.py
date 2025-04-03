
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from api.routers import auth, students, documents, recommendations, consultations, chat, questionnaires, processing
import os

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
