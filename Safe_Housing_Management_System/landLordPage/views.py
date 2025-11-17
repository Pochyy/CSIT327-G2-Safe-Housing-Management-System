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
            return JsonResponse({'success': True, 'message': 'Property added successfully!'})
    else:
        return JsonResponse({
                'success': False, 
                'message': 'Please correct the errors below', 
                'errors': form.errors
            })
    
    return JsonResponse({'success': False, 'message': 'Invalid request method'})

@login_required
def edit_property(request, property_id):
    try:
        property = Property.objects.get(id=property_id, landlord=request.user)
        
        if request.method == 'POST':
            form = PropertyForm(request.POST, request.FILES, instance=property)
            if form.is_valid():
                form.save()
                return JsonResponse({'success': True, 'message': 'Property updated successfully'})
            else:
                return JsonResponse({'success': False, 'message': 'Please correct the errors below', 'errors': form.errors})
        
        # For GET requests, return property data
        elif request.method == 'GET':
            property_data = {
                'id': property.id,
                'property_name': property.property_name,
                'location': property.location,
                'price': float(property.price),  # Convert Decimal to float for JSON
                'beds': property.beds,
                'bathrooms': property.bathrooms,
                'area': property.area,
                'property_description': property.property_description,
                'image_url': property.image.url if property.image else None,
                # Amenities
                'electricity': property.electricity,
                'water': property.water,
                'internet': property.internet,
                'airconditioning': property.airconditioning,
                'kitchen': property.kitchen,
                'shared_kitchen': property.shared_kitchen,
                'private_bathroom': property.private_bathroom,
                'shared_bathroom': property.shared_bathroom,
                # Safety & Security
                'secure_locks': property.secure_locks,
                'cctv': property.cctv,
                'gated_compound': property.gated_compound,
                'security_guard': property.security_guard,
                # Property Features
                'parking': property.parking,
                'furnished': property.furnished,
                'pet_friendly': property.pet_friendly,
            }
            return JsonResponse(property_data)
            
    except Property.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Property not found'}, status=404)

@login_required
@require_http_methods(["DELETE", "POST"])  
def delete_property(request, property_id):
    try:
        property = Property.objects.get(id=property_id, landlord=request.user)
        property.delete()
        return JsonResponse({'success': True, 'message': 'Property deleted successfully'})
    except Property.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Property not found'}, status=404)
    
@login_required
def mark_notification_read(request, notification_id):
    try:
        notification = Notification.objects.get(id=notification_id, user=request.user)
        notification.is_read = True
        notification.save()
        return JsonResponse({'success': True})
    except Notification.DoesNotExist:
        return JsonResponse({'success': False}, status=404)

@login_required
def mark_all_notifications_read(request):
    Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
    return JsonResponse({'success': True})