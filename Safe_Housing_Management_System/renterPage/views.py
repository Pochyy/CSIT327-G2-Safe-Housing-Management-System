from django.contrib.auth.decorators import login_required
from django.shortcuts import render, get_object_or_404
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

@login_required
def property_details(request, property_id):
    # Get the specific property or return 404
    property_obj = get_object_or_404(Property, id=property_id, status='Approved')
    
    landlord = property_obj.landlord  

    context = {
        'property': property_obj,
        'user': request.user,
        'landlord': landlord,
        'landlord_name': f"{landlord.first_name} {landlord.last_name}",
        'landlord_phone': landlord.user_phone,
        'landlord_email': landlord.email
    }
    return render(request, 'renterPage/property_details.html', context)