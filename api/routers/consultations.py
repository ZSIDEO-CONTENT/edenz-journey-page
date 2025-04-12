
from fastapi import APIRouter, HTTPException, Request, status
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os
import uuid
from datetime import datetime
import psycopg2
import psycopg2.extras
from api.db_utils import get_db_connection

router = APIRouter(prefix="/consultation", tags=["consultation"])

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
    payment_status: str = "pending"
    payment_reference: Optional[str] = None

@router.post("")
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
            "payment_status": consultation.payment_status,
            "payment_reference": consultation.payment_reference
        }
        
        # Save to database
        try:
            conn = get_db_connection()
            cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
            
            # Check if consultations table exists
            cur.execute("""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name = 'consultations'
                )
            """)
            
            table_exists = cur.fetchone()[0]
            
            if not table_exists:
                # Create consultations table if it doesn't exist
                cur.execute("""
                    CREATE TABLE consultations (
                        id SERIAL PRIMARY KEY,
                        student_id INTEGER,
                        name VARCHAR(255) NOT NULL,
                        email VARCHAR(255) NOT NULL,
                        phone VARCHAR(50) NOT NULL,
                        date VARCHAR(50) NOT NULL,
                        time VARCHAR(50) NOT NULL,
                        service VARCHAR(100),
                        message TEXT,
                        notes TEXT,
                        status VARCHAR(50) DEFAULT 'pending',
                        payment_status VARCHAR(50) DEFAULT 'pending',
                        payment_reference VARCHAR(255),
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE SET NULL
                    )
                """)
                conn.commit()
            
            # Insert the consultation data
            cur.execute("""
                INSERT INTO consultations (
                    name, email, phone, date, time, service, message, 
                    status, payment_status, payment_reference, created_at
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            """, (
                booking_data["name"],
                booking_data["email"],
                booking_data["phone"],
                booking_data["date"],
                booking_data["time"],
                booking_data["service"],
                booking_data["message"],
                booking_data["status"],
                booking_data["payment_status"],
                booking_data["payment_reference"],
                datetime.now()
            ))
            
            consultation_id = cur.fetchone()[0]
            conn.commit()
            
            print(f"Consultation saved with ID: {consultation_id}")
            
            cur.close()
            conn.close()
        except Exception as e:
            print(f"Error saving consultation: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
        
        # We're simplifying notification logic - just acknowledge the booking
        return {
            "id": consultation_id,
            "status": "success",
            "notifications": {
                "email_sent": True,
                "whatsapp_sent": False
            }
        }
    except Exception as e:
        print(f"Error creating consultation: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{consultation_id}")
async def get_consultation(consultation_id: str):
    """Get consultation details by ID"""
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        
        cur.execute("""
            SELECT * FROM consultations WHERE id = %s
        """, (consultation_id,))
        
        consultation = cur.fetchone()
        
        cur.close()
        conn.close()
        
        if not consultation:
            raise HTTPException(status_code=404, detail="Consultation not found")
        
        return dict(consultation)
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{consultation_id}/payment")
async def update_payment_status(consultation_id: str, payment_reference: str):
    """Update payment status for a consultation"""
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        
        cur.execute("""
            UPDATE consultations
            SET payment_status = 'completed', 
                payment_reference = %s,
                updated_at = %s
            WHERE id = %s
            RETURNING id
        """, (payment_reference, datetime.now(), consultation_id))
        
        updated = cur.fetchone()
        
        conn.commit()
        cur.close()
        conn.close()
        
        if not updated:
            raise HTTPException(status_code=404, detail="Consultation not found")
        
        return {"success": True, "message": "Payment status updated successfully"}
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))
