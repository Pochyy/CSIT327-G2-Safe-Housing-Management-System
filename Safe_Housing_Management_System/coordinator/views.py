from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from landLordPage.models import Property, Notification

@login_required
def coordinator_dashboard(request):
    # Check if user is coordinator
    if not request.user.is_coordinator:
        messages.error(request, "You don't have permission to access this page.")
        return redirect('/login/')  # Use direct URL
    
    # Get pending properties
    pending_properties = Property.objects.filter(status='Pending').order_by('-created_at')
    
    context = {
        'pending_properties': pending_properties,
    }
    return render(request, 'coordinator/dashboard.html', context)

@login_required
def approve_property(request, property_id):
    if not request.user.is_coordinator:
        messages.error(request, "Unauthorized access.")
        return redirect('/login/')  # Use direct URL
    
    property = get_object_or_404(Property, id=property_id)
    property.status = 'Approved'
    property.rejection_reason = ''
    property.save()
    
    # Create notification for landlord
    Notification.objects.create(
        user=property.landlord,
        message=f'Your property "{property.property_name}" has been approved and is now live!',
        notification_type='approval'
    )
    
    messages.success(request, f'Property "{property.property_name}" approved successfully!')
    return redirect('coordinator_dashboard')

@login_required
def reject_property(request, property_id):
    if not request.user.is_coordinator:
        messages.error(request, "Unauthorized access.")
        return redirect('/login/')  # Use direct URL
    
    property = get_object_or_404(Property, id=property_id)
    
    if request.method == 'POST':
        rejection_reason = request.POST.get('rejection_reason', '')
        
        property.status = 'Rejected'
        property.rejection_reason = rejection_reason
        property.save()
        
        # Create notification for landlord
        if rejection_reason:
            message = f'Your property "{property.property_name}" has been rejected. Reason: {rejection_reason}'
        else:
            message = f'Your property "{property.property_name}" has been rejected.'
        
        Notification.objects.create(
            user=property.landlord,
            message=message,
            notification_type='rejection'
        )
        
        messages.success(request, f'Property "{property.property_name}" rejected.')
        return redirect('coordinator_dashboard')
    
    context = {
        'property': property,
    }
    return render(request, 'coordinator/reject_property.html', context)

@login_required
def view_all_properties(request):
    if not request.user.is_coordinator:
        messages.error(request, "You don't have permission to access this page.")
        return redirect('/login/')  # Use direct URL
    
    properties = Property.objects.all().order_by('-created_at')
    
    context = {
        'properties': properties,
    }
    return render(request, 'coordinator/all_properties.html', context)

@login_required
def property_details_ajax(request, property_id):
    if not request.user.is_coordinator:
        return JsonResponse({'error': 'Unauthorized'}, status=403)
    
    property = get_object_or_404(Property, id=property_id)
    
    # Format amenities as list
    amenities = []
    if property.electricity: amenities.append("⚡ Electricity")
    if property.water: amenities.append("💧 Water")
    if property.internet: amenities.append("🌐 Internet")
    if property.airconditioning: amenities.append("❄️ Air Conditioning")
    if property.kitchen: amenities.append("🍳 Private Kitchen")
    if property.shared_kitchen: amenities.append("🍽️ Shared Kitchen")
    if property.private_bathroom: amenities.append("🚿 Private Bathroom")
    if property.shared_bathroom: amenities.append("🚽 Shared Bathroom")
    if property.secure_locks: amenities.append("🔒 Secure Locks")
    if property.cctv: amenities.append("📹 CCTV")
    if property.gated_compound: amenities.append("🏰 Gated Compound")
    if property.security_guard: amenities.append("👮 Security Guard")
    if property.parking: amenities.append("🅿️ Parking")
    if property.furnished: amenities.append("🛋️ Furnished")
    if property.pet_friendly: amenities.append("🐾 Pet Friendly")
    
    # Format amenities as HTML
    amenities_html = ''
    for amenity in amenities:
        amenities_html += f'<div class="amenity-badge">{amenity}</div>'
    
    data = {
        'property_name': property.property_name,
        'location': property.location,
        'price': str(property.price),  # Convert Decimal to string
        'area': property.area,
        'beds': property.beds,
        'bathrooms': property.bathrooms,
        'property_description': property.property_description,
        'landlord_name': f"{property.landlord.first_name} {property.landlord.last_name}".strip() or property.landlord.username,
        'landlord_email': property.landlord.email,
        'landlord_phone': property.landlord.user_phone or 'Not provided',
        'landlord_joined': property.landlord.date_joined.strftime("%B %d, %Y"),
        'amenities': amenities,
        'amenities_html': amenities_html,
        'status': property.status,
        'created_at': property.created_at.strftime("%B %d, %Y"),
    }
    
    return JsonResponse(data)