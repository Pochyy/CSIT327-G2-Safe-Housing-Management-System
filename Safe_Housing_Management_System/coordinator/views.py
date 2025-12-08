from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db.models import Q
from landLordPage.models import Property, Notification


@login_required
def coordinator_dashboard(request):
    # Check if user is coordinator
    if not request.user.is_coordinator:
        messages.error(request, "You don't have permission to access this page.")
        return redirect('/login/')
    
    # Get search and location filters
    search_query = request.GET.get('search', '').strip()
    location_filter = request.GET.get('location', '').strip()
    
    # Get filter status
    status_filter = request.GET.get('status', 'all')
    
    # Base query for pending properties
    if status_filter == 'all':
        properties = Property.objects.all()
    elif status_filter == 'pending':
        properties = Property.objects.filter(status='Pending')
    elif status_filter == 'approved':
        properties = Property.objects.filter(status='Approved')
    elif status_filter == 'rejected':
        properties = Property.objects.filter(status='Rejected')
    else:
        properties = Property.objects.filter(status='Pending')
    
    # Apply search filter
    if search_query:
        properties = properties.filter(
            Q(property_name__icontains=search_query) |
            Q(landlord__username__icontains=search_query) |
            Q(landlord__first_name__icontains=search_query) |
            Q(landlord__last_name__icontains=search_query)
        )
    
    # Apply location filter
    if location_filter:
        properties = properties.filter(location__icontains=location_filter)
    
    properties = properties.order_by('-created_at')
    
    # Calculate stats
    total_properties = Property.objects.all().count()
    approved_properties = Property.objects.filter(status='Approved').count()
    pending_properties = Property.objects.filter(status='Pending').count()
    rejected_properties = Property.objects.filter(status='Rejected').count()
    
    context = {
        'properties': properties,
        'total_properties': total_properties,
        'approved_properties': approved_properties,
        'pending_properties': pending_properties,
        'rejected_properties': rejected_properties,
        'search_query': search_query,
        'location_filter': location_filter,
        'status_filter': status_filter,
    }
    return render(request, 'coordinator/dashboard.html', context)


@login_required
def property_details(request, property_id):
    """Property details page for coordinator with approve/reject buttons"""
    if not request.user.is_coordinator:
        messages.error(request, "Unauthorized access.")
        return redirect('/login/')
    
    property = get_object_or_404(Property, id=property_id)
    
    # Get landlord info
    landlord = property.landlord
    landlord_name = f"{landlord.first_name} {landlord.last_name}".strip() or landlord.username
    
    context = {
        'property': property,
        'landlord_name': landlord_name,
        'landlord_email': landlord.email,
        'landlord_phone': landlord.user_phone if hasattr(landlord, 'user_phone') else 'Not provided',
    }
    return render(request, 'coordinator/property_details.html', context)


@login_required
def approve_property(request, property_id):
    if not request.user.is_coordinator:
        messages.error(request, "Unauthorized access.")
        return redirect('/login/')
    
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
        return redirect('/login/')
    
    property = get_object_or_404(Property, id=property_id)
    
    if request.method == 'POST':
        rejection_reason = request.POST.get('rejection_reason', '').strip()
        
        if not rejection_reason:
            messages.error(request, "Please provide a rejection reason.")
            return redirect('property_details_coordinator', property_id=property_id)
        
        property.status = 'Rejected'
        property.rejection_reason = rejection_reason
        property.save()
        
        # Create notification for landlord
        Notification.objects.create(
            user=property.landlord,
            message=f'Your property "{property.property_name}" has been rejected. Reason: {rejection_reason}',
            notification_type='rejection'
        )
        
        messages.success(request, f'Property "{property.property_name}" has been rejected.')
        return redirect('coordinator_dashboard')
    
    return redirect('property_details_coordinator', property_id=property_id)


@login_required
def review_history(request):
    """Show approved/rejected properties (archived/completed reviews)"""
    if not request.user.is_coordinator:
        messages.error(request, "You don't have permission to access this page.")
        return redirect('/login/')
    
    # Get filter
    filter_status = request.GET.get('filter', 'all')
    
    if filter_status == 'approved':
        properties = Property.objects.filter(status='Approved')
    elif filter_status == 'rejected':
        properties = Property.objects.filter(status='Rejected')
    else:
        properties = Property.objects.filter(Q(status='Approved') | Q(status='Rejected'))
    
    properties = properties.order_by('-created_at')
    
    # Calculate stats
    approved_count = Property.objects.filter(status='Approved').count()
    rejected_count = Property.objects.filter(status='Rejected').count()
    total_reviewed = approved_count + rejected_count
    
    # Calculate approval rate
    if total_reviewed > 0:
        approval_rate = round((approved_count / total_reviewed) * 100, 1)
    else:
        approval_rate = 0
    
    context = {
        'properties': properties,
        'filter_status': filter_status,
        'approved_count': approved_count,
        'rejected_count': rejected_count,
        'total_reviewed': total_reviewed,
        'approval_rate': approval_rate,
    }
    return render(request, 'coordinator/review_history.html', context)

