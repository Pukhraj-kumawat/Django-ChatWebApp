from django.urls import path
from .consumers import MyConsumer

websocket_urlpatterns = [
    path('ws/chat/', MyConsumer.as_asgi()),
]
