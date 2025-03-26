
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import json
import os

app = FastAPI(title="Edenz AI Chat API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    content: str
    sender: str

class ChatRequest(BaseModel):
    message: str

# Simple response templates - in a real app, this would be more sophisticated
responses = {
    "greeting": [
        "Hello! I'm Edenz AI. How can I help with your study abroad journey?",
        "Hi there! I'm here to assist with all your study abroad questions."
    ],
    "about_edenz": [
        "Edenz Consultants is a leading education consultancy specializing in helping students pursue their dreams of studying abroad.",
        "We at Edenz Consultants have helped thousands of students achieve their international education goals."
    ],
    "countries": [
        "We assist with applications to universities in over 50 countries including the UK, USA, Canada, Australia, and New Zealand.",
        "Edenz supports study programs in more than 50 countries worldwide. Our most popular destinations include the UK, USA, Canada, and Australia."
    ],
    "services": [
        "Our services include university selection, application assistance, visa guidance, and pre-departure support.",
        "We offer comprehensive services including course selection, university applications, visa processing, and pre-departure orientation."
    ],
    "consultation": [
        "You can book a consultation with our experts through our website or by calling our office. Would you like me to help you schedule one?",
        "Our counselors are available for personal consultations. Would you like to book an appointment?"
    ],
    "default": [
        "Thank you for your question. Our education counselors can provide more detailed information. Would you like to book a consultation?",
        "That's a great question. For more personalized advice, I recommend speaking with one of our education experts. Can I help you book a consultation?"
    ]
}

def get_response_category(message: str) -> str:
    """
    Simple intent detection - in a real app, this would use a more sophisticated NLP model
    """
    message = message.lower()
    
    if any(word in message for word in ["hello", "hi", "hey", "greetings"]):
        return "greeting"
    elif any(word in message for word in ["about", "who", "what is", "edenz"]):
        return "about_edenz"
    elif any(word in message for word in ["country", "countries", "where", "location", "study in"]):
        return "countries"
    elif any(word in message for word in ["service", "offer", "help", "assist", "provide"]):
        return "services"
    elif any(word in message for word in ["book", "consult", "appointment", "schedule", "talk", "expert"]):
        return "consultation"
    else:
        return "default"

@app.post("/chat", response_model=Dict[str, Any])
async def chat(request: ChatRequest):
    """
    Process a chat message and return a response
    """
    try:
        if not request.message.strip():
            raise HTTPException(status_code=400, detail="Message cannot be empty")
        
        category = get_response_category(request.message)
        import random
        response = random.choice(responses[category])
        
        return {
            "response": response,
            "success": True
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """
    Simple health check endpoint
    """
    return {"status": "healthy", "service": "Edenz AI Chat API"}

# Start the server with: uvicorn main:app --reload
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
