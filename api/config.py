
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://vxievjimtordkobtuink.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4aWV2amltdG9yZGtvYnR1aW5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwOTEyNDEsImV4cCI6MjA1ODY2NzI0MX0.h_YWBX9nhfGlq6MaR3jSDu56CagNpoprBgqiXwjhJAI")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "")

# JWT Secret
JWT_SECRET = os.getenv("JWT_SECRET", "edenz_consultants_secret_key_please_change_in_production")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30 * 24 * 60  # 30 days
