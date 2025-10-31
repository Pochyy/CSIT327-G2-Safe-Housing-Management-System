from django.urls import path
from . import views

app_name = 'landlord'

urlpatterns = [
    path('', views.landLordPage, name='home'),  # maps /landlord/ to views.home
]