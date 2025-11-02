from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('dashboard/', include('DashboardPage.urls')),
    path('landlord/', include('landLordPage.urls')),
    path('renter/', include('renterPage.urls')),
    path('', include('users.urls')),  
  
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)