
from fastapi import APIRouter, HTTPException, Request, status, Depends, Header
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os
from datetime import datetime
import psycopg2
import psycopg2.extras
from api.db_utils import get_db_connection

router = APIRouter(prefix="/processing", tags=["processing"])

class ApplicationCreate(BaseModel):
    student_id: str
    university_name: str
    program_name: str
    intake: str
    status: str = "new"
    application_fee: Optional[float] = None
    tuition_fee: Optional[float] = None
    estimated_living_cost: Optional[float] = None
    documents_required: Optional[List[str]] = None
    notes: Optional[str] = None

class ApplicationUpdate(BaseModel):
    status: Optional[str] = None
    progress: Optional[int] = None
    notes: Optional[str] = None
    update_message: Optional[str] = None

def verify_processing_user(user_id: str):
    """Verify if user is in processing team or admin"""
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    user_role = None
    
    try:
        # Check processing team
        cur.execute("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'processing_team'
            )
        """)
        
        if cur.fetchone()[0]:
            # Table exists, check if user is in processing team
            cur.execute("""
                SELECT * FROM processing_team
                WHERE id = %s
            """, (user_id,))
            
            if cur.fetchone():
                user_role = "processing"
        
        # If not in processing team, check if admin
        if not user_role:
            cur.execute("""
                SELECT * FROM users
                WHERE id = %s AND role = 'admin'
            """, (user_id,))
            
            if cur.fetchone():
                user_role = "admin"
                
        return user_role
    finally:
        cur.close()
        conn.close()

@router.get("/students")
async def get_all_students(authorization: str = Header(None)):
    """Get all students (for processing team)"""
    try:
        # Extract user ID from authorization header
        # In a real implementation, you would validate JWT token here
        # For now, we'll assume the header contains user_id
        user_id = authorization
        
        if not user_id:
            raise HTTPException(status_code=401, detail="Authentication required")
        
        user_role = verify_processing_user(user_id)
        
        if not user_role or user_role not in ["processing", "admin"]:
            raise HTTPException(status_code=403, detail="Not authorized to access student data")
        
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        
        try:
            # Get all students
            cur.execute("""
                SELECT id, name, email, phone, created_at, preferred_country
                FROM users
                WHERE role = 'student'
            """)
            
            students = cur.fetchall()
            students_list = [dict(student) for student in students]
            
            # Get applications count for each student
            for student in students_list:
                cur.execute("""
                    SELECT COUNT(*) as count
                    FROM applications
                    WHERE student_id = %s
                """, (student["id"],))
                
                app_count = cur.fetchone()
                student["application_count"] = app_count["count"] if app_count else 0
                
                # Get documents count
                cur.execute("""
                    SELECT COUNT(*) as count
                    FROM documents
                    WHERE student_id = %s
                """, (student["id"],))
                
                doc_count = cur.fetchone()
                student["document_count"] = doc_count["count"] if doc_count else 0
            
            return students_list
        finally:
            cur.close()
            conn.close()
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/students/{student_id}")
async def get_student_details(student_id: str, authorization: str = Header(None)):
    """Get detailed student information (for processing team)"""
    try:
        # Extract user ID from authorization header
        user_id = authorization
        
        if not user_id:
            raise HTTPException(status_code=401, detail="Authentication required")
        
        user_role = verify_processing_user(user_id)
        
        if not user_role or user_role not in ["processing", "admin"]:
            raise HTTPException(status_code=403, detail="Not authorized to access student data")
        
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        
        try:
            # Get student profile
            cur.execute("""
                SELECT * FROM users
                WHERE id = %s AND role = 'student'
            """, (student_id,))
            
            student = cur.fetchone()
            
            if not student:
                raise HTTPException(status_code=404, detail="Student not found")
            
            # Get student's education history
            cur.execute("""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name = 'education'
                )
            """)
            
            has_education_table = cur.fetchone()[0]
            education = []
            
            if has_education_table:
                cur.execute("""
                    SELECT * FROM education
                    WHERE student_id = %s
                """, (student_id,))
                
                education = cur.fetchall()
            
            # Get student's documents
            cur.execute("""
                SELECT * FROM documents
                WHERE student_id = %s
            """, (student_id,))
            
            documents = cur.fetchall()
            
            # Get student's applications
            cur.execute("""
                SELECT * FROM applications
                WHERE student_id = %s
            """, (student_id,))
            
            applications = cur.fetchall()
            
            return {
                "profile": dict(student),
                "education": [dict(edu) for edu in education] if education else [],
                "documents": [dict(doc) for doc in documents] if documents else [],
                "applications": [dict(app) for app in applications] if applications else []
            }
        finally:
            cur.close()
            conn.close()
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/applications")
async def create_student_application(application: ApplicationCreate, authorization: str = Header(None)):
    """Create a new application for a student (processing team only)"""
    try:
        # Extract user ID from authorization header
        user_id = authorization
        
        if not user_id:
            raise HTTPException(status_code=401, detail="Authentication required")
        
        user_role = verify_processing_user(user_id)
        
        if not user_role or user_role not in ["processing", "admin"]:
            raise HTTPException(status_code=403, detail="Not authorized to create applications")
        
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        
        try:
            # Verify student exists
            cur.execute("""
                SELECT * FROM users
                WHERE id = %s AND role = 'student'
            """, (application.student_id,))
            
            student = cur.fetchone()
            
            if not student:
                raise HTTPException(status_code=404, detail="Student not found")
            
            # Check if applications table exists
            cur.execute("""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name = 'applications'
                )
            """)
            
            if not cur.fetchone()[0]:
                # Create applications table if it doesn't exist
                cur.execute("""
                    CREATE TABLE applications (
                        id SERIAL PRIMARY KEY,
                        student_id INTEGER NOT NULL,
                        university_name VARCHAR(255) NOT NULL,
                        program_name VARCHAR(255) NOT NULL,
                        intake VARCHAR(100) NOT NULL,
                        status VARCHAR(50) DEFAULT 'new',
                        progress INTEGER DEFAULT 10,
                        application_fee NUMERIC,
                        tuition_fee NUMERIC,
                        estimated_living_cost NUMERIC,
                        documents_required TEXT[],
                        notes TEXT,
                        created_by INTEGER,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
                        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
                    )
                """)
                conn.commit()
            
            # Check if application_history table exists
            cur.execute("""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name = 'application_history'
                )
            """)
            
            if not cur.fetchone()[0]:
                # Create application_history table if it doesn't exist
                cur.execute("""
                    CREATE TABLE application_history (
                        id SERIAL PRIMARY KEY,
                        application_id INTEGER NOT NULL,
                        status VARCHAR(50) NOT NULL,
                        progress INTEGER,
                        notes TEXT,
                        created_by INTEGER,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
                        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
                    )
                """)
                conn.commit()
            
            # Create application
            cur.execute("""
                INSERT INTO applications (
                    student_id, university_name, program_name, intake, status,
                    progress, application_fee, tuition_fee, estimated_living_cost,
                    documents_required, notes, created_by, created_at, updated_at
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            """, (
                application.student_id,
                application.university_name,
                application.program_name,
                application.intake,
                application.status,
                10,  # Initial progress
                application.application_fee,
                application.tuition_fee,
                application.estimated_living_cost,
                application.documents_required,
                application.notes,
                user_id,
                datetime.now(),
                datetime.now()
            ))
            
            application_id = cur.fetchone()[0]
            
            # Create application history entry
            cur.execute("""
                INSERT INTO application_history (
                    application_id, status, progress, notes, created_by, created_at
                )
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (
                application_id,
                application.status,
                10,
                f"Application created for {application.university_name}, {application.program_name}",
                user_id,
                datetime.now()
            ))
            
            conn.commit()
            
            return {
                "success": True, 
                "message": "Application created successfully", 
                "application_id": application_id
            }
        finally:
            cur.close()
            conn.close()
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/applications/{application_id}")
async def update_student_application(application_id: str, application: ApplicationUpdate, authorization: str = Header(None)):
    """Update application status and progress (processing team only)"""
    try:
        # Extract user ID from authorization header
        user_id = authorization
        
        if not user_id:
            raise HTTPException(status_code=401, detail="Authentication required")
        
        user_role = verify_processing_user(user_id)
        
        if not user_role or user_role not in ["processing", "admin"]:
            raise HTTPException(status_code=403, detail="Not authorized to update applications")
        
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        
        try:
            # Verify application exists
            cur.execute("""
                SELECT * FROM applications
                WHERE id = %s
            """, (application_id,))
            
            app = cur.fetchone()
            
            if not app:
                raise HTTPException(status_code=404, detail="Application not found")
            
            # Update application
            update_fields = []
            update_values = []
            
            if application.status is not None:
                update_fields.append("status = %s")
                update_values.append(application.status)
            
            if application.progress is not None:
                update_fields.append("progress = %s")
                update_values.append(application.progress)
            
            if application.notes is not None:
                update_fields.append("notes = %s")
                update_values.append(application.notes)
            
            update_fields.append("updated_at = %s")
            update_values.append(datetime.now())
            
            # Add application_id to values
            update_values.append(application_id)
            
            # Build update query
            update_query = f"""
                UPDATE applications
                SET {', '.join(update_fields)}
                WHERE id = %s
                RETURNING id, status, progress
            """
            
            cur.execute(update_query, update_values)
            
            updated_app = cur.fetchone()
            
            # Create application history entry
            cur.execute("""
                INSERT INTO application_history (
                    application_id, status, progress, notes, created_by, created_at
                )
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (
                application_id,
                application.status if application.status is not None else updated_app["status"],
                application.progress if application.progress is not None else updated_app["progress"],
                application.update_message or "Application updated",
                user_id,
                datetime.now()
            ))
            
            conn.commit()
            
            return {
                "success": True, 
                "message": "Application updated successfully"
            }
        finally:
            cur.close()
            conn.close()
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/applications/{application_id}/history")
async def get_application_history(application_id: str, authorization: str = Header(None)):
    """Get application history (processing team only)"""
    try:
        # Extract user ID from authorization header
        user_id = authorization
        
        if not user_id:
            raise HTTPException(status_code=401, detail="Authentication required")
        
        user_role = verify_processing_user(user_id)
        
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        
        try:
            # Verify application exists
            cur.execute("""
                SELECT * FROM applications
                WHERE id = %s
            """, (application_id,))
            
            app = cur.fetchone()
            
            if not app:
                raise HTTPException(status_code=404, detail="Application not found")
            
            # If user is a student, check if they own the application
            if not user_role:
                student_id = app["student_id"]
                if user_id != student_id:
                    raise HTTPException(status_code=403, detail="Not authorized to view this application history")
            
            # Get application history
            cur.execute("""
                SELECT * FROM application_history
                WHERE application_id = %s
                ORDER BY created_at DESC
            """, (application_id,))
            
            history = cur.fetchall()
            
            return [dict(item) for item in history]
        finally:
            cur.close()
            conn.close()
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-recommendation/{student_id}")
async def generate_specific_recommendation(student_id: str, authorization: str = Header(None)):
    """Generate AI recommendations for a specific student (processing team only)"""
    try:
        # Extract user ID from authorization header
        user_id = authorization
        
        if not user_id:
            raise HTTPException(status_code=401, detail="Authentication required")
        
        user_role = verify_processing_user(user_id)
        
        if not user_role or user_role not in ["processing", "admin"]:
            raise HTTPException(status_code=403, detail="Not authorized to generate recommendations")
        
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        
        try:
            # Fetch student data
            cur.execute("""
                SELECT * FROM users
                WHERE id = %s AND role = 'student'
            """, (student_id,))
            
            student = cur.fetchone()
            
            if not student:
                raise HTTPException(status_code=404, detail="Student not found")
            
            # Get student's education history
            cur.execute("""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name = 'education'
                )
            """)
            
            has_education_table = cur.fetchone()[0]
            education = []
            
            if has_education_table:
                cur.execute("""
                    SELECT * FROM education
                    WHERE student_id = %s
                """, (student_id,))
                
                education = cur.fetchall()
            
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
                        created_by INTEGER,
                        type VARCHAR(100) NOT NULL,
                        title VARCHAR(255) NOT NULL,
                        subtitle VARCHAR(255) NOT NULL,
                        description TEXT NOT NULL,
                        match_percentage INTEGER NOT NULL,
                        details JSONB,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
                        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
                    )
                """)
                conn.commit()
            
            # Use the student data to create a recommendation (placeholder for now)
            student_dict = dict(student)
            
            # Insert recommendation into database
            cur.execute("""
                INSERT INTO recommendations (
                    student_id, created_by, type, title, subtitle, 
                    description, match_percentage, details, created_at
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            """, (
                student_id,
                user_id,
                "university",
                "University of Example",
                "MSc in Computer Science",
                f"Based on {student_dict['name']}'s profile, we recommend University of Example which offers excellent programs matching their academic background.",
                90,
                psycopg2.extras.Json({
                    "location": "Example City",
                    "tuition": "$20,000 per year",
                    "duration": "2 years",
                    "requirements": "Bachelor's degree, IELTS 6.5+",
                    "notes": "This university has a high acceptance rate for international students with similar profiles."
                }),
                datetime.now()
            ))
            
            recommendation_id = cur.fetchone()[0]
            
            # Fetch the created recommendation
            cur.execute("""
                SELECT * FROM recommendations
                WHERE id = %s
            """, (recommendation_id,))
            
            recommendation = cur.fetchone()
            
            conn.commit()
            
            return {
                "success": True, 
                "message": "Recommendation generated successfully", 
                "recommendation": dict(recommendation)
            }
        finally:
            cur.close()
            conn.close()
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))
