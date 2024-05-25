from django.shortcuts import render,redirect
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from .serializers import UserSerializer
from .models import customUser
import jwt,datetime,time
from django.conf import settings
from django.http import JsonResponse,HttpResponse
from rest_framework.exceptions import ValidationError
from rest_framework.exceptions import APIException
from rest_framework import status

class UserNotFoundException(APIException):
    status_code = status.HTTP_404_NOT_FOUND
    default_detail = 'User not found'
    default_code = 'user_not_found'

class PasswordMismatchException(APIException):
    status_code = status.HTTP_401_UNAUTHORIZED
    default_detail = 'Password did not match'
    default_code = 'password_mismatch'


def generate_jwt_token(user_id):
    payload = {
                'id':user_id,
                'exp':datetime.datetime.utcnow() + datetime.timedelta(days=1),
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
            serializer = UserSerializer(data = request.data)                        
            try:                    
                serializer.is_valid(raise_exception=True) 
            except ValidationError as e:
                print(e)
            user = serializer.save()  
            
            jwt_token = generate_jwt_token(user.id)               
            return JsonResponse({'jwt_token': jwt_token})            
        raise AuthenticationFailed('Registration failed')
    

class LoginView(APIView):
    def post(self,request):          
        userInstance = customUser.objects.filter(email = request.data['email']).first()
        if not userInstance:
            raise UserNotFoundException()
        if userInstance and userInstance.check_password(request.data["password"]):                        
            jwt_token = generate_jwt_token(userInstance.id)                
            return HttpResponse(jwt_token)
        raise PasswordMismatchException()
        

class LogoutView(APIView):
    def post(self,request):
        response = Response({'message':'logged out'})
        response.delete_cookie('jwt_token')
        return response
    

class HomeView(APIView):
    def get(self,request):                
        authorization_header = request.headers.get('Authorization')              
        if not authorization_header or not authorization_header.startswith('Bearer '):            
            return Response({'error': 'Token not present'}, status=status.HTTP_401_UNAUTHORIZED)            
        jwt_token = authorization_header.split()[1]      
        payload = verify_jwt_token(jwt_token)        
        if not payload:                                   
            return Response({'error': 'Token expired'}, status=status.HTTP_401_UNAUTHORIZED)            
        return Response(payload)        