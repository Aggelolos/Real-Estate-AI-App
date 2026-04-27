from django.shortcuts import render
from rest_framework import generics
from .models import Property
from .serializers import PropertySerializer

# Create your views here.
class PropertyList(generics.ListCreateAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
