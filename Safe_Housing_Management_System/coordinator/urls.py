from django.urls import path
from . import views

urlpatterns = [
    path('', views.coordinator_dashboard, name='coordinator_dashboard'),
    path('property/<int:property_id>/approve/', views.approve_property, name='approve_property'),
    path('property/<int:property_id>/reject/', views.reject_property, name='reject_property'),
    path('all-properties/', views.view_all_properties, name='view_all_properties'),
]