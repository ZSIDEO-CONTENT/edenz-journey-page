
# This file makes the routers directory a Python package

# Import all router modules to make them accessible via the package
from api.routers import chat, students, consultations, recommendations, documents, auth

# For convenient importing in main.py
__all__ = ['chat', 'students', 'consultations', 'recommendations', 'documents', 'auth']
