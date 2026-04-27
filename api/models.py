from .ai import predict_price
from django.db import models

# Create your models here.
class Agent(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    
class Property(models.Model):
    agent = models.ForeignKey(Agent, on_delete=models.CASCADE)
    rooms = models.IntegerField()
    house_age = models.IntegerField()
    price = models.FloatField(null=True, blank=True)


# This intercepts the saving process to inject the AI prediction
    def save(self, *args, **kwargs):
        if not self.price:  # Only run AI if the price is left blank
            self.price = predict_price(self.house_age, self.rooms)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.rooms}-room house (Agent: {self.agent.name})"