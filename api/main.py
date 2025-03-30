
from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os
import uuid
from datetime import datetime
import supabase
import re
import requests
from crewai import Agent, Task, Crew, Process
from langchain.chat_models import ChatOpenAI

# Load environment variables
os.environ["OPENAI_API_KEY"] = "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"
os.environ["OPENAI_API_BASE"] = "https://openrouter.ai/api/v1"

# Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL", "https://vxievjimtordkobtuink.supabase.co")
supabase_key = os.getenv("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4aWV2amltdG9yZGtvYnR1aW5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwOTEyNDEsImV4cCI6MjA1ODY2NzI0MX0.h_YWBX9nhfGlq6MaR3jSDu56CagNpoprBgqiXwjhJAI")
supabase_client = supabase.create_client(supabase_url, supabase_key)

# Initialize LLM with explicit credentials
llm = ChatOpenAI(
    model_name="deepseek/deepseek-r1:free",
    openai_api_key="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",
    openai_api_base="https://openrouter.ai/api/v1"
)

app = FastAPI(title="Edenz AI Chat API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None

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

class ChatHistoryItem(BaseModel):
    content: str
    sender: str  # 'user' or 'bot'
    timestamp: Optional[datetime] = None
    session_id: str

# Create the Edenz Consultant agent with explicit API key
edenz_agent = Agent(
    role="Study Abroad Education Consultant",
    goal="Help students find the best study abroad opportunities and book consultations",
    backstory="""You are an AI assistant for Edenz Consultants, a leading Pakistani education consultancy 
    specializing in helping students pursue their dreams of studying abroad. You have extensive knowledge 
    about university programs, visa requirements, scholarship opportunities, and the application process 
    for studying all around the world and dream destinations like UK, USA, Germany, Australia, France, Italy.
    
    Edenz Consultants is led by Dr. Taimoor Ali Ahmad, who holds a PhD in Advanced Materials from Germany. 
    Dr. Ahmad personally oversees consultations and brings his international academic experience to help students.
    
    You are friendly, knowledgeable, and always focused on providing accurate information to help 
    students make informed decisions about their education abroad. When users express interest in booking a consultation,
    you should collect their name, email, phone number, preferred date, and time. Let them know they'll be meeting 
    directly with Dr. Taimoor Ali Ahmad for personalized guidance.""",
    verbose=True,
    allow_delegation=False,
    llm=llm
)

def save_consultation_to_db(booking_data: Dict[str, Any]) -> str:
    """Save consultation booking to Supabase database and return the ID"""
    try:
        result = supabase_client.table("consultations").insert({
            **booking_data,
            "created_at": datetime.now().isoformat(),
            "status": "pending"
        }).execute()
        
        # Extract the ID of the created consultation
        if result and hasattr(result, "data") and len(result.data) > 0:
            consultation_id = result.data[0].get("id")
            print(f"Consultation saved with ID: {consultation_id}")
            return consultation_id
        else:
            print("Consultation saved but couldn't retrieve ID")
            return ""
    except Exception as e:
        print(f"Error saving consultation: {str(e)}")
        return ""

def save_chat_message(message: str, sender: str, session_id: str) -> bool:
    """Save chat message to Supabase database"""
    try:
        result = supabase_client.table("chat_history").insert({
            "content": message,
            "sender": sender,
            "session_id": session_id,
            "timestamp": datetime.now().isoformat()
        }).execute()
        
        return True
    except Exception as e:
        print(f"Error saving chat message: {str(e)}")
        return False

def get_chat_history(session_id: str) -> List[Dict[str, Any]]:
    """Retrieve chat history for a session from Supabase database"""
    try:
        result = supabase_client.table("chat_history").select("*").eq("session_id", session_id).order("timestamp").execute()
        
        if result and hasattr(result, "data"):
            return result.data
        return []
    except Exception as e:
        print(f"Error retrieving chat history: {str(e)}")
        return []

def send_confirmation_email(booking_data: Dict[str, Any]) -> bool:
    """Send confirmation email to the client"""
    try:
        # In a production environment, you would use a proper email service like SendGrid, Mailgun, etc.
        # For now, we'll simulate the email sending
        print(f"Sending confirmation email to: {booking_data['email']}")
        print(f"Email content: Consultation booked for {booking_data['name']} on {booking_data['date']} at {booking_data['time']} with Dr. Taimoor Ali Ahmad")
        
        # Here would be the actual email sending code
        # Example with SendGrid:
        # from sendgrid import SendGridAPIClient
        # from sendgrid.helpers.mail import Mail
        # message = Mail(from_email='info@edenzconsultant.org', to_emails=booking_data['email'])
        # message.subject = 'Your Edenz Consultants Appointment Confirmation'
        # message.html_content = f'Dear {booking_data["name"]}, your consultation has been booked for {booking_data["date"]} at {booking_data["time"]} with Dr. Taimoor Ali Ahmad.'
        # sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
        # response = sg.send(message)
        
        return True
    except Exception as e:
        print(f"Error sending confirmation email: {str(e)}")
        return False

def send_whatsapp_notification(booking_data: Dict[str, Any]) -> bool:
    """Send WhatsApp notification to the client if a valid WhatsApp number is provided"""
    try:
        phone = booking_data['phone'].strip()
        
        # Basic validation for a potential WhatsApp number (starts with + and has at least 10 digits)
        is_valid_whatsapp = bool(re.match(r'^\+?\d{10,}$', phone.replace(" ", "").replace("-", "")))
        
        if is_valid_whatsapp:
            # In a production environment, you would use a WhatsApp Business API or services like Twilio
            # For now, we'll simulate the WhatsApp sending
            print(f"Sending WhatsApp notification to: {phone}")
            print(f"WhatsApp content: Consultation booked for {booking_data['name']} on {booking_data['date']} at {booking_data['time']} with Dr. Taimoor Ali Ahmad")
            
            # Here would be the actual WhatsApp sending code
            # Example with Twilio:
            # from twilio.rest import Client
            # account_sid = os.environ['TWILIO_ACCOUNT_SID']
            # auth_token = os.environ['TWILIO_AUTH_TOKEN']
            # client = Client(account_sid, auth_token)
            # message = client.messages.create(
            #     from_='whatsapp:+14155238886',  # Your Twilio WhatsApp number
            #     body=f'Dear {booking_data["name"]}, your consultation has been booked for {booking_data["date"]} at {booking_data["time"]} with Dr. Taimoor Ali Ahmad.',
            #     to=f'whatsapp:{phone}'
            # )
            
            return True
        else:
            print(f"Invalid WhatsApp number format: {phone}. Skipping WhatsApp notification.")
            return False
    except Exception as e:
        print(f"Error sending WhatsApp notification: {str(e)}")
        return False

def notify_booking(booking_data: Dict[str, Any]) -> Dict[str, bool]:
    """Send notifications about the booking to the client"""
    email_sent = send_confirmation_email(booking_data)
    whatsapp_sent = send_whatsapp_notification(booking_data)
    
    return {
        "email_sent": email_sent,
        "whatsapp_sent": whatsapp_sent
    }

def extract_booking_info(message: str, history: List[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    """
    Extract consultation booking information from the conversation
    Returns None if not enough information is available
    """
    # Combine current message with history to provide context
    context = ""
    for item in history:
        context += f"{item['sender']}: {item['content']}\n"
    context += f"user: {message}"
    
    # Setup extraction task for the agent
    try:
        task = Task(
            description=f"""Extract booking information from this conversation: '{context}'. 
            Look for name, email, phone, preferred date and time. If any of this information is missing, return None.
            Return the data in a structured format if all required fields are found.""",
            agent=edenz_agent
        )
        
        # Create a crew with just our agent
        crew = Crew(
            agents=[edenz_agent],
            tasks=[task],
            process=Process.sequential,
            verbose=True
        )
        
        result = crew.kickoff()
        
        # Parse the result to extract booking information
        # This is a simplified approach - in production you'd use more robust parsing
        if "name:" in result.lower() and "email:" in result.lower() and "phone:" in result.lower():
            # Simple regex patterns to extract information
            name_match = re.search(r"name:\s*([^\n]+)", result, re.IGNORECASE)
            email_match = re.search(r"email:\s*([^\n]+)", result, re.IGNORECASE)
            phone_match = re.search(r"phone:\s*([^\n]+)", result, re.IGNORECASE)
            date_match = re.search(r"date:\s*([^\n]+)", result, re.IGNORECASE)
            time_match = re.search(r"time:\s*([^\n]+)", result, re.IGNORECASE)
            
            if name_match and email_match and phone_match and date_match and time_match:
                booking_data = {
                    "name": name_match.group(1).strip(),
                    "email": email_match.group(1).strip(),
                    "phone": phone_match.group(1).strip(),
                    "date": date_match.group(1).strip(),
                    "time": time_match.group(1).strip()
                }
                return booking_data
    
    except Exception as e:
        print(f"Error extracting booking info: {str(e)}")
    
    return None

def format_history_for_agent(history: List[Dict[str, Any]]) -> str:
    """Format chat history for the agent to use as context"""
    formatted_history = ""
    
    # Get the last 10 messages for context (or all if less than 10)
    recent_history = history[-10:] if len(history) > 10 else history
    
    for item in recent_history:
        formatted_history += f"{item['sender']}: {item['content']}\n"
    
    return formatted_history

def generate_agent_response(message: str, history: List[Dict[str, Any]] = None) -> tuple:
    """Generate response using Crew AI agent and check for consultation booking intent"""
    try:
        # Format history for context
        context = format_history_for_agent(history if history else [])
        
        # Check for booking information
        booking_data = extract_booking_info(message, history if history else [])
        
        # If booking data is complete, confirm the booking
        if booking_data and all(key in booking_data and booking_data[key] for key in ["name", "email", "phone", "date", "time"]):
            print("Complete booking information detected!")
            return (f"Thank you, {booking_data['name']}! I'm pleased to confirm your consultation with Dr. Taimoor Ali Ahmad on {booking_data['date']} at {booking_data['time']}. We'll be sending a confirmation to your email ({booking_data['email']}) shortly. If you need to make any changes, please reach out to us. Dr. Ahmad is looking forward to meeting with you and discussing your study abroad plans.", 
                    "booking_confirmed", 
                    booking_data)
        
        # Define a task with context from chat history
        task = Task(
            description=f"""Given this conversation history: '{context}' 
            Respond to the user's latest message: '{message}'. 
            Be helpful, accurate, and friendly. If you don't know the answer, suggest booking a consultation with Dr. Taimoor Ali Ahmad, 
            who leads Edenz Consultants and has a PhD in Advanced Materials from Germany. 
            If the user asks about Dr. Ahmad, mention his expertise and international experience.
            If the user seems interested in booking a consultation, ask for their name, email, phone, preferred date and time. 
            Ensure that the response you provide is well structured and easy to read.""",
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
        try:
            result = crew.kickoff()
            print(f"Agent response generated successfully: {result[:100]}...")  # Log first 100 chars of successful response
            
            # Check if response suggests booking is in progress
            booking_keywords = ["name", "email", "phone", "date", "time", "schedule", "book"]
            is_booking_related = sum(1 for keyword in booking_keywords if keyword in result.lower()) >= 3
            
            if is_booking_related and not booking_data:
                return result, "booking_started", None
            else:
                return result, None, None

        except Exception as e:
            print(f"Detailed error in crew.kickoff(): {str(e)}")
            return fallback_response(message), None, None
        
    except Exception as e:
        print(f"Error generating agent response: {str(e)}")
        return fallback_response(message), None, None

def fallback_response(message: str) -> str:
    """Fallback response when AI agent fails"""
    if "Dr" in message or "Taimoor" in message or "Ahmad" in message or "CEO" in message:
        return "Dr. Taimoor Ali Ahmad is the CEO of Edenz Consultants with a PhD in Advanced Materials from Germany. He personally oversees consultations to provide expert guidance. Would you like to book a consultation with him?"
    
    if "book" in message.lower() or "consult" in message.lower() or "appointment" in message.lower():
        return "We'd be happy to book a consultation for you with Dr. Taimoor Ali Ahmad. Could you please provide your name, email, phone number, and preferred date and time?"
    
    return "Thank you for your question. Our education counselors led by Dr. Taimoor Ali Ahmad can provide more detailed information. Would you like to book a consultation?"

@app.post("/chat")
async def chat(chat_request: ChatRequest):
    """
    Process a chat message and return a response
    """
    try:
        if not chat_request.message.strip():
            raise HTTPException(status_code=400, detail="Message cannot be empty")
        
        # Use provided session_id or generate a new one
        session_id = chat_request.session_id or str(uuid.uuid4())
        
        # Get chat history from the database
        history = get_chat_history(session_id)
        
        print(f"Generating response for: '{chat_request.message}'")
        
        # Save user message to history
        save_chat_message(chat_request.message, "user", session_id)
        
        # Generate response
        try:
            response, action, booking_data = generate_agent_response(chat_request.message, history)
            
            # Save bot response to history
            save_chat_message(response, "bot", session_id)
            
            # Save consultation booking if confirmed
            if action == "booking_confirmed" and booking_data:
                booking_data["session_id"] = session_id
                consultation_id = save_consultation_to_db(booking_data)
                
                if consultation_id:
                    # Send notifications
                    notification_results = notify_booking(booking_data)
                    
                    # Add confirmation to response
                    response += "\n\nThank you! Your consultation with Dr. Taimoor Ali Ahmad has been booked. "
                    if notification_results["email_sent"]:
                        response += "We've sent a confirmation email. "
                    if notification_results["whatsapp_sent"]:
                        response += "You'll also receive a WhatsApp message shortly. "
                    response += "We look forward to speaking with you soon!"
        except Exception as e:
            print(f"Agent error: {str(e)}")
            response = fallback_response(chat_request.message)
            action = None
            booking_data = None
        
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

@app.post("/consultation")
async def create_consultation(consultation: ConsultationBooking):
    """
    API endpoint to create a consultation booking and send notifications
    """
    try:
        # Prepare data for database
        booking_data = {
            "name": consultation.name,
            "email": consultation.email,
            "phone": consultation.phone,
            "date": consultation.date,
            "time": consultation.time,
            "service": consultation.service,
            "message": consultation.message,
            "status": "pending",
        }
        
        # Save to database
        consultation_id = save_consultation_to_db(booking_data)
        
        # Send notifications
        notification_results = notify_booking(booking_data)
        
        return {
            "id": consultation_id,
            "status": "success",
            "notifications": notification_results
        }
    except Exception as e:
        print(f"Error creating consultation: {str(e)}")
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
