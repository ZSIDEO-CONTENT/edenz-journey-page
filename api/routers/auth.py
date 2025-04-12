
from fastapi import APIRouter, HTTPException, Request, status, Depends, Header
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os
from datetime import datetime, timedelta
import supabase
from api.config import SUPABASE_URL, SUPABASE_KEY, JWT_SECRET, JWT_ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from jose import JWTError, jwt

# Initialize Supabase client
supabase_client = supabase.create_client(SUPABASE_URL, SUPABASE_KEY)

# Initialize OAuth2 Bearer for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")

router = APIRouter(prefix="/auth", tags=["auth"])

# ... keep existing code (Token, UserAuth, StudentRegister, ProcessingMemberRegister, AdminRegister classes)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    # ... keep existing code (create_access_token function)

async def get_supabase_user(authorization: Optional[str] = Header(None)):
    # ... keep existing code (get_supabase_user function)

@router.post("/register/admin", status_code=status.HTTP_201_CREATED)
async def register_admin(user: AdminRegister):
    """Register a new admin (requires admin secret key)"""
    try:
        # Verify admin secret key
        admin_secret = os.environ.get("ADMIN_SECRET_KEY", "admin123")  # Use environment variable in production
        if user.adminSecretKey != admin_secret:
            raise HTTPException(status_code=403, detail="Invalid admin secret key")
        
        # Check if email already exists to prevent duplicate registration
        try:
            user_data_response = supabase_client.table("users").select("*").eq("email", user.email).execute()
            if user_data_response and hasattr(user_data_response, "data") and len(user_data_response.data) > 0:
                raise HTTPException(status_code=400, detail="Email already in use")
        except Exception as e:
            print(f"Error checking for existing user: {str(e)}")
            # Continue if it's just that the user doesn't exist
        
        # Register with Supabase Auth
        auth_response = supabase_client.auth.sign_up({
            "email": user.email,
            "password": user.password,
        })
        
        if not auth_response or not hasattr(auth_response, "user") or not auth_response.user:
            raise HTTPException(status_code=400, detail="Registration failed in auth service")
        
        # Add user data to the users table
        user_data = {
            "id": auth_response.user.id,
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "role": "admin",
            "created_at": datetime.now().isoformat()
        }
        
        print(f"Creating admin user in users table: {user_data}")
        
        # Insert into users table
        insert_response = supabase_client.table("users").insert(user_data).execute()
        
        if not insert_response or hasattr(insert_response, "error") and insert_response.error:
            print(f"Error inserting admin user: {insert_response.error}")
            raise HTTPException(status_code=500, detail=f"Failed to add user data: {insert_response.error}")
        
        print(f"Admin user created successfully: {auth_response.user.id}")
        return {"success": True, "message": "Admin registered successfully"}
    
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        print(f"Admin registration error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/register/student", status_code=status.HTTP_201_CREATED)
async def register_student(user: StudentRegister):
    """Register a new student"""
    try:
        # Check if email already exists
        try:
            user_data_response = supabase_client.table("users").select("*").eq("email", user.email).execute()
            if user_data_response and hasattr(user_data_response, "data") and len(user_data_response.data) > 0:
                raise HTTPException(status_code=400, detail="Email already in use")
        except Exception as e:
            print(f"Error checking for existing student: {str(e)}")
            # Continue if it's just that the user doesn't exist
        
        # Register with Supabase Auth
        auth_response = supabase_client.auth.sign_up({
            "email": user.email,
            "password": user.password,
        })
        
        if not auth_response or not hasattr(auth_response, "user") or not auth_response.user:
            raise HTTPException(status_code=400, detail="Registration failed in auth service")
        
        # Add user data to the users table
        user_data = {
            "id": auth_response.user.id,
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "role": "student",
            "created_at": datetime.now().isoformat()
        }
        
        print(f"Creating student user in users table: {user_data}")
        
        # Insert into users table
        insert_response = supabase_client.table("users").insert(user_data).execute()
        
        if not insert_response or hasattr(insert_response, "error") and insert_response.error:
            print(f"Error inserting student user: {insert_response.error}")
            raise HTTPException(status_code=500, detail=f"Failed to add user data: {insert_response.error}")
        
        print(f"Student user created successfully: {auth_response.user.id}")
        return {"success": True, "message": "Student registered successfully"}
    
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        print(f"Student registration error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/register/processing", status_code=status.HTTP_201_CREATED)
async def register_processing_member(user: ProcessingMemberRegister):
    """Register a new processing team member (admin only)"""
    try:
        # Verify admin token
        admin_user = None
        try:
            admin_token = user.admin_token
            admin_user_response = supabase_client.auth.get_user(admin_token)
            admin_user = admin_user_response.user if admin_user_response else None
        except Exception as e:
            raise HTTPException(status_code=403, detail="Invalid admin token")
        
        if not admin_user:
            raise HTTPException(status_code=403, detail="Invalid admin token")
        
        # Check if admin user exists in users table with role="admin"
        admin_check = supabase_client.table("users").select("*").eq("id", admin_user.id).eq("role", "admin").execute()
        if not admin_check or not hasattr(admin_check, "data") or len(admin_check.data) == 0:
            raise HTTPException(status_code=403, detail="Not authorized to create processing team members")
        
        # Check if email already exists
        try:
            user_data_response = supabase_client.table("users").select("*").eq("email", user.email).execute()
            if user_data_response and hasattr(user_data_response, "data") and len(user_data_response.data) > 0:
                raise HTTPException(status_code=400, detail="Email already in use")
        except Exception as e:
            print(f"Error checking for existing processing member: {str(e)}")
            # Continue if it's just that the user doesn't exist
        
        # Register with Supabase Auth
        auth_response = supabase_client.auth.sign_up({
            "email": user.email,
            "password": user.password,
        })
        
        if not auth_response or not hasattr(auth_response, "user") or not auth_response.user:
            raise HTTPException(status_code=400, detail="Registration failed in auth service")
        
        # Add user data to the users table
        user_data = {
            "id": auth_response.user.id,
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "role": "processing",
            "managed_regions": user.managed_regions or [],
            "created_by": admin_user.id,
            "created_at": datetime.now().isoformat()
        }
        
        print(f"Creating processing user in users table: {user_data}")
        
        # Insert into users table
        insert_response = supabase_client.table("users").insert(user_data).execute()
        
        if not insert_response or hasattr(insert_response, "error") and insert_response.error:
            print(f"Error inserting processing user: {insert_response.error}")
            raise HTTPException(status_code=500, detail=f"Failed to add user data: {insert_response.error}")
        
        print(f"Processing user created successfully: {auth_response.user.id}")
        return {"success": True, "message": "Processing team member registered successfully"}
    
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        print(f"Processing member registration error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login and get an access token"""
    try:
        print(f"Login attempt for: {form_data.username}")
        
        # Sign in with Supabase Auth
        response = supabase_client.auth.sign_in_with_password({
            "email": form_data.username,
            "password": form_data.password
        })
        
        if not response or not hasattr(response, "user") or not response.user:
            print(f"Authentication failed for: {form_data.username}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
            )
        
        print(f"Authentication success for: {form_data.username}")
        
        # Get user details from users table
        user_id = response.user.id
        
        print(f"Looking up user details for ID: {user_id}")
        
        # Look for user in users table
        user_data_response = supabase_client.table("users").select("*").eq("id", user_id).execute()
        
        if user_data_response and hasattr(user_data_response, "data") and len(user_data_response.data) > 0:
            user_data = user_data_response.data[0]
            role = user_data.get("role", "student")
            print(f"Found user in users table with role: {role}")
        else:
            print(f"User {user_id} found in auth but not in users table, creating default entry")
            # If user exists in auth but not in users table, create a default entry
            user_data = {
                "id": user_id,
                "email": response.user.email,
                "role": "student",
                "created_at": datetime.now().isoformat()
            }
            role = "student"
            
            # Insert the default user data
            try:
                insert_response = supabase_client.table("users").insert(user_data).execute()
                print(f"Created default user entry: {insert_response}")
            except Exception as e:
                print(f"Error creating default user entry: {str(e)}")
        
        print(f"User role determined as: {role}")
        
        # Return token and user info
        return {
            "access_token": response.session.access_token,
            "token_type": "bearer",
            "user": {
                "id": user_id,
                "email": user_data.get("email", response.user.email),
                "name": user_data.get("name", ""),
                "role": role,
                "managed_regions": user_data.get("managed_regions", []) if role == "processing" else None
            }
        }
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        print(f"Authentication error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication error: {str(e)}",
        )

@router.get("/me")
async def read_users_me(current_user: dict = Depends(get_supabase_user)):
    # ... keep existing code (read_users_me function)

