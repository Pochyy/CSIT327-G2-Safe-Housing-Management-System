from django.urls import path
from . import views

app_name = 'landLordPage'

urlpatterns = [
    path('', views.landLordPage, name='landLordPage'),  # maps /landlord/ to views.home
]