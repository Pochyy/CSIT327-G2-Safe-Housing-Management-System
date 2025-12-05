from django.contrib.auth.decorators import login_required
from django.shortcuts import render, get_object_or_404
from django.shortcuts import render, get_object_or_404, redirect  # Add redirect here
from django.contrib import messages  # Add this import
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
    
    # Get comments for this property
    from .models import PropertyComment  # Import at function level to avoid circular imports
    comments = property_obj.comments.all().prefetch_related('replies')

    context = {
        'property': property_obj,
        'user': request.user,
        'landlord': landlord,
        'landlord_name': f"{landlord.first_name} {landlord.last_name}",
        'landlord_phone': landlord.user_phone,
        'landlord_email': landlord.email,
        'comments': comments,  # Add this line
    }
    return render(request, 'renterPage/property_details.html', context)

@login_required
def add_comment(request, property_id):
    # Only renters can post comments
    if request.user.user_role != 'renter':
        messages.error(request, 'Only renters can post comments.')
        return redirect('renter:property_details', property_id=property_id)
    
    if request.method == 'POST':
        property_obj = get_object_or_404(Property, id=property_id)
        content = request.POST.get('comment_content', '').strip()
        
        if len(content) < 5:
            messages.error(request, 'Comment must be at least 5 characters.')
            return redirect('renter:property_details', property_id=property_id)
        
        # Create the comment - THIS SAVES TO SUPABASE
        from .models import PropertyComment
        PropertyComment.objects.create(
            property=property_obj,
            user=request.user,
            content=content
        )
        
        messages.success(request, 'Your comment has been posted!')
        return redirect('renter:property_details', property_id=property_id)
    
    # If not POST, redirect back
    return redirect('renter:property_details', property_id=property_id)

@login_required
def add_reply(request, comment_id):
    # Only landlords can reply
    if request.user.user_role != 'landlord':
        messages.error(request, 'Only landlords can reply to comments.')
        return redirect('renter:home')
    
    if request.method == 'POST':
        from .models import PropertyComment, CommentReply
        comment = get_object_or_404(PropertyComment, id=comment_id)
        content = request.POST.get('reply_content', '').strip()
        
        if len(content) < 3:
            messages.error(request, 'Reply must be at least 3 characters.')
            return redirect('renter:property_details', property_id=comment.property.id)
        
        # Create the reply - THIS SAVES TO SUPABASE
        CommentReply.objects.create(
            comment=comment,
            user=request.user,
            content=content
        )
        
        messages.success(request, 'Your reply has been posted!')
        return redirect('renter:property_details', property_id=comment.property.id)
    
    # If not POST, redirect back
    return redirect('renter:property_details', property_id=comment.property.id)