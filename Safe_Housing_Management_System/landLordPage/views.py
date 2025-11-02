from django.views.decorators.cache import never_cache   
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from .forms import PropertyForm
from .models import Property, Notification

@never_cache
@login_required
def landLordPage(request):
    user = request.user 
    form = PropertyForm()  # Create an empty form instance
    notifications = Notification.objects.filter(user=user, is_read=False).order_by('-created_at')

    
    properties = Property.objects.filter(landlord=user)
    total_properties = properties.count()
    approved_properties = properties.filter(status='Approved').count()
    pending_properties = properties.filter(status='Pending').count()
    rejected_properties = properties.filter(status='Rejected').count()

    context = {
        'username': user.username,
        'first_name': user.first_name,  
        'last_name': user.last_name,    
        'full_name': f"{user.first_name} {user.last_name}",  
        'role': user.user_role,
        'form': form,
        'total_properties': total_properties,
        'approved_properties': approved_properties,
        'pending_properties': pending_properties,
        'rejected_properties': rejected_properties,
        'properties': properties,
        'notifications': notifications,
        'unread_count': notifications.count(),
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

# ADD THIS DELETE VIEW (with correct decorator placement)
@login_required
@require_http_methods(["DELETE", "POST"])  
def delete_property(request, property_id):
    try:
        property = Property.objects.get(id=property_id, landlord=request.user)
        property.delete()
        return JsonResponse({'success': True, 'message': 'Property deleted successfully'})
    except Property.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Property not found'}, status=404)