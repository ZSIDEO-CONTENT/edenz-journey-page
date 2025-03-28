
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import json
import os
import uuid
from datetime import datetime
import supabase
from crewai import Agent, Task, Crew, Process
from langchain.chat_models import ChatOpenAI

os.environ["OPENAI_API_KEY"] = "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"
os.environ["OPENAI_API_BASE"] = "https://openrouter.ai/api/v1"


llm = ChatOpenAI(model_name="deepseek/deepseek-r1:free")
# Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL", "https://vxievjimtordkobtuink.supabase.co")
supabase_key = os.getenv("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4aWV2amltdG9yZGtvYnR1aW5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwOTEyNDEsImV4cCI6MjA1ODY2NzI0MX0.h_YWBX9nhfGlq6MaR3jSDu56CagNpoprBgqiXwjhJAI")
supabase_client = supabase.create_client(supabase_url, supabase_key)

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
    timestamp: Optional[datetime] = None
    session_id: Optional[str] = None

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    session_id: str
    success: bool

# Initialize the language model
# llm = HuggingFaceHub(
#     repo_id="Qwen/Qwen2.5-Omni-7B", 
#     model_kwargs={"temperature": 0.7, "max_length": 512}, 
#     huggingfacehub_api_token=huggingface_api_key
# )

# Create the Edenz Consultant agent

edenz_agent = Agent(
    role="Study Abroad Education Consultant",
    goal="Help students find the best study abroad opportunities",
    backstory="""You are an AI assistant for Edenz Consultants, a leading Pakistani education consultancy 
    specializing in helping students pursue their dreams of studying abroad. You have extensive knowledge 
    about university programs, visa requirements, scholarship opportunities, and the application process 
    for studying all around the world and dream destinations like UK, USA, Germany, Australia, France, Italy.
    You are friendly, knowledgeable, and always focused on providing accurate information to help 
    students make informed decisions about their education abroad.""",
    verbose=True,
    allow_delegation=False,
    llm=llm
)

def save_chat_to_db(session_id: str, message: str, response: str) -> None:
    """Save chat messages to Supabase database"""
    try:
        # Save user message
        supabase_client.table("chat_messages").insert({
            "session_id": session_id,
            "content": message,
            "sender": "user",
            "timestamp": datetime.now().isoformat()
        }).execute()
        
        # Save bot response
        supabase_client.table("chat_messages").insert({
            "session_id": session_id,
            "content": response,
            "sender": "bot",
            "timestamp": datetime.now().isoformat()
        }).execute()
    except Exception as e:
        print(f"Error saving to database: {str(e)}")

def get_chat_history(session_id: str) -> List[Dict[str, Any]]:
    """Retrieve chat history from Supabase database"""
    try:
        response = supabase_client.table("chat_messages").select("*").eq("session_id", session_id).order("timestamp").execute()
        return response.data
    except Exception as e:
        print(f"Error retrieving chat history: {str(e)}")
        return []

def generate_agent_response(message: str, history: List[Dict[str, Any]] = None) -> str:
    """Generate response using Crew AI agent"""
    try:
        # Create a task for the agent
        task = Task(
            description=f"Respond to the user message: '{message}'. Be helpful, accurate, and friendly. If you don't know the answer, suggest booking a consultation with an Edenz education expert.",
            agent=edenz_agent
        )
        
        # Create a crew with just our agent
        crew = Crew(
            agents=[edenz_agent],
            tasks=[task],
            process=Process.sequential,
            verbose=True
        )
        
        # Get the result
        result = crew.kickoff()
        return result
    except Exception as e:
        print(f"Error generating agent response: {str(e)}")
        return fallback_response(message)

def fallback_response(message: str) -> str:
    """Fallback response when AI agent fails"""
    # Simple intent detection for fallback
    message = message.lower()
    
    if any(word in message for word in ["hello", "hi", "hey", "greetings"]):
        return "Hello! I'm Edenz AI. How can I help with your study abroad journey?"
    elif any(word in message for word in ["about", "who", "what is", "edenz"]):
        return "Edenz Consultants is a leading education consultancy specializing in helping students pursue their dreams of studying abroad."
    elif any(word in message for word in ["country", "countries", "where", "location", "study in"]):
        return "We assist with applications to universities in over 50 countries including the UK, USA, Canada, Australia, and New Zealand."
    elif any(word in message for word in ["service", "offer", "help", "assist", "provide"]):
        return "Our services include university selection, application assistance, visa guidance, and pre-departure support."
    elif any(word in message for word in ["book", "consult", "appointment", "schedule", "talk", "expert"]):
        return "You can book a consultation with our experts through our website or by calling our office. Would you like me to help you schedule one?"
    else:
        return "Thank you for your question. Our education counselors can provide more detailed information. Would you like to book a consultation?"

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Process a chat message and return a response
    """
    try:
        if not request.message.strip():
            raise HTTPException(status_code=400, detail="Message cannot be empty")
        
        # Use provided session_id or generate a new one
        session_id = request.session_id or str(uuid.uuid4())
        
        # Get chat history if session_id exists
        history = get_chat_history(session_id) if request.session_id else []
        
        # Generate response
        try:
            response = generate_agent_response(request.message, history)
        except Exception as e:
            print(f"Agent error: {str(e)}")
            response = fallback_response(request.message)
        
        # Save to database
        try:
            save_chat_to_db(session_id, request.message, response)
        except Exception as e:
            print(f"Database error: {str(e)}")
        
        return {
            "response": response,
            "session_id": session_id,
            "success": True
        }
    except Exception as e:
        print(f"General error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """
    Simple health check endpoint
    """
    return {"status": "healthy", "service": "Edenz AI Chat API"}

@app.get("/chat/history/{session_id}")
async def get_chat_session(session_id: str):
    """
    Get chat history for a session
    """
    history = get_chat_history(session_id)
    return {"session_id": session_id, "messages": history}

# Start the server with: uvicorn main:app --reload
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
