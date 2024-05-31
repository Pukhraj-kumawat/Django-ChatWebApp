from urllib.parse import parse_qs
from channels.middleware.base import BaseMiddleware
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
import jwt
from django.conf import settings
from .models import CustomUser 


@database_sync_to_async
def get_user_from_jwt(token):
    try:
        payload = jwt.decode(token, settings.MYSECRETKEY, algorithms=['HS256'])
        user = CustomUser.objects.get(id=payload['id'])
        return user
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError, CustomUser.DoesNotExist):
        return AnonymousUser()

class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        query_string = parse_qs(scope['query_string'].decode())
        token = query_string.get('token', [None])[0]
        scope['user'] = await get_user_from_jwt(token)
        return await super().__call__(scope, receive, send)
