from django.db import models
from django.contrib.auth.models import User
from .ai import predict_price 

class Property(models.Model):
    rooms = models.IntegerField()
    house_age = models.IntegerField()
    price = models.FloatField(null=True, blank=True)
    agent = models.ForeignKey(User, on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        # Only run the AI if a price hasn't been calculated yet
        if not self.price:
            try:
                # Call the function from your ai.py file
                
                self.price = predict_price(self.house_age, self.rooms)
            except Exception as e:
                print(f"AI Model failed to calculate: {e}")
        
        # Proceed with the normal database save
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.rooms}-room house (Agent: {self.agent.username})"