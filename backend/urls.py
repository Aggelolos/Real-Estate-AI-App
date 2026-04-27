from django.contrib import admin
from django.urls import path
from api.views import PropertyList

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/properties/', PropertyList.as_view()),
]