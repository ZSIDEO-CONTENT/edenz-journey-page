
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os

# Import routers
from api.routers import chat, students, consultations, recommendations, documents, auth

# Initialize FastAPI app
app = FastAPI(title="Edenz AI API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat.router)
app.include_router(students.router)
app.include_router(consultations.router)
app.include_router(recommendations.router)
app.include_router(documents.router)
app.include_router(auth.router)

@app.get("/health")
async def health_check():
    """
    Simple health check endpoint
    """
    return {"status": "healthy", "service": "Edenz AI API"}

# Start the server with: uvicorn main:app --reload
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
