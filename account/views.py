from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from .serializers import UserSerializer
from .models import customUser
# Create your views here.

class RegisterView(APIView):
    def post(self,request):
        if(request.data["password"] == request.data["confirm_password"]):
            confirm_password = request.data.pop('confirm_password')
            serializer = UserSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        raise AuthenticationFailed('Registration failed')
    

class LoginView(APIView):
    def post(self,request):
        # customUserInstance = customUser.objects.get(email = request.data["email"])
        customUserInstance = customUser.objects.filter(email = request.data['email']).first()
        if not customUserInstance:
            raise AuthenticationFailed('User not found')
        if customUserInstance and customUserInstance.check_password(request.data["password"]):
            return Response({
                'message':'success'
            })
        raise AuthenticationFailed('Password did not matched')

