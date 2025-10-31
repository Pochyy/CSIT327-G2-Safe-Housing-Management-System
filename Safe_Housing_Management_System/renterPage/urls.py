from django.urls import path
from . import views

app_name = 'renter'
urlpatterns = [
    path('', views.renterPage, name='home'),  
]