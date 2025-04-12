
from fastapi import APIRouter, HTTPException, Request, status
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

router = APIRouter(prefix="/recommendations", tags=["recommendations"])

class RecommendationRequest(BaseModel):
    student_id: str
    education_level: Optional[str] = None
    gpa: Optional[float] = None
    english_score: Optional[float] = None
    test_type: Optional[str] = None  # 'IELTS', 'TOEFL', 'PTE', etc.
    preferred_countries: Optional[List[str]] = None
    preferred_fields: Optional[List[str]] = None
    budget: Optional[str] = None

class Recommendation(BaseModel):
    id: Optional[str] = None
    student_id: str
    type: str  # 'university', 'improvement', 'scholarship', etc.
    title: str
    subtitle: str
    description: str
    match_percentage: int
    details: Dict[str, Any]
    created_at: Optional[datetime] = None

# Create the recommendation agent
recommendation_agent = Agent(
    role="Study Abroad Education Advisor",
    goal="Provide personalized university and program recommendations for international students",
    backstory="""You are an AI advisor specialized in analyzing student profiles and recommending the most 
    suitable universities, programs, and improvement suggestions. You have extensive knowledge about 
    international universities, their requirements, costs, and application processes. You help students
    find the best educational opportunities abroad based on their academic profile, preferences, and budget.""",
    verbose=True,
    allow_delegation=False,
    llm=llm
)

@router.post("")
async def generate_recommendations(request: RecommendationRequest):
    """Generate AI recommendations for a student"""
    try:
        # First, fetch student data to get a complete profile
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        
        # Check if students table exists and get student data
        cur.execute("""
            SELECT * FROM users 
            WHERE id = %s AND role = 'student'
        """, (request.student_id,))
        
        student = cur.fetchone()
        
        if not student:
            cur.close()
            conn.close()
            raise HTTPException(status_code=404, detail="Student not found")
        
        # Get student documents
        cur.execute("""
            SELECT * FROM documents
            WHERE student_id = %s
        """, (request.student_id,))
        
        documents = cur.fetchall()
        documents_list = [dict(doc) for doc in documents] if documents else []
        
        # Check if recommendations table exists
        cur.execute("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'recommendations'
            )
        """)
        
        if not cur.fetchone()[0]:
            # Create recommendations table if it doesn't exist
            cur.execute("""
                CREATE TABLE recommendations (
                    id SERIAL PRIMARY KEY,
                    student_id INTEGER NOT NULL,
                    type VARCHAR(100) NOT NULL,
                    title VARCHAR(255) NOT NULL,
                    subtitle VARCHAR(255) NOT NULL,
                    description TEXT NOT NULL,
                    match_percentage INTEGER NOT NULL,
                    details JSONB,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
                )
            """)
            conn.commit()
        
        # Combine all student data
        student_dict = dict(student)
        student_profile = {
            "id": student_dict["id"],
            "name": student_dict["name"],
            "email": student_dict["email"],
            "education_level": request.education_level,
            "gpa": request.gpa,
            "english_score": request.english_score,
            "test_type": request.test_type,
            "preferred_countries": request.preferred_countries,
            "preferred_fields": request.preferred_fields,
            "budget": request.budget,
            "documents": documents_list
        }
        
        # Create a task for the agent to generate recommendations
        task = Task(
            description=f"""Analyze this student profile and generate personalized recommendations:
            
            Name: {student_profile["name"]}
            Education Level: {student_profile["education_level"] or "Not specified"}
            GPA: {student_profile["gpa"] or "Not specified"}
            English Test: {student_profile["test_type"] or "Not specified"} - Score: {student_profile["english_score"] or "Not specified"}
            Preferred Countries: {", ".join(student_profile["preferred_countries"]) if student_profile["preferred_countries"] else "Not specified"}
            Preferred Fields: {", ".join(student_profile["preferred_fields"]) if student_profile["preferred_fields"] else "Not specified"}
            Budget: {student_profile["budget"] or "Not specified"}
            
            Generate 5 recommendations:
            - 3 university/program recommendations that match their profile
            - 1 profile improvement suggestion (e.g., improving test scores, gaining work experience)
            - 1 scholarship opportunity they might be eligible for
            
            For each recommendation, provide:
            1. Type (university, improvement, scholarship)
            2. Title
            3. Brief subtitle
            4. Detailed description (2-3 sentences)
            5. Match percentage (how well it fits their profile)
            6. Additional details specific to the recommendation type
            
            Format your response as structured JSON.""",
            agent=recommendation_agent
        )
        
        # Create a crew with just our agent
        crew = Crew(
            agents=[recommendation_agent],
            tasks=[task],
            process=Process.sequential,
            verbose=True
        )
        
        # For now, just return mock recommendations
        # In production, parse the agent's response and extract recommendations
        mock_recommendations = [
            {
                "student_id": request.student_id,
                "type": "university",
                "title": "University of Glasgow",
                "subtitle": "MSc Data Science",
                "description": "Based on your background and interests, the MSc Data Science program at the University of Glasgow would be an excellent fit.",
                "match_percentage": 92,
                "details": {
                    "location": "Scotland, UK",
                    "fees": "£24,000 per year",
                    "duration": "1 year",
                    "requirements": "2:1 (or equivalent) in Computer Science, Mathematics or related field, IELTS: 6.5",
                    "application_deadline": "June 30, 2024"
                },
                "created_at": datetime.now()
            },
            {
                "student_id": request.student_id,
                "type": "improvement",
                "title": "Improve your IELTS score",
                "subtitle": "Target: 7.0 in all bands",
                "description": "Your current IELTS score could be improved to open up more university options and scholarship opportunities.",
                "match_percentage": 100,
                "details": {
                    "current_score": "6.5 overall (estimated)",
                    "recommendation": "Focus on improving writing skills",
                    "resources": "Edenz IELTS preparation course, IELTS Writing practice with feedback"
                },
                "created_at": datetime.now()
            }
        ]
        
        # Store recommendations in database
        for rec in mock_recommendations:
            cur.execute("""
                INSERT INTO recommendations (
                    student_id, type, title, subtitle, description,
                    match_percentage, details, created_at
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            """, (
                rec["student_id"],
                rec["type"],
                rec["title"],
                rec["subtitle"],
                rec["description"],
                rec["match_percentage"],
                psycopg2.extras.Json(rec["details"]),
                rec["created_at"]
            ))
            
            rec_id = cur.fetchone()[0]
            rec["id"] = rec_id
        
        conn.commit()
        cur.close()
        conn.close()
        
        return {"success": True, "recommendations": mock_recommendations}
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{student_id}")
async def get_student_recommendations(student_id: str):
    """Get all recommendations for a student"""
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        
        # Check if recommendations table exists
        cur.execute("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'recommendations'
            )
        """)
        
        if not cur.fetchone()[0]:
            cur.close()
            conn.close()
            return []
        
        # Get recommendations for student
        cur.execute("""
            SELECT * FROM recommendations
            WHERE student_id = %s
            ORDER BY created_at DESC
        """, (student_id,))
        
        recommendations = cur.fetchall()
        
        cur.close()
        conn.close()
        
        return [dict(rec) for rec in recommendations] if recommendations else []
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))
