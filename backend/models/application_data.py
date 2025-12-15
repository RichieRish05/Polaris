from pydantic import BaseModel, Field
from datetime import datetime

class User(BaseModel):
    user_id: str = Field(..., description="The ID of the user")
    name: str = Field(..., description="The name of the user")
    email: str = Field(..., description="The email of the user")
    password: str = Field(..., description="The password of the user")
    created_at: datetime = Field(..., description="The creation date")
    updated_at: datetime = Field(..., description="The update date")
    oauth_access_token: str = Field(..., description="The access token of the OAuth credentials")
    oauth_refresh_token: str = Field(..., description="The refresh token of the OAuth credentials")

class ResumeData(BaseModel):
    mongodb_id: str = Field(..., description="The MongoDB Object ID of the Resume Text")
    application_id: str = Field(..., description="The application ID in Postgres")
    name: str = Field(..., description="The name of the application")
    score: int = Field(..., description="The score of the application")
    status: str = Field(..., description="The status of the application (pending, completed, failed)")
    gpa: float = Field(..., description="The GPA of the application")
    major: str = Field(..., description="The major of the application")
    number_of_internships: int = Field(..., description="The number of internships in the application")
    graduation_date: datetime = Field(..., description="The graduation date of the application")
    graduation_year: int = Field(..., description="The graduation year of the application")
    uploaded_at: datetime = Field(..., description="The creation date")

