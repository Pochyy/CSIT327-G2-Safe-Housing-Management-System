from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    USER_ROLES = [
        ('renter', 'Renter'),
        ('landlord', 'Landlord'),
        ('coordinator', 'Coordinator'),
    ]
    
    user_role = models.CharField(max_length=20, choices=USER_ROLES, default='renter')
    user_phone = models.CharField(max_length=20, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def save(self, *args, **kwargs):
        if self.first_name:
            self.first_name = self.first_name.title()
        if self.last_name:
            self.last_name = self.last_name.title()
        
        if self.email:
            self.email = self.email.lower()
            
        if self.username:
            self.username = self.username.lower()
            
        super().save(*args, **kwargs)
    
    @property
    def is_landlord(self):
        return self.user_role == 'landlord'
    
    @property
    def is_renter(self):
        return self.user_role == 'renter'
    
    @property
    def is_coordinator(self):  
        return self.user_role == 'coordinator'