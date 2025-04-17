
# Edenz Consultants Django REST API Backend

This is the Django REST API backend for Edenz Consultants, an education consultancy specializing in helping students study abroad.

## Features

- JWT-based authentication for students, processing team, and admins
- Complete API for managing student profiles, education records, documents, applications, and consultations
- Role-based permissions for different user types
- PostgreSQL database integration

## Getting Started

### Prerequisites

- Python 3.9+
- PostgreSQL database

### Installation

1. Clone this repository
2. Create a virtual environment:
   ```
   python -m venv venv
   ```
3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Linux/Mac: `source venv/bin/activate`
4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
5. Create a `.env` file from the example:
   ```
   cp .env.example .env
   ```
   Edit the file to set your database credentials and other settings.

### Run the Application

```
python run.py
```

This script will:
1. Run database migrations
2. Create a superuser if needed
3. Start the development server

### API Endpoints

#### Authentication

- `POST /api/auth/token/` - Login and get access token
- `POST /api/auth/register/student/` - Register a new student
- `POST /api/auth/register/admin/` - Register a new admin (requires admin secret key)
- `POST /api/auth/processing/register/` - Register a new processing team member (admin only)
- `GET /api/auth/me/` - Get current user information

#### Students

- `GET /api/users/` - List all users (admin/processing only)
- `GET /api/users/<id>/` - Get user details (admin/processing only)
- `PUT /api/users/<id>/` - Update user (admin/processing only)

#### Education

- `GET /api/education/` - List education records
- `POST /api/education/` - Create education record
- `GET /api/education/<id>/` - Get education details
- `PUT /api/education/<id>/` - Update education
- `DELETE /api/education/<id>/` - Delete education

#### Documents

- `GET /api/documents/` - List documents
- `POST /api/documents/` - Upload document
- `GET /api/documents/<id>/` - Get document details
- `PUT /api/documents/<id>/` - Update document status
- `DELETE /api/documents/<id>/` - Delete document

#### Applications

- `GET /api/applications/` - List applications
- `POST /api/applications/` - Create application
- `GET /api/applications/<id>/` - Get application details
- `PUT /api/applications/<id>/` - Update application
- `DELETE /api/applications/<id>/` - Delete application

#### Consultations

- `GET /api/consultations/` - List consultations
- `POST /api/consultations/` - Book consultation
- `GET /api/consultations/<id>/` - Get consultation details
- `PUT /api/consultations/<id>/` - Update consultation
- `DELETE /api/consultations/<id>/` - Delete consultation

#### Destination Guides

- `GET /api/destination-guides/` - List destination guides
- `POST /api/destination-guides/` - Create destination guide (admin/processing only)
- `GET /api/destination-guides/<id>/` - Get destination guide details
- `PUT /api/destination-guides/<id>/` - Update destination guide (admin/processing only)
- `DELETE /api/destination-guides/<id>/` - Delete destination guide (admin/processing only)

#### Chat

- `POST /api/chat/` - Send chat message and get response

#### Recommendations

- `GET /api/recommendations/<student_id>/` - Get recommendations for student
- `POST /api/recommendations/generate/<student_id>/` - Generate new recommendations for student

## Project Structure

- `api/` - Main Django app containing all API endpoints
- `edenz_api/` - Django project settings
- `manage.py` - Django management script

## License

This project is proprietary and confidential.
