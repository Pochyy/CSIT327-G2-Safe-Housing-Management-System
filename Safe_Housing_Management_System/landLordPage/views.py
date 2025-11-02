from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from .forms import PropertyForm

@login_required
def landLordPage(request):
    user = request.user 
    form = PropertyForm()  # Create an empty form instance
    
    context = {
        'username': user.username,
        'role': user.user_role,
        'form': form,  # Add form to context
    }
    return render(request, 'landLordPage.html', context)

@login_required
def add_property(request):
    if request.method == 'POST':
        form = PropertyForm(request.POST, request.FILES)  # Include request.FILES for image upload
        if form.is_valid():
            property = form.save(commit=False)
            property.landlord = request.user
            property.save()
            return redirect('landlord:home')
    else:
        form = PropertyForm()
    
    return render(request, 'add_property.html', {'form': form})