from django.db import models
from django.contrib.auth.models import AbstractUser,BaseUserManager
from django.core.validators import RegexValidator


class customUser(AbstractUser):
    mobile_no = models.CharField(
        max_length=10,
        unique=True,
        validators=[RegexValidator(
            regex='^(?!0)\d{10}$',
            message='Mobile number is invalid'
        )]
    )


class message(models.Model):
    message_body = models.TextField(null=False,blank=False)
