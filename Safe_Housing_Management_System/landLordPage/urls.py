from django.urls import path
from . import views

app_name = 'landlord'

urlpatterns = [
    path('', views.landLordPage, name='home'),  # maps /landlord/ to views.home
    path('add-property/', views.add_property, name='add_property'),
    path('delete-property/<int:property_id>/', views.delete_property, name='delete_property'),  
    path('edit-property/<int:property_id>/', views.edit_property, name='edit_property'),  
    path('notifications/mark-read/<int:notification_id>/', views.mark_notification_read, name='mark_notification_read'),
    path('notifications/mark-all-read/', views.mark_all_notifications_read, name='mark_all_notifications_read'),
]