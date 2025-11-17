from django.urls import path
from . import views

app_name = 'renter'
urlpatterns = [
    path('', views.renterPage, name='home'),  
    path('property/<int:property_id>/', views.property_details, name='property_details'), 
]