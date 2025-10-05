import os
from supabase import create_client, Client
from django.conf import settings

class SupabaseClient:
    def __init__(self):
        # Get from Django settings instead of os.environ
        self.url = getattr(settings, 'https://khhiuidcepwdrtuzoqrc.supabase.co', None)
        self.key = getattr(settings, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtoaGl1aWRjZXB3ZHJ0dXpvcXJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1OTI3OTYsImV4cCI6MjA3NTE2ODc5Nn0.XoKSVONoAzHKiXb0BGyYrioSHu9wh8Y5VuJIEZDapHs', None)
        
        if not self.url or not self.key:
            raise Exception("Supabase URL and KEY must be set in Django settings")
        
        self.client: Client = create_client(self.url, self.key)
    
    def get_client(self):
        return self.client

# Don't create instance at module level - create a function instead
def get_supabase_client():
    return SupabaseClient().get_client()
