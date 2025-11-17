from django.db import models
from django.conf import settings
import os

class Property(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    ]

    landlord = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='properties'
    )

    property_name = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    beds = models.PositiveIntegerField(default=0)
    bathrooms = models.PositiveIntegerField(default=0)
    area = models.PositiveIntegerField(help_text="Area in square feet")
    property_description = models.TextField(max_length=1000)
    image = models.ImageField(upload_to='property_images/', null=True, blank=True)

    # Amenities Sections
    electricity = models.BooleanField(default=False)
    water = models.BooleanField(default=False)
    internet = models.BooleanField(default=False)
    airconditioning = models.BooleanField(default=False)
    kitchen = models.BooleanField(default=False)
    shared_kitchen = models.BooleanField(default=False)
    private_bathroom = models.BooleanField(default=False)
    shared_bathroom = models.BooleanField(default=False)

    # Safety and Security
    secure_locks = models.BooleanField(default=False)
    cctv = models.BooleanField(default=False)
    gated_compound = models.BooleanField(default=False)
    security_guard = models.BooleanField(default=False)

    # Property Features
    parking = models.BooleanField(default=False)
    furnished = models.BooleanField(default=False)
    pet_friendly = models.BooleanField(default=False)

    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Properties"  

    def __str__(self):
        return f"{self.property_name} ({self.status})"
    
    def save(self, *args, **kwargs):
        """Override save to handle image cleanup"""
        try:
            # Get the old instance if it exists
            if self.pk:
                old_property = Property.objects.get(pk=self.pk)
                
                # Check if image is being changed or removed
                if old_property.image and old_property.image != self.image:
                    # Delete the old image file from storage
                    if os.path.isfile(old_property.image.path):
                        os.remove(old_property.image.path)
        except Property.DoesNotExist:
            pass  # It's a new property, no old image to delete
        
        super().save(*args, **kwargs)
    
    def delete(self, *args, **kwargs):
        """Override delete to remove image file"""
        if self.image:
            # Delete the image file from storage
            if os.path.isfile(self.image.path):
                os.remove(self.image.path)
        super().delete(*args, **kwargs)
    
    @property
    def image_url(self):
        if self.image and hasattr(self.image, 'url'):
            return self.image.url
        return '/static/images/default-property.jpg'


class Notification(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    message = models.TextField()
    notification_type = models.CharField(max_length=20, choices=[
        ('approval', 'Approval'),
        ('rejection', 'Rejection'),
        ('system', 'System')
    ])
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.message}"