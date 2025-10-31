from django.urls import path
from . import views

app_name = 'renterPage'  

urlpatterns = [
    path('', views.renterPage, name='renterPage'),  
]