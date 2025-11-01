from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.password_validation import validate_password
from django.core.validators import RegexValidator
from .models import CustomUser

class CustomUserCreationForm(UserCreationForm):
    email = forms.EmailField(required=True)
    first_name = forms.CharField(max_length=30, required=True)
    last_name = forms.CharField(max_length=30, required=True)
    phone = forms.CharField(
        max_length=15,
        required=False,
        validators=[
            RegexValidator(
                regex=r'^\d{10,11}$',
                message="Phone number must be 10 or 11 digits."
            )
        ]
    )
    user_type = forms.ChoiceField(
        choices=[('renter', 'Rent Properties'), ('landlord', 'List Properties')],
        widget=forms.RadioSelect,
        initial='renter'
    )

    class Meta:
        model = CustomUser
        fields = ("username", "email", "first_name", "last_name", "password1", "password2")

    def save(self, commit=True):
        user = super().save(commit=False)
        user.user_role = self.cleaned_data['user_type']
        user.user_phone = self.cleaned_data['phone']
        if commit:
            user.save()
        return user