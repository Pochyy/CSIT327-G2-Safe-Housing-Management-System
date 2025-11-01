from django import forms
from .models import Property

class PropertyForm(forms.ModelForm):
  class Meta:
    model = Property
    fields = [
      'property_name', 'location', 'price', 'beds', 'bathrooms', 'area', 'property_description',
      #Amenities Sections
      'electricity', 'water', 'internet', 'airconditioning', 'kitchen', 'shared_kitchen', 'private_bathroom', 'shared_bathroom',
      #Safety and Security
      'secure_locks', 'cctv', 'gated_compound', 'security_guard',
      #Property Features
      'parking', 'furnished', 'pet_friendly',
    ]