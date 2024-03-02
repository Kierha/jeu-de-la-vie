from django.db import models
from django.conf import settings

class Game(models.Model):
    id_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    config_start = models.CharField(max_length=255)
    turn_number = models.IntegerField()
    config_end = models.CharField(max_length=255)
    position_alive = models.JSONField()

class Rule(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    survival_rules = models.CharField(max_length=255, help_text="Règles de survie des cellules, e.g., '2,3'")
    birth_rules = models.CharField(max_length=255, help_text="Règles de naissance des cellules, e.g., '3'")    
