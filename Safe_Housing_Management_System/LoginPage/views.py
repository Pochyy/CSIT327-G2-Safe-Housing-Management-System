from django.contrib.auth import authenticate, login
from django.contrib.auth import logout
from django.contrib import messages
from django.shortcuts import render, redirect

def login_page(request):
    if request.method == 'POST':
        username = request.POST.get("username")
        password = request.POST.get("password")
        remember = request.POST.get("remember")
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            if remember:
                request.session.set_expiry(1209600)
            else:
                request.session.set_expiry(0)
            messages.success(request, f"Welcome back, {user.username}!")
            return redirect('dashboard')
        else:
            messages.error(request, "Invalid username or password.")
    return render(request, 'LoginPage.html')

def logout_view(request):
    logout(request)
    messages.info(request, "You have been logged out successfully.")
    return redirect('login')