from fastapi import APIRouter
from services.oauth_credentials_service import OAuthCredentialsService
from fastapi.responses import RedirectResponse
from fastapi import Response, Cookie, HTTPException, Request
from dotenv import load_dotenv
from googleapiclient.discovery import build
import os
from google.oauth2.credentials import Credentials
from services.jwt_service import JwtService
from supabase import create_client, Client

load_dotenv()

router = APIRouter()

BASE_URL = os.getenv("FRONTEND_URL")
oauth_credentials_service = OAuthCredentialsService()
jwt_service = JwtService()

@router.get("/authorize")
async def get_oauth_redirect_uri(response: Response, request: Request):
    # Check if user is already authenticated
    payload = jwt_service.verify_token(request.cookies.get("access_token"))
    if payload:
        return RedirectResponse(f"{BASE_URL}/", status_code=302)

    

    flow = oauth_credentials_service.get_flow()
    redirect_url, state = flow.authorization_url(
        access_type='offline',  # Required to get refresh token
        prompt='consent'        # Force consent screen to get refresh token
    )

    # Create redirect response and set state cookie on it
    redirect_response = RedirectResponse(redirect_url, status_code=302)
    redirect_response.set_cookie(
        key="oauth_state",
        value=state,
        max_age=600,
        httponly=True,
        secure=False,  # Set to False for local development, True for production HTTPS
        samesite="lax",  # Changed from "none" to "lax" for better compatibility
        path="/"
    )

    return redirect_response

@router.get("/callback")
async def oauth_callback(
    code: str, 
    state: str,
    response: Response,
    oauth_state: str = Cookie(None)
    ):

    if oauth_state != state:
        print(f"State mismatch: {oauth_state} != {state}")
        response.delete_cookie(key="oauth_state")
        raise HTTPException(status_code=400, detail="State mismatch")

    flow = oauth_credentials_service.get_flow()
    flow.fetch_token(code=code)
    credentials = flow.credentials


    # Get user information using Google API client
    service = build('oauth2', 'v2', credentials=credentials)
    userinfo = service.userinfo().get().execute()

    # Store credentials in database
    try:
        oauth_credentials = await oauth_credentials_service.store_credentials(userinfo, credentials)
    except Exception as e:
        print(f"Error storing credentials: {e}")
        raise HTTPException(status_code=500, detail="Failed to store credentials")

    
    payload = {
        "user_id": oauth_credentials['user_id'],
    }

    access_token = jwt_service.generate_token(payload)

    redirect_response = RedirectResponse(f"{BASE_URL}/settings")
    redirect_response.set_cookie(
        key="access_token",
        value=access_token,
        max_age=86400,
        httponly=True,
        secure=False,
        samesite="lax",
        path="/"
    )
    return redirect_response


@router.get("/me")
def get_me(request: Request):
    payload = jwt_service.verify_token(request.cookies.get("access_token"))
    if not payload:
        raise HTTPException(status_code=401, detail="Unauthorized invalid token")

    supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_SERVICE_ROLE_KEY"))
    user = supabase.table("User").select("*").eq("id", payload.get("user_id")).execute().data
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized could not find user")
    user = user[0]
    
    return user

@router.post("/logout")
def logout(response: Response):
    """
    Logout endpoint that clears the JWT token cookie.
    """
    response.delete_cookie(
        key="access_token",
        path="/",
        samesite="lax"
    )
    return {"message": "Logged out successfully"}


@router.get("/drive-files")
def get_drive_files(request: Request):
    payload = jwt_service.verify_token(request.cookies.get("access_token"))
    if not payload:
        raise HTTPException(status_code=401, detail="Unauthorized invalid token")

    user_id = payload.get("user_id")
    supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_SERVICE_ROLE_KEY"))
    credentials_data = supabase.table("OauthCredentials").select("*").eq("user_id", user_id).execute().data
    if not credentials_data:
        raise HTTPException(status_code=401, detail="Unauthorized could not find credentials")
    credentials_data = credentials_data[0]

    credentials = Credentials(
        token=credentials_data.get("access_token"),
        refresh_token=credentials_data.get("refresh_token"),
        token_uri=credentials_data.get("token_uri"),
        client_id=os.getenv("GOOGLE_CLIENT_ID"),
        client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
        scopes=[
            "openid", 
            "https://www.googleapis.com/auth/userinfo.email", 
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/drive.file"
        ],
    )
    service = build('drive', 'v3', credentials=credentials)
    files = service.files().list().execute()
    print('FILES', files)
    return files
