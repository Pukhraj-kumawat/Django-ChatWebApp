from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from .serializers import UserSerializer
from .models import customUser
import jwt,datetime
from django.conf import settings
from django.shortcuts import render
from django.http import JsonResponse


def generate_jwt_token(user_id):
    payload = {
                'id':user_id,
                'exp':datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
                'iat':datetime.datetime.utcnow()
            }
    jwt_token = jwt.encode(payload, settings.MYSECRETKEY, algorithm='HS256')
    return jwt_token

def verify_jwt_token(token):
    try:
        payload = jwt.decode(token, settings.MYSECRETKEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


class RegisterView(APIView):
    def post(self,request):
        if(request.data["password"] == request.data["confirm_password"]):
            confirm_password = request.data.pop('confirm_password')
            serializer = UserSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            jwt_token = generate_jwt_token(user.id)    
            response = Response({'message': 'Registration successful and logged in'})
            response.set_cookie('jwt_token', jwt_token, secure=True, httponly=True)
            return response
        raise AuthenticationFailed('Registration failed')
    

class LoginView(APIView):
    def post(self,request):
        # customUserInstance = customUser.objects.get(email = request.data["email"])
        userInstance = customUser.objects.filter(username = request.data['username']).first()
        if not userInstance:
            raise AuthenticationFailed('User not found')
        if userInstance and userInstance.check_password(request.data["password"]):            
            jwt_token = generate_jwt_token(userInstance.id)            
            response =  Response({'message':'logged In'})            
            response.set_cookie('jwt_token',jwt_token,secure=True,httponly=True)            
            return response            
        raise AuthenticationFailed('Password did not matched')


class LogoutView(APIView):
    def post(self,request):
        response = Response({'message':'logged out'})
        response.delete_cookie('jwt_token')
        return response
    

def login(request):
    return render(request,'account/home.html')

def notFound(request):
    return JsonResponse({"status":"not Found"})