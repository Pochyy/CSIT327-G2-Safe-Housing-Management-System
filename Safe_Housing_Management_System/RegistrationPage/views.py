from django.shortcuts import render, redirect
from django.contrib import messages
import hashlib
from supabase import create_client
from datetime import datetime

def registration_page(request):
    if request.method == 'POST':
        try:
            # Get form data
            first_name = request.POST.get('first_name')
            last_name = request.POST.get('last_name')
            email = request.POST.get('email')
            username = request.POST.get('username')
            password = request.POST.get('password')
            confirm_password = request.POST.get('confirm_password')
            phone = request.POST.get('phone')
            user_type = request.POST.get('user_type', 'renter')
            
            # Basic validation
            if password != confirm_password:
                messages.error(request, "Passwords do not match.")
                return render(request, 'RegistrationPage.html')
            
            if len(password) < 6:
                messages.error(request, "Password must be at least 6 characters long.")
                return render(request, 'RegistrationPage.html')
            
            # Hash password
            password_hash = hashlib.sha256(password.encode()).hexdigest()
            
            # Connect to Supabase directly
            supabase_url = "https://khhiuidcepwdrtuzoqrc.supabase.co"
            supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtoaGl1aWRjZXB3ZHJ0dXpvcXJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1OTI3OTYsImV4cCI6MjA3NTE2ODc5Nn0.XoKSVONoAzHKiXb0BGyYrioSHu9wh8Y5VuJIEZDapHs"
            
            client = create_client(supabase_url, supabase_key)
            
            # Insert into Supabase - USING YOUR ACTUAL COLUMN NAMES
            response = client.table('users').insert({
                'username': username,
                'user_password': password_hash,  # Changed from password_hash to user_password
                'user_role': user_type,          # Changed from role to user_role
                'user_email': email,                 # You might need to add this column
                'user_first_name': first_name,       # You might need to add this column  
                'user_last_name': last_name,         # You might need to add this column
                'user_phone': phone,                 # You might need to add this column
                'created_at': datetime.now().isoformat(),
                'updated_at': datetime.now().isoformat()
            }).execute()
            
            if response.data:
                messages.success(request, "Registration successful! Please login.")
                return redirect('login')
            else:
                messages.error(request, "Registration failed. Please try again.")
                
        except Exception as e:
            error_message = str(e)
            if 'duplicate key' in error_message.lower():
                if 'email' in error_message:
                    messages.error(request, "Email already exists.")
                elif 'username' in error_message:
                    messages.error(request, "Username already taken.")
            else:
                messages.error(request, f"An error occurred: {error_message}")
    
    return render(request, 'RegistrationPage.html')