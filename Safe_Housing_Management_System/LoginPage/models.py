from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    user_role = models.CharField(max_length=20)
    user_phone = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.username
