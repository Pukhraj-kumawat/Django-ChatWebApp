import graphene
from graphene_django import DjangoObjectType
from graphene_django import DjangoListField
from .models import Message,Group
from account.models import customUser
from django.db.models import Q
from account.views import verify_jwt_token
from datetime import datetime, timedelta


class MessageType(DjangoObjectType):
    chat_user_id = graphene.Int()
    
    class Meta:
        model = Message
        fields = ("id","sender","recipient","content","timestamp","is_read")

    def resolve_chat_user_id(self, info):        
        return info.context.chat_user_id

class GroupType(DjangoObjectType):
    class Meta:
        model = Group
        fields = ("id","name","members","admin")

class customUserType(DjangoObjectType):
    class Meta:
        model = customUser
        fields = ("id","username","mobile_no","first_name","last_name","email")


class Query(graphene.ObjectType):

    all_users = graphene.List(customUserType,your_user_id=graphene.Int())
    def resolve_all_users(root,info,your_user_id):
        return customUser.objects.exclude(Q(is_superuser=True) | Q(id=your_user_id))        
    
    chat_messages = graphene.List(MessageType,chat_user_id=graphene.Int(),your_user_id=graphene.Int())
    def resolve_chat_messages(root,info,chat_user_id,your_user_id):        
        chat_user = customUser.objects.get(id=chat_user_id)
        your_user = customUser.objects.get(id=your_user_id)
        messages = Message.objects.filter(Q(Q(sender=chat_user) & Q(recipient=your_user)) | Q(Q(sender=your_user) & Q(recipient=chat_user))).order_by('timestamp')
        info.context.chat_user_id = chat_user_id
        return messages
    

class CreateMessageInput(graphene.InputObjectType):
    sender = graphene.Int(required=True)
    recipient = graphene.Int(required=True)
    content = graphene.String(required=True)

class CreateMessage(graphene.Mutation):
    message = graphene.Field(MessageType)
    
    class Arguments:
        input = CreateMessageInput(required=True)
    
    def mutate(self,info,input):
        sender = customUser.objects.get(id=int(input.sender))
        recipient = customUser.objects.get(id=int(input.recipient))
        yesterday_timestamp = datetime.now() - timedelta(days=1)
        message = Message(
            sender=sender,
            recipient = recipient,
            content = input.content,
            timestamp = yesterday_timestamp
        )
        

        message.save()
        return CreateMessage(message=message)        

class Mutation(graphene.ObjectType):
    create_message = CreateMessage.Field()

    
schema = graphene.Schema(query=Query,mutation=Mutation)

