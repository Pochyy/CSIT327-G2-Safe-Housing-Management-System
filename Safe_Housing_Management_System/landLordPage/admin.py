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
            'fields': ('status', 'created_at')
        }),
    )
    
    def approve_properties(self, request, queryset):
        queryset.update(status='Approved')
        for property in queryset:
            Notification.objects.create(
                user=property.landlord,
                message=f'Your property "{property.property_name}" has been approved!',
                notification_type='approval'
            )
        self.message_user(request, f'{queryset.count()} properties approved successfully.')
    approve_properties.short_description = "Approve selected properties"
    
    def reject_properties(self, request, queryset):
        queryset.update(status='Rejected')
        for property in queryset:
            Notification.objects.create(
                user=property.landlord,
                message=f'Your property "{property.property_name}" has been rejected.',
                notification_type='rejection'
            )
        self.message_user(request, f'{queryset.count()} properties rejected.')
    reject_properties.short_description = "Reject selected properties"

# Register Notification model too
@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['user', 'message', 'notification_type', 'is_read', 'created_at']
    list_filter = ['notification_type', 'is_read', 'created_at']
    list_editable = ['is_read']
    search_fields = ['user__username', 'message']