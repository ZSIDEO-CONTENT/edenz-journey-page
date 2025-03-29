from fastapi import FastAPI, HTTPException, Depends, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import json
import os
import uuid
from datetime import datetime
import supabase
import re
from crewai import Agent, Task, Crew, Process
from langchain.chat_models import ChatOpenAI

# Load environment variables
os.environ["OPENAI_API_KEY"] = "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"
os.environ["OPENAI_API_BASE"] = "https://openrouter.ai/api/v1"

# Configure security
security = HTTPBearer()
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin123")

# Simple token verification for admin access - kept for backward compatibility
def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        # We're now using Supabase Auth, but keeping this function for API compatibility
        # For external API calls, we still check the simple token
        if credentials.credentials != f"{ADMIN_USERNAME}:{ADMIN_PASSWORD}":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return ADMIN_USERNAME
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

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
    action: Optional[str] = None
    booking_data: Optional[Dict[str, Any]] = None

class ConsultationBooking(BaseModel):
    name: str
    email: str
    phone: str
    date: str
    time: str
    service: Optional[str] = None
    message: Optional[str] = None
    status: str = "pending"
    created_at: Optional[datetime] = None
    session_id: Optional[str] = None

class AdminLoginRequest(BaseModel):
    username: str
    password: str

class AdminLoginResponse(BaseModel):
    access_token: str
    token_type: str

class AdminUserCreate(BaseModel):
    username: str
    password: str
    role: str = "admin"

class AdminUser(BaseModel):
    id: str
    username: str
    role: str
    created_at: datetime

def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hash"""
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_jwt_token(username: str) -> str:
    """Create a JWT token for user authentication"""
    payload = {
        "sub": username,
        "exp": datetime.utcnow() + datetime.timedelta(minutes=JWT_EXPIRATION_MINUTES)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def init_admin_user():
    """Initialize default admin user if not exists"""
    try:
        # Check if admin user exists
        response = supabase_client.table("admin_users").select("*").eq("username", ADMIN_USERNAME).execute()
        if not response.data:
            # Create default admin user
            hashed_password = hash_password(ADMIN_PASSWORD)
            supabase_client.table("admin_users").insert({
                "username": ADMIN_USERNAME,
                "password_hash": hashed_password,
                "role": "admin",
                "created_at": datetime.now().isoformat()
            }).execute()
            print(f"Created default admin user: {ADMIN_USERNAME}")
    except Exception as e:
        print(f"Error initializing admin user: {str(e)}")

# Create the Edenz Consultant agent
edenz_agent = Agent(
    role="Study Abroad Education Consultant",
    goal="Help students find the best study abroad opportunities and book consultations",
    backstory="""You are an AI assistant for Edenz Consultants, a leading Pakistani education consultancy 
    specializing in helping students pursue their dreams of studying abroad. You have extensive knowledge 
    about university programs, visa requirements, scholarship opportunities, and the application process 
    for studying all around the world and dream destinations like UK, USA, Germany, Australia, France, Italy.
    You are friendly, knowledgeable, and always focused on providing accurate information to help 
    students make informed decisions about their education abroad. When users express interest in booking a consultation,
    you should collect their name, email, phone number, preferred date, and time.""",
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

def save_consultation_to_db(booking_data: Dict[str, Any]) -> None:
    """Save consultation booking to Supabase database"""
    try:
        supabase_client.table("consultations").insert({
            **booking_data,
            "created_at": datetime.now().isoformat(),
            "status": "pending"
        }).execute()
        print(f"Consultation saved: {booking_data}")
    except Exception as e:
        print(f"Error saving consultation: {str(e)}")

def get_chat_history(session_id: str) -> List[Dict[str, Any]]:
    """Retrieve chat history from Supabase database"""
    try:
        response = supabase_client.table("chat_messages").select("*").eq("session_id", session_id).order("timestamp").execute()
        return response.data
    except Exception as e:
        print(f"Error retrieving chat history: {str(e)}")
        return []

def extract_booking_info(message: str, history: List[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    """
    Extract consultation booking information from the conversation
    Returns None if not enough information is available
    """
    # Combine history and current message to analyze
    combined_text = " ".join([msg["content"] for msg in history if msg["sender"] == "user"]) + " " + message
    
    # Look for booking intent
    booking_intent = re.search(r'(book|schedule|appoint|consult|meet)', combined_text.lower())
    if not booking_intent:
        return None
    
    # Try to extract information
    name_match = re.search(r'name\s?[is:]*\s?([A-Za-z\s]+)', combined_text)
    email_match = re.search(r'[\w\.-]+@[\w\.-]+', combined_text)
    phone_match = re.search(r'phone[:\s]*([+\d\s-]{10,})', combined_text) or re.search(r'(\+\d{1,3}[-\s]?\d{3,}[-\s]?\d{3,}[-\s]?\d{3,})', combined_text)
    date_match = re.search(r'(date|day)[:\s]*([\w\s,]+\d{1,2}(?:st|nd|rd|th)?[\s,]*(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)?[\s,]*\d{4}?)', combined_text, re.IGNORECASE)
    time_match = re.search(r'(time|hour)[:\s]*(\d{1,2}[:.]\d{2}\s*(?:am|pm|AM|PM)?|\d{1,2}\s*(?:am|pm|AM|PM))', combined_text, re.IGNORECASE)
    
    # If we have name and either email or phone, consider it a valid booking intent
    if name_match and (email_match or phone_match):
        booking_data = {
            "name": name_match.group(1).strip() if name_match else "Unknown",
            "email": email_match.group(0) if email_match else "",
            "phone": phone_match.group(1).strip() if phone_match and len(phone_match.groups()) > 0 else "",
            "date": date_match.group(2).strip() if date_match and len(date_match.groups()) > 1 else "",
            "time": time_match.group(2).strip() if time_match and len(time_match.groups()) > 1 else "",
            "message": message,
        }
        return booking_data
    
    return None

def generate_agent_response(message: str, history: List[Dict[str, Any]] = None) -> tuple:
    """Generate response using Crew AI agent and check for consultation booking intent"""
    try:
        # Check if this is a booking request
        booking_data = extract_booking_info(message, history or [])
        
        # Create a task for the agent
        booking_prompt = ""
        if booking_data and (not booking_data.get("date") or not booking_data.get("time")):
            # If we detected booking intent but missing info
            booking_prompt = ". The user wants to book a consultation but I need more information. Ask for missing details like name, email, phone, preferred date, and time."
        
        task = Task(
            description=f"Respond to the user message: '{message}'{booking_prompt}. Be helpful, accurate, and friendly. If you don't know the answer, suggest booking a consultation with an Edenz education expert.",
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
        
        # Check if we have complete booking data
        if booking_data and booking_data.get("date") and booking_data.get("time"):
            # We have complete booking data
            return result, "booking_confirmed", booking_data
        elif booking_data:
            # We have partial booking data
            return result, "booking_started", None
        
        return result, None, None
    except Exception as e:
        print(f"Error generating agent response: {str(e)}")
        return fallback_response(message), None, None

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
        return "You can book a consultation with our experts. Please provide your name, email, phone number, and preferred date and time."
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
            response, action, booking_data = generate_agent_response(request.message, history)
            
            # Save consultation booking if confirmed
            if action == "booking_confirmed" and booking_data:
                booking_data["session_id"] = session_id
                save_consultation_to_db(booking_data)
                
                # Add confirmation to response
                response += "\n\nThank you! Your consultation has been booked. We'll confirm the details shortly."
        except Exception as e:
            print(f"Agent error: {str(e)}")
            response, action, booking_data = fallback_response(request.message), None, None
        
        # Save to database
        try:
            save_chat_to_db(session_id, request.message, response)
        except Exception as e:
            print(f"Database error: {str(e)}")
        
        return {
            "response": response,
            "session_id": session_id,
            "success": True,
            "action": action,
            "booking_data": booking_data
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

@app.post("/login", response_model=AdminLoginResponse)
async def admin_login(request: AdminLoginRequest):
    """
    Admin login endpoint (kept for backward compatibility)
    """
    try:
        # Backward compatibility for the simple login
        if request.username == ADMIN_USERNAME and request.password == ADMIN_PASSWORD:
            # Return a simple token for backward compatibility
            return {
                "access_token": f"{ADMIN_USERNAME}:{ADMIN_PASSWORD}",
                "token_type": "bearer"
            }
            
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        print(f"Login error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Authentication error",
        )

@app.get("/consultations", dependencies=[Depends(get_current_admin)])
async def get_consultations():
    """
    Get all consultation bookings (admin only)
    """
    try:
        response = supabase_client.table("consultations").select("*").order("created_at", desc=True).execute()
        return {"consultations": response.data}
    except Exception as e:
        print(f"Error retrieving consultations: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.patch("/consultations/{booking_id}", dependencies=[Depends(get_current_admin)])
async def update_consultation_status(booking_id: str, status: str):
    """
    Update consultation status (admin only)
    """
    try:
        response = supabase_client.table("consultations").update({"status": status}).eq("id", booking_id).execute()
        return {"success": True, "updated": response.data}
    except Exception as e:
        print(f"Error updating consultation: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/admin/users", response_model=Dict[str, List[Dict[str, Any]]])
async def get_admin_users(username: str = Depends(get_current_admin)):
    """
    Get all admin users (admin only) - Now using Supabase Auth
    """
    try:
        # This would now fetch users from Supabase Auth
        return {"users": []} # Simplified as we're using Supabase Auth UI
    except Exception as e:
        print(f"Error retrieving admin users: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/admin/users", status_code=status.HTTP_201_CREATED)
async def create_admin_user(user: AdminUserCreate, username: str = Depends(get_current_admin)):
    """
    Create a new admin user (admin only) - Now redirects to Supabase Auth
    """
    try:
        # This would now be managed through Supabase Auth UI
        return {"message": "Please use Supabase Auth interface to manage users"}
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Error creating admin user: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.on_event("startup")
async def startup_event():
    """Initialize app on startup"""
    try:
        # No initialization needed as we're using Supabase Auth
        pass
    except Exception as e:
        print(f"Startup error: {str(e)}")

# Start the server with: uvicorn main:app --reload
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
