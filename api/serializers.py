from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Property

#Serializer for user registration
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # This securely hashes the password before saving
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user

#property translator
class PropertySerializer(serializers.ModelSerializer):
    agent_name = serializers.ReadOnlyField(source='agent.username')
    
    class Meta:
        model = Property
        fields = ['id', 'rooms', 'house_age', 'price', 'agent_name', 'agent']
        read_only_fields = ['agent']