from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.validators import RegexValidator

class CustomUserCreationForm(forms.ModelForm):
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
    password = forms.CharField(label="Password", widget=forms.PasswordInput)
    confirm_password = forms.CharField(label="Confirm Password", widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = ("username", "email", "first_name", "last_name", "phone", "user_type", "password", "confirm_password")

    def clean_password(self):
        password = self.cleaned_data.get("password")
        validate_password(password)  # Django password validators
        return password

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get("password")
        confirm_password = cleaned_data.get("confirm_password")
        if password != confirm_password:
            self.add_error("confirm_password", "Passwords do not match.")
