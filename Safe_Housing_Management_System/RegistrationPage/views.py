from django.shortcuts import render, redirect
from django.contrib import messages
from .forms import CustomUserCreationForm

def registration_page(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.user_role = form.cleaned_data['user_type']
            user.user_phone = form.cleaned_data['phone']
            user.set_password(form.cleaned_data['password'])  # <-- This hashes the password!
            user.save()
            messages.success(request, "Registration successful! Please login.")
            return redirect('login')
        else:
            messages.error(request, "Please fix the errors below.")
    else:
        form = CustomUserCreationForm()
    return render(request, 'RegistrationPage.html', {'form': form})

