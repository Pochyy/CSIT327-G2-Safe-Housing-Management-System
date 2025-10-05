import requests

# Your Supabase details
supabase_url = "https://khhiuidcepwdrtuzoqrc.supabase.co"
supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtoaGl1aWRjZXB3ZHJ0dXpvcXJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1OTI3OTYsImV4cCI6MjA3NTE2ODc5Nn0.XoKSVONoAzHKiXb0BGyYrioSHu9wh8Y5VuJIEZDapHs"

print("Testing Supabase connection...")

# Test 1: Check if Supabase is responding
try:
    response = requests.get(f"{supabase_url}/rest/v1/", headers={
        "apikey": supabase_key,
        "Authorization": f"Bearer {supabase_key}"
    })
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        print("✅ Supabase is responding!")
    elif response.status_code == 404:
        print("❌ Project not found or inactive")
    else:
        print(f"❌ Error: {response.status_code} - {response.text}")
        
except Exception as e:
    print(f"❌ Connection failed: {e}")