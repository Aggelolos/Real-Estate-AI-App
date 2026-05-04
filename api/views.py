from rest_framework import generics
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Property
from .serializers import PropertySerializer, UserSerializer

# 1. Registration Door
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

# 2. Main Dashboard Door (List & Create)
class PropertyList(generics.ListCreateAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated]

    # This automatically intercepts the save and stamps the logged-in user
    def perform_create(self, serializer):
        serializer.save(agent=self.request.user)

# 3. Specific Property Door (Edit & Delete)
class PropertyDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated]