import graphene
from graphene_django import DjangoObjectType
from graphene_django import DjangoListField
from .models import Message,Group
from account.models import customUser
from django.db.models import Q
from account.views import verify_jwt_token


class MessageType(DjangoObjectType):
    class Meta:
        model = Message
        fields = ("id","sender","recipient","content","timestamp","is_read")

class GroupType(DjangoObjectType):
    class Meta:
        model = Group
        fields = ("id","name","members","admin")

class customUserType(DjangoObjectType):
    class Meta:
        model = customUser
        fields = ("id","username","mobile_no")


class Query(graphene.ObjectType):
    all_messages = graphene.List(MessageType)
    one_sender = graphene.Field(customUserType,id=graphene.Int())
    one_recipient = graphene.Field(customUserType,id=graphene.Int())
    chat_messages = graphene.List(MessageType,chat_user_id=graphene.Int(),your_user_id=graphene.Int())
    
    def resolve_all_messages(root,info):
        return Message.objects.all()
    
    def resolve_one_sender(root,info,id):
        return customUser.objects.get(id=id)
    
    def resolve_one_recipient(root,info,id):
        return customUser.objects.get(id=id)
    
    def resolve_chat_messages(root,info,chat_user_id,your_user_id):
        cookies = info.context.COOKIES
        print(info.context.headers)
        jwt_token = cookies.get('jwt_token')
        print(jwt_token)
        chat_user = customUser.objects.get(id=chat_user_id)
        your_user = customUser.objects.get(id=your_user_id)
        return Message.objects.filter(Q(Q(sender=chat_user) & Q(recipient=your_user)) | Q(Q(sender=your_user) & Q(recipient=chat_user)) )


schema = graphene.Schema(query=Query)

