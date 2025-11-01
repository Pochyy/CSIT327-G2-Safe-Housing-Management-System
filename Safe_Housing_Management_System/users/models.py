from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    USER_ROLES = [
        ('renter', 'Renter'),
        ('landlord', 'Landlord'),
    ]
    
    user_role = models.CharField(max_length=20, choices=USER_ROLES, default='renter')
    user_phone = models.CharField(max_length=20, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.username
    
    @property
    def is_landlord(self):
        return self.user_role == 'landlord'
    
    @property
    def is_renter(self):
        return self.user_role == 'renter'