from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from landLordPage.models import Property  # Import the Property model from landlord app

@login_required
def renterPage(request):
    user = request.user
    
    # Get only approved properties for renters to see
    approved_properties = Property.objects.filter(status='Approved')
    
    context = {
        'username': user.username,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'properties': approved_properties  # Now using real database properties
    }
    return render(request, 'renterPage.html', context)