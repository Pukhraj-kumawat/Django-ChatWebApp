from rest_framework import serializers
from .models import customUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = customUser
        fields = ['id','first_name','last_name','username','mobile_no','password','email']
        extra_kwargs = {
            'password':{
                'write_only':True
            }
        }

    def create(self,validate_data):
        password = validate_data.pop('password',None)
        instance = self.Meta.model(**validate_data)
        if instance:
            instance.set_password(password)
            instance.save()
        return instance