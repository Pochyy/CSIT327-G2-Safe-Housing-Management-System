from django.contrib import admin
from .models import Property, Notification

@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ['property_name', 'landlord', 'location', 'price', 'beds', 'bathrooms', 'status', 'created_at']
    list_filter = ['status', 'created_at', 'location']
    search_fields = ['property_name', 'location', 'landlord__username']
    list_editable = ['status']
    readonly_fields = ['created_at']
    actions = ['approve_properties', 'reject_properties']
    
    fieldsets = (
        ('Property Information', {
            'fields': ('landlord', 'property_name', 'location', 'price', 'beds', 'bathrooms', 'area', 'property_description', 'image')
        }),
        ('Amenities', {
            'fields': (
                'electricity', 'water', 'internet', 'airconditioning', 
                'kitchen', 'shared_kitchen', 'private_bathroom', 'shared_bathroom'
            )
        }),
        ('Safety & Security', {
            'fields': ('secure_locks', 'cctv', 'gated_compound', 'security_guard')
        }),
        ('Features', {
            'fields': ('parking', 'furnished', 'pet_friendly')
        }),
        ('Status', {
            'fields': ('status', 'rejection_reason', 'created_at')
        }),
    )
    
    def approve_properties(self, request, queryset):
        queryset.update(status='Approved', rejection_reason='')
        for property in queryset:
            Notification.objects.create(
                user=property.landlord,
                message=f'Your property "{property.property_name}" has been approved!',
                notification_type='approval'
            )
        self.message_user(request, f'{queryset.count()} properties approved successfully.')
    approve_properties.short_description = "Approve selected properties"
    
    def reject_properties(self, request, queryset):
        # Simple bulk rejection - just mark as rejected
        queryset.update(status='Rejected')
        for property in queryset:
            Notification.objects.create(
                user=property.landlord,
                message=f'Your property "{property.property_name}" has been rejected. Please check property details for more information.',
                notification_type='rejection'
            )
        self.message_user(request, f'{queryset.count()} properties rejected. You can edit individual properties to add specific rejection reasons.')
    reject_properties.short_description = "Reject selected properties"

    def save_model(self, request, obj, form, change):
        # Check if status is being changed
        if change and 'status' in form.changed_data:
            old_status = Property.objects.get(pk=obj.pk).status
            new_status = obj.status
            
            # Only create notification if status actually changed
            if old_status != new_status:
                if new_status == 'Approved':
                    obj.rejection_reason = ''  # Clear rejection reason when approving
                    Notification.objects.create(
                        user=obj.landlord,
                        message=f'Your property "{obj.property_name}" has been approved and is now live!',
                        notification_type='approval'
                    )
                elif new_status == 'Rejected':
                    # Include the rejection reason in the notification if provided
                    if obj.rejection_reason:
                        notification_message = f'Your property "{obj.property_name}" has been rejected. Reason: {obj.rejection_reason}'
                    else:
                        notification_message = f'Your property "{obj.property_name}" has been rejected. Please contact admin for details.'
                    
                    Notification.objects.create(
                        user=obj.landlord,
                        message=notification_message,
                        notification_type='rejection'
                    )
        
        super().save_model(request, obj, form, change)

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['user', 'message', 'notification_type', 'is_read', 'created_at']
    list_filter = ['notification_type', 'is_read', 'created_at']
    list_editable = ['is_read']
    search_fields = ['user__username', 'message']