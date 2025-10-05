from django.shortcuts import render, redirect
from django.contrib import messages
import hashlib
from supabase import create_client

def login_page(request):
    if request.method == 'POST':
        try:
            username = request.POST.get('username')
            password = request.POST.get('password')
            
            password_hash = hashlib.sha256(password.encode()).hexdigest()
            
            supabase_url = "https://khhiuidcepwdrtuzoqrc.supabase.co"
            supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtoaGl1aWRjZXB3ZHJ0dXpvcXJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1OTI3OTYsImV4cCI6MjA3NTE2ODc5Nn0.XoKSVONoAzHKiXb0BGyYrioSHu9wh8Y5VuJIEZDapHs"
            
            client = create_client(supabase_url, supabase_key)
            
            response = client.table('users')\
                .select('*')\
                .eq('username', username)\
                .eq('user_password', password_hash)\
                .execute()
            
            if response.data and len(response.data) > 0:
                user = response.data[0]
                messages.success(request, f"Welcome back, {user['username']}!")
                request.session['user_id'] = user['user_id']
                request.session['username'] = user['username']
                request.session['user_role'] = user['user_role']
                return redirect('dashboard')
            else:
                messages.error(request, "Invalid username or password.")
                
        except Exception as e:
            messages.error(request, f"An error occurred: {str(e)}")
    
    return render(request, 'LoginPage.html')
