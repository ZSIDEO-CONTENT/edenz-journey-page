
from fastapi import APIRouter, HTTPException, Request, status, Header
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os
import uuid
from datetime import datetime
import psycopg2
import psycopg2.extras
from crewai import Agent, Task, Crew, Process
from langchain.chat_models import ChatOpenAI
from api.db_utils import get_db_connection

# Load environment variables
os.environ["OPENAI_API_KEY"] = "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"
os.environ["OPENAI_API_BASE"] = "https://openrouter.ai/api/v1"

# Initialize LLM with explicit credentials
llm = ChatOpenAI(
    model_name="deepseek/deepseek-r1:free",
    openai_api_key="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",
    openai_api_base="https://openrouter.ai/api/v1"
)

router = APIRouter(prefix="/chat", tags=["chat"])

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatHistoryItem(BaseModel):
    content: str
    sender: str  # 'user' or 'bot'
    timestamp: Optional[datetime] = None
    session_id: str

# Create the Edenz Consultant agent with explicit API key
edenz_agent = Agent(
    role="Study Abroad Education Consultant",
    goal="Help students find the best study abroad opportunities and encourage booking consultations",
    backstory="""You are an AI assistant for Edenz Consultants, a leading Pakistani education consultancy 
    specializing in helping students pursue their dreams of studying abroad. You have extensive knowledge 
    about university programs, visa requirements, scholarship opportunities, and the application process 
    for studying all around the world and dream destinations like UK, USA, Germany, Australia, France, Italy.
    
    Edenz Consultants is led by Dr. Taimoor Ali Ahmad, who holds a PhD in Advanced Materials from Germany. 
    Dr. Ahmad personally oversees consultations and brings his international academic experience to help students.
    
    You are friendly, knowledgeable, and always focused on providing accurate information to help 
    students make informed decisions about their education abroad. For any student showing interest in 
    studying abroad or needing detailed guidance, encourage them to book a consultation with 
    Dr. Taimoor Ali Ahmad for 5000 PKR through the booking form.""",
    verbose=True,
    allow_delegation=False,
    llm=llm
)

def save_chat_message(message: str, sender: str, session_id: str) -> bool:
    """Save chat message to PostgreSQL database"""
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Check if chat_history table exists and create if it doesn't
        cur.execute("""
            CREATE TABLE IF NOT EXISTS chat_history (
                id SERIAL PRIMARY KEY,
                content TEXT NOT NULL,
                sender VARCHAR(50) NOT NULL,
                session_id VARCHAR(100) NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Insert the chat message
        cur.execute("""
            INSERT INTO chat_history (content, sender, session_id, timestamp)
            VALUES (%s, %s, %s, %s)
        """, (message, sender, session_id, datetime.now()))
        
        conn.commit()
        cur.close()
        conn.close()
        
        return True
    except Exception as e:
        print(f"Error saving chat message: {str(e)}")
        return False

def get_chat_history(session_id: str) -> List[Dict[str, Any]]:
    """Retrieve chat history for a session from PostgreSQL database"""
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        
        # Check if chat_history table exists
        cur.execute("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'chat_history'
            )
        """)
        
        table_exists = cur.fetchone()[0]
        
        if not table_exists:
            cur.execute("""
                CREATE TABLE chat_history (
                    id SERIAL PRIMARY KEY,
                    content TEXT NOT NULL,
                    sender VARCHAR(50) NOT NULL,
                    session_id VARCHAR(100) NOT NULL,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            conn.commit()
            cur.close()
            conn.close()
            return []
        
        # Fetch chat history
        cur.execute("""
            SELECT * FROM chat_history
            WHERE session_id = %s
            ORDER BY timestamp
        """, (session_id,))
        
        history = cur.fetchall()
        
        cur.close()
        conn.close()
        
        return [dict(row) for row in history]
    except Exception as e:
        print(f"Error retrieving chat history: {str(e)}")
        return []

def detect_booking_intent(message: str) -> bool:
    """Detect if a message contains booking intent"""
    booking_keywords = [
        'book', 'consult', 'appointment', 'schedule', 'meet', 
        'talk to', 'with doctor', 'with dr', 'consultation', 
        'how can i book', 'want to discuss', 'speak with expert'
    ]
    return any(keyword in message.lower() for keyword in booking_keywords)

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
        
        # Check if this is a booking-related query
        has_booking_intent = detect_booking_intent(message)
        
        # For booking intents, provide a direct booking suggestion
        if has_booking_intent:
            booking_response = (
                f"I'd be happy to help you book a consultation with Dr. Taimoor Ali Ahmad, who holds a PhD "
                f"in Advanced Materials from Germany. He personally oversees all consultations at Edenz Consultants. "
                f"The consultation fee is 5000 PKR. "
                f"Please visit our booking page where you can schedule a convenient time for your consultation. "
                f"Would you like me to direct you to our booking page now?"
            )
            return booking_response, "booking_intent"
        
        # For regular queries, use the AI agent
        task = Task(
            description=f"""Given this conversation history: '{context}' 
            Respond to the user's latest message: '{message}'. 
            Be helpful, accurate, and friendly. Provide valuable information on study abroad programs, 
            requirements, and opportunities. If the user asks about complex visa processes, specific university 
            requirements, or needs personalized guidance, suggest booking a consultation with Dr. Taimoor Ali Ahmad
            for 5000 PKR.
            
            If the user asks about Dr. Ahmad, mention his PhD in Advanced Materials from Germany and his 
            extensive experience in international education.
            
            IMPORTANT: Format your response in a clear, well-structured way with proper paragraphs. Use markdown
            formatting to highlight important points. Don't use asterisks (*) as bullet points - use proper markdown
            list formatting.
            
            End your message with a suggestion to book a consultation when appropriate.""",
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
            return result, None
        except Exception as e:
            print(f"Detailed error in crew.kickoff(): {str(e)}")
            return fallback_response(message), None
        
    except Exception as e:
        print(f"Error generating agent response: {str(e)}")
        return fallback_response(message), None

def fallback_response(message: str) -> str:
    """Fallback response when AI agent fails"""
    if any(keyword in message.lower() for keyword in ["dr", "taimoor", "ahmad", "ceo", "doctor"]):
        return "Dr. Taimoor Ali Ahmad is the CEO of Edenz Consultants with a PhD in Advanced Materials from Germany. He personally oversees consultations to provide expert guidance. The consultation fee is 5000 PKR. Would you like to book a consultation with him?"
    
    if detect_booking_intent(message):
        return "We'd be happy to arrange a consultation for you with Dr. Taimoor Ali Ahmad. The consultation fee is 5000 PKR. Our booking page makes it easy to find a time that works for you. Would you like me to direct you to our booking page now?"
    
    return "Thank you for your question. Our education counselors, led by Dr. Taimoor Ali Ahmad, can provide more detailed information in a personalized consultation for a fee of 5000 PKR. Would you like to book a consultation to discuss your study abroad plans?"

@router.post("")
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
            response, action = generate_agent_response(chat_request.message, history)
            
            # Save bot response to history
            save_chat_message(response, "bot", session_id)
        except Exception as e:
            print(f"Agent error: {str(e)}")
            response = fallback_response(chat_request.message)
            action = None
        
        return {
            "response": response,
            "session_id": session_id,
            "success": True,
            "action": action
        }
    except Exception as e:
        print(f"General error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
