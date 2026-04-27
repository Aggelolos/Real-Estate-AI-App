from rest_framework import serializers
from .models import Property

class PropertySerializer(serializers.ModelSerializer):
    agent_name = serializers.ReadOnlyField(source='agent.name')

    class Meta:
        model = Property
        # We just added 'agent' to the very end of this list:
        fields = ['id', 'rooms', 'house_age', 'price', 'agent_name', 'agent']