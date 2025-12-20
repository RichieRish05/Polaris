from fastapi import APIRouter
from services.oauth_credentials_service import OAuthCredentialsService
from fastapi.responses import RedirectResponse
from fastapi import Response, Cookie, HTTPException, Request
from services.jwt_service import JwtService
from models.application_data import StartJobRequest
import os
from dotenv import load_dotenv
import inngest
from supabase import create_client, Client
import logging
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

load_dotenv()

router = APIRouter()

@router.post("/start-job")
async def start_job(request: Request, body: StartJobRequest):
    """
    Start a job
    """
    payload = JwtService.verify_token(request.cookies.get("access_token"))
    if not payload:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    user_id = payload["user_id"]
    credentials_dict = await OAuthCredentialsService.get_credentials_dict(user_id)

    try:
        await inngest_client.send(
            inngest.Event(
                name="app/start-job",
                data={
                    "user_id": user_id,
                    "credentials_dict": credentials_dict,
                    "folder_id": body.folder_id
                },
            )
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error starting job: {e}")
    
    return {"message": "Job started"}


inngest_client = inngest.Inngest(
    app_id="Polaris",
    logger=logging.getLogger("uvicorn"),
)

@inngest_client.create_function(
    fn_id="start-job",
    trigger=inngest.TriggerEvent(event="app/start-job")
)
async def start_job(ctx: inngest.Context) -> None:
    """
    Start a folder review job
    """
    # Obtain user information and get credentials to allow gdrive access
    folder_id = ctx.event.data["folder_id"]
    user_id = ctx.event.data["user_id"]
    credentials_dict = ctx.event.data["credentials_dict"]
    
    # Upload the job to postgres
    job = await ctx.step.run(
        "upload-job-id",
        upload_job_id,
        user_id,
        folder_id,
    )

    # Get all pdf files within the chosen folder
    files = await ctx.step.run(
        "get-files",
        get_files,
        folder_id,
        user_id,
        credentials_dict,
    )

    for file in files:
        await ctx.step.invoke(
            "score-resume",
            function=score_resume,
            data={
                "file": file,
                "job_id": job["id"],
                "credentials_dict": credentials_dict
            }
        )

async def upload_job_id(user_id: str, folder_id: str) -> dict:
    """
    Upload the job to supabase
    """
    supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_SERVICE_ROLE_KEY"))
    job = supabase.table("jobs").insert({
        "user_id": user_id,
        "google_id": folder_id,
        "status": "pending"
    }).execute().data

    return job[0]


async def get_files(folder_id: str, user_id: str, credentials_dict: dict) -> list[dict]:
    """
    Get all pdf files within the chosen folder
    """
    credentials = OAuthCredentialsService.from_authorized_user_info(credentials_dict)
     
    service = build('drive', 'v3', credentials=credentials)
    query = f"'{folder_id}' in parents and mimeType = 'application/pdf' and trashed = false"


    results = service.files().list(
        q=query,
        spaces='drive'
    ).execute()

    files = results.get('files', [])
    next_page_token = results.get('nextPageToken')
    while next_page_token:
        results = service.files().list(
            q=query,
            spaces='drive',
            pageToken=next_page_token
        ).execute()
        files.extend(results.get('files', []))
        next_page_token = results.get('nextPageToken', None)

    return files

"""
STEPS:

1. Start a job by uploading the job id to postgres
2. Get all file ids within the folder
3. For each file id, run a queue job
    a. Upload the resume id to postgres
    b. Download the file on modal and extract the text and upload it to mongo db
    c. Get the text from mongo db and score the resume
    d. Update the resume status and job status in postgres

"""


@inngest_client.create_function(
    fn_id="score-resume",
    trigger=inngest.TriggerEvent(event="app/score-resume")
)
async def score_resume(ctx: inngest.Context) -> None:
    """
    Score a resume
    """
    file = ctx.event.data["file"]
    job_id = ctx.event.data["job_id"]
    credentials_dict = ctx.event.data["credentials_dict"]
    
    # Convert dict back to Credentials object
    credentials = OAuthCredentialsService.get_credentials(credentials_dict)

    # Upload the resume id to postgres
    resume = await ctx.step.run(
        "upload-resume-id",
        upload_resume_id,
        file["id"],
        job_id,
    )


async def upload_resume_id(resume_id: str, job_id: str) -> dict:
    """
    Upload the resume id to postgres
    """
    supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_SERVICE_ROLE_KEY"))
    resume = supabase.table("resumes").insert({
        "google_id": resume_id,
        "job_id": job_id,
        "status": "pending"
    }).execute().data

    return resume[0]
