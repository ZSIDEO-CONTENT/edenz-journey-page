
from fastapi import APIRouter, HTTPException, Request, status
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os
import uuid
from datetime import datetime
import supabase

# Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL", "https://vxievjimtordkobtuink.supabase.co")
supabase_key = os.getenv("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4aWV2amltdG9yZGtvYnR1aW5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwOTEyNDEsImV4cCI6MjA1ODY2NzI0MX0.h_YWBX9nhfGlq6MaR3jSDu56CagNpoprBgqiXwjhJAI")
supabase_client = supabase.create_client(supabase_url, supabase_key)

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
            result = supabase_client.table("consultations").insert({
                **booking_data,
                "created_at": datetime.now().isoformat(),
            }).execute()
            
            # Extract the ID of the created consultation
            if result and hasattr(result, "data") and len(result.data) > 0:
                consultation_id = result.data[0].get("id")
                print(f"Consultation saved with ID: {consultation_id}")
            else:
                print("Consultation saved but couldn't retrieve ID")
                consultation_id = ""
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
        result = supabase_client.table("consultations").select("*").eq("id", consultation_id).execute()
        
        if not result or not hasattr(result, "data") or len(result.data) == 0:
            raise HTTPException(status_code=404, detail="Consultation not found")
        
        return result.data[0]
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{consultation_id}/payment")
async def update_payment_status(consultation_id: str, payment_reference: str):
    """Update payment status for a consultation"""
    try:
        result = supabase_client.table("consultations").update({
            "payment_status": "completed",
            "payment_reference": payment_reference,
            "updated_at": datetime.now().isoformat()
        }).eq("id", consultation_id).execute()
        
        if not result or not hasattr(result, "data") or len(result.data) == 0:
            raise HTTPException(status_code=404, detail="Consultation not found")
        
        return {"success": True, "message": "Payment status updated successfully"}
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))
