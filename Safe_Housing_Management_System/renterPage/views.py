from django.shortcuts import render
from django.contrib.auth.decorators import login_required

# @login_required  # Temporarily comment this out for testing
def renter_dashboard(request):
    # Sample data - your template needs 'username' and 'properties'
    sample_properties = [
        {
            'title': 'Modern Apartment in Downtown',
            'location': 'New York, NY',
            'bedrooms': 2,
            'bathrooms': 1,
            'sqft': 850,
            'price': 2500,
            'rating': 4.5,
            'reviews': 23,
            'amenities': ['parking', 'laundry', 'gym', 'pool'],
            'image_url': 'https://via.placeholder.com/400x200?text=Apartment+1'
        },
        {
            'title': 'Cozy Studio Near Campus', 
            'location': 'Los Angeles, CA',
            'bedrooms': 1,
            'bathrooms': 1, 
            'sqft': 500,
            'price': 1800,
            'rating': 4.2,
            'reviews': 15,
            'amenities': ['wifi', 'furnished', 'utilities'],
            'image_url': 'https://via.placeholder.com/400x200?text=Apartment+2'
        }
    ]
    
    context = {
        'username': 'Haven',  # Your template needs this
        'properties': sample_properties  # Your template needs this
    }
    
    return render(request, 'renterPage.html', context)