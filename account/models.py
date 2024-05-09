from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator


class customUser(AbstractUser):    
    email = models.EmailField(null=False,unique=True, 
    validators=[RegexValidator(regex=r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', message='Enter a valid email address.')])
    username = None
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []


