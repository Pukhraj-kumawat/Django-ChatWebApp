from django.db import models
# from django.contrib.auth.models import User
from account.models import customUser


class Message(models.Model):
    sender = models.ForeignKey(customUser, related_name='sent_messages', on_delete=models.CASCADE)
    recipient = models.ForeignKey(customUser, related_name='received_messages', on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

class Group(models.Model):
    name = models.CharField(max_length=100)
    members = models.ManyToManyField(customUser, related_name='group_memberships')
    admin = models.ForeignKey(customUser, related_name='admin_groups', on_delete=models.CASCADE)
