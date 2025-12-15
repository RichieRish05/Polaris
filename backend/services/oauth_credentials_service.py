"""
OAuth Credentials Service - Handles storing and retrieving Google OAuth credentials
with automatic token refresh.

Key points:
- Store BOTH access_token AND refresh_token in database
- google-auth library automatically refreshes expired access tokens
- Update stored credentials after refresh (library updates the token dict)
- Only delete/revoke if refresh fails or user explicitly revokes
"""

import json
import os
from datetime import datetime, timedelta
from typing import Optional
from dotenv import load_dotenv

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow

load_dotenv()

CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")

class OAuthCredentialsService:

    def get_flow(self):
        """
        Get the OAuth flow for the Google API in order to get the credentials
        """
        return Flow.from_client_config(
            {
                "web": {
                    "client_id": CLIENT_ID,
                    "client_secret": CLIENT_SECRET,
                    "redirect_uris": [REDIRECT_URI],
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://accounts.google.com/o/oauth2/token"
                }
            },
            scopes=[
                "openid", 
                "https://www.googleapis.com/auth/userinfo.email", 
                "https://www.googleapis.com/auth/userinfo.profile",
                "https://www.googleapis.com/auth/drive.file"
            ],
            redirect_uri=REDIRECT_URI,
        )
    
    def get_redirect_uri(self, flow: Flow):
        """
        Get the redirect URI for the OAuth flow
        """
        return flow.authorization_url()




