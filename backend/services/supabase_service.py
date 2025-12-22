from supabase import create_client, Client
import os
from dotenv import load_dotenv

load_dotenv()

class SupabaseService:

    def __init__(self):
        self.supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_SERVICE_ROLE_KEY"))

    def get_supabase(self):
        """
        Get the supabase client
        """
        return self.supabase
    
    def get_user(self, user_id: int):
        """
        Get a certain user
        """
        return self.supabase.table("User").select("*").eq("id", user_id).execute().data
    
    def get_resume(self, resume_id: int):
        """
        Get a certain resume    
        """
        return self.supabase.table("resumes").select("*").eq("id", resume_id).execute().data
    
    def get_job(self, job_id: int):
        """
        Get a certain job
        """
        return self.supabase.table("jobs").select("*").eq("id", job_id).execute().data
    
    def get_oauth_credentials(self, user_id: int):
        """
        Get the OAuth credentials for a certain user
        """
        return self.supabase.table("OauthCredentials").select("*").eq("user_id", user_id).execute().data
    

    def get_jobs_under_user(self, user_id: int):
        """
        Get all jobs under a certain user
        """
        return self.supabase.table("jobs").select("*").eq("user_id", user_id).execute().data
    
    def get_resumes_under_job(self, job_id: int):
        """
        Get all resumes under a certain job along with score statistics
        """
        # Get all resumes
        resumes = self.supabase.table("resumes").select("*").eq("job_id", job_id).execute().data
        job = self.supabase.table("jobs").select("*").eq("id", job_id).execute().data[0]
        
        # Get statistics using RPC function
        stats_result = self.supabase.rpc('get_resume_score_stats', {'p_job_id': job_id}).execute()
        # Extract statistics from the result
        stats = stats_result.data
        num_resumes = stats.get("count", 0)
        average_score = round(float(stats.get("avg", 0))) if stats.get("avg") else 0
        high_score = stats.get("max", 0) if stats.get("max") else 0
        lowest_score = stats.get("min", 0) if stats.get("min") else 0
        
        return {
            "resumes": resumes,
            "stats": {
                "num_resumes": num_resumes,
                "average_score": average_score,
                "high_score": high_score,
                "lowest_score": lowest_score
            },
            "job_name": job.get("name", "Unnamed Job"),
            "job_date": job.get("created_at"),
        }

    def get_resumes_under_user(self, user_id: int):
        """
        Get all resumes that belong to jobs owned by a user
        """
        return self.supabase.table('resumes').select('*, jobs(*)').eq('jobs.user_id', user_id).execute().data
    






