from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import AuthenticationForm  
from django.contrib import messages
from .forms import CustomUserCreationForm

def login_view(request):
    if request.user.is_authenticated:
        if request.user.user_role == "landlord":
            return redirect('landlord:home')  
        elif request.user.user_role == "renter":
            return redirect('renter:home')  
        elif request.user.user_role == "coordinator":  
            return redirect('coordinator_dashboard')
        return redirect('dashboard')
    
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            
            # Handle "remember me"
            remember = request.POST.get("remember")
            if remember:
                request.session.set_expiry(1209600)
            else:
                request.session.set_expiry(0)
            
            # Redirect based on user role
            if user.user_role == "landlord":
                return redirect('landlord:home')  
            elif user.user_role == "renter":
                return redirect('renter:home')  
            elif user.user_role == "coordinator":  
                return redirect('coordinator_dashboard')  
            return redirect('dashboard')
        else:
            messages.error(request, "Invalid username or password.")
            return redirect('users:login')  
    
    else:
        form = AuthenticationForm()
    
    return render(request, 'users/login.html', {'form': form})

def register_view(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            return redirect('users:login')  
        # If form is invalid, errors are automatically attached to the form
    else:
        form = CustomUserCreationForm()
    
    return render(request, 'users/register.html', {'form': form})

def logout_view(request):
    logout(request)
    return redirect('users:login')