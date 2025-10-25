from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Features (models.Model):
    title=models.CharField(max_length=200, default="Feature Title")
    desc = models.CharField(max_length=200, default="No description provided")


class Project(models.Model):
    # Basic fields
    title = models.CharField(max_length=200)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Status choices
    STATUS_CHOICES = [
        ('idea', 'Idea'),
        ('planning', 'Planning'),
        ('in-progress', 'In Progress'),
        ('completed', 'Completed'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='idea')
    
    # Difficulty choices
    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    ]
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES, default='medium')
    
    # Priority choices
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    
    # URLs
    github_url = models.URLField(blank=True, null=True)
    deployment_url = models.URLField(blank=True, null=True)
    
    # User relationship
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='projects')
    
    def __str__(self):
        return self.title

class TechStack(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tech_items')
    name = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name

