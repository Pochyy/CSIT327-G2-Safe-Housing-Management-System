from django.contrib.auth.decorators import login_required
from django.shortcuts import render

@login_required
def renterPage(request):
    user = request.user
    # Example: placeholder property data, or you might query the DB later
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
        # ... more property dictionaries ...
    ]
    context = {
        'username': user.username,
        'properties': sample_properties
    }
    return render(request, 'renterPage.html', context)
