from django import forms
from .models import Property

class PropertyForm(forms.ModelForm):
    class Meta:
        model = Property
        fields = [
            'property_name', 'location', 'price', 'beds', 'bathrooms', 'area', 'property_description', 'image',
            'electricity', 'water', 'internet', 'airconditioning', 'kitchen', 'shared_kitchen', 'private_bathroom', 'shared_bathroom',
            'secure_locks', 'cctv', 'gated_compound', 'security_guard',
            'parking', 'furnished', 'pet_friendly',
        ]
        widgets = {
            'property_name': forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'e.g., Modern Downtown Apartment'}),
            'location': forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'City, State'}),
            'price': forms.NumberInput(attrs={'class': 'form-input', 'placeholder': 'e.g., 25000'}),
            'beds': forms.NumberInput(attrs={'class': 'form-input', 'placeholder': '2'}),
            'bathrooms': forms.NumberInput(attrs={'class': 'form-input', 'placeholder': '2'}),
            'area': forms.NumberInput(attrs={'class': 'form-input', 'placeholder': '1200'}),
            'property_description': forms.Textarea(attrs={'class': 'form-input', 'rows': 4, 'placeholder': 'Describe your property...'}),
            'image': forms.FileInput(attrs={'style': 'display: none;'}),
            # All checkbox fields
            'electricity': forms.CheckboxInput(attrs={'class': 'amenity-checkbox'}),
            'water': forms.CheckboxInput(attrs={'class': 'amenity-checkbox'}),
            'internet': forms.CheckboxInput(attrs={'class': 'amenity-checkbox'}),
            'airconditioning': forms.CheckboxInput(attrs={'class': 'amenity-checkbox'}),
            'kitchen': forms.CheckboxInput(attrs={'class': 'amenity-checkbox'}),
            'shared_kitchen': forms.CheckboxInput(attrs={'class': 'amenity-checkbox'}),
            'private_bathroom': forms.CheckboxInput(attrs={'class': 'amenity-checkbox'}),
            'shared_bathroom': forms.CheckboxInput(attrs={'class': 'amenity-checkbox'}),
            'secure_locks': forms.CheckboxInput(attrs={'class': 'amenity-checkbox'}),
            'cctv': forms.CheckboxInput(attrs={'class': 'amenity-checkbox'}),
            'gated_compound': forms.CheckboxInput(attrs={'class': 'amenity-checkbox'}),
            'security_guard': forms.CheckboxInput(attrs={'class': 'amenity-checkbox'}),
            'parking': forms.CheckboxInput(attrs={'class': 'amenity-checkbox'}),
            'furnished': forms.CheckboxInput(attrs={'class': 'amenity-checkbox'}),
            'pet_friendly': forms.CheckboxInput(attrs={'class': 'amenity-checkbox'}),
        }