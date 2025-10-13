from django.shortcuts import render, redirect
from django.contrib import messages
from .forms import CustomUserCreationForm
from supabase import create_client
from datetime import datetime
import hashlib

supabase_url = "https://khhiuidcepwdrtuzoqrc.supabase.co"
supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtoaGl1aWRjZXB3ZHJ0dXpvcXJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1OTI3OTYsImV4cCI6MjA3NTE2ODc5Nn0.XoKSVONoAzHKiXb0BGyYrioSHu9wh8Y5VuJIEZDapHs"
client = create_client(supabase_url, supabase_key)

def registration_page(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            data = form.cleaned_data
            password_hash = hashlib.sha256(data['password'].encode()).hexdigest()

            try:
                response = client.table('users').insert({
                    'username': data['username'],
                    'user_password': password_hash,
                    'user_role': data['user_type'],
                    'user_email': data['email'],
                    'user_first_name': data['first_name'],
                    'user_last_name': data['last_name'],
                    'user_phone': data['phone'],
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
        else:
            messages.error(request, "Please fix the errors below.")
    else:
        form = CustomUserCreationForm()
    
    return render(request, 'RegistrationPage.html', {'form': form})
