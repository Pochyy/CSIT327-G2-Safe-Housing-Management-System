from django.urls import path
from . import views

app_name = 'renterPage'  

urlpatterns = [
    path('', views.renter_dashboard, name='renter_dashboard'),  
]