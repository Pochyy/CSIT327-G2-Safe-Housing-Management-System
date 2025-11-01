from django.contrib import admin
from django.urls import path, include
from users.views import logout_view  

urlpatterns = [
    path('admin/', admin.site.urls),
    path('dashboard/', include('DashboardPage.urls')),
    path('landlord/', include('landLordPage.urls')),
    path('renter/', include('renterPage.urls')),
    path('', include('users.urls')),  
    path('logout/', logout_view, name='logout'),  
]