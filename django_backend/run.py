
#!/usr/bin/env python
"""
Script to run the Django development server and perform database migrations.
"""
import os
import subprocess
import sys

def run_migrations():
    """Run database migrations"""
    print("Running database migrations...")
    subprocess.run([sys.executable, "manage.py", "makemigrations"], check=True)
    subprocess.run([sys.executable, "manage.py", "migrate"], check=True)

def create_superuser():
    """Create a superuser if needed"""
    print("Checking if superuser creation is needed...")
    try:
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        if not User.objects.filter(is_superuser=True).exists():
            print("Creating superuser...")
            username = input("Enter superuser username (default: admin): ") or "admin"
            email = input("Enter superuser email (default: admin@example.com): ") or "admin@example.com"
            
            User.objects.create_superuser(
                username=username,
                email=email,
                password="admin123",  # Default password, should be changed immediately
                name="Admin User",
                role="admin"
            )
            print(f"Superuser created with username '{username}' and password 'admin123'")
            print("Please change the default password immediately after logging in!")
        else:
            print("Superuser already exists")
    except Exception as e:
        print(f"Error creating superuser: {e}")

def run_server():
    """Run the development server"""
    print("Starting Django development server...")
    subprocess.run([sys.executable, "manage.py", "runserver", "0.0.0.0:8000"])

if __name__ == "__main__":
    print("Initializing Edenz API Django backend...")
    run_migrations()
    create_superuser()
    run_server()
