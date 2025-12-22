from fastapi import APIRouter,Response, Cookie, HTTPException, Request
from fastapi.responses import RedirectResponse

from services.oauth_credentials_service import OAuthCredentialsService
from services.supabase_service import SupabaseService
from services.jwt_service import JwtService

from dotenv import load_dotenv
import os

load_dotenv()

router = APIRouter()
supabase_service = SupabaseService()


@router.get("/get-jobs")
async def get_jobs(request: Request):
    """
    Get all jobs for a user
    """
    payload = JwtService.verify_token(request.cookies.get("access_token"))
    if not payload:
        raise HTTPException(status_code=401, detail="Unauthorized")
    user_id = payload["user_id"]
    return supabase_service.get_jobs_under_user(user_id)

@router.get("/get-resumes")
async def get_job(job_id: int, request: Request):
    """
    Get all resumes for a job
    """
    payload = JwtService.verify_token(request.cookies.get("access_token"))
    if not payload:
        raise HTTPException(status_code=401, detail="Unauthorized")
    user_id = payload["user_id"]
    return supabase_service.get_resumes_under_job(job_id)

@router.get("/get-resume")
async def get_resume(resume_id: int, request: Request):
    """
    Get a resume by id
    """
    payload = JwtService.verify_token(request.cookies.get("access_token"))
    if not payload:
        raise HTTPException(status_code=401, detail="Unauthorized")
    user_id = payload["user_id"]
    return supabase_service.get_resume(resume_id)[0]