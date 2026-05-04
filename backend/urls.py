from django.contrib import admin
from django.urls import path
from api.views import PropertyList, CreateUserView, PropertyDetail
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/properties/', PropertyList.as_view()),
    path('api/properties/<int:pk>/', PropertyDetail.as_view()), 
    
    path('api/register/', CreateUserView.as_view()),
    path('api/login/', TokenObtainPairView.as_view()),
    path('api/token/refresh/', TokenRefreshView.as_view()),
]