from django.urls import path
from . import views

app_name = 'landlord'

urlpatterns = [
    path('', views.landLordPage, name='home'),  # maps /landlord/ to views.home
    path('add-property/', views.add_property, name='add_property'),
    path('delete-property/<int:property_id>/', views.delete_property, name='delete_property'),  

]