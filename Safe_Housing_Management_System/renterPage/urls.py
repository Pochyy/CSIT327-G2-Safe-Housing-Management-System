from django.urls import path
from . import views

app_name = 'renter'
urlpatterns = [
    path('', views.renterPage, name='home'),  
    path('property/<int:property_id>/', views.property_details, name='property_details'), 
    path('property/<int:property_id>/comment/', views.add_comment, name='add_comment'),
    path('comment/<int:comment_id>/reply/', views.add_reply, name='add_reply'),
]