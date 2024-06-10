import graphene
from graphene_django import DjangoObjectType
from graphene_django import DjangoListField
from .models import Message,Group
from account.models import customUser
from django.db.models import Q
from account.views import verify_jwt_token
from datetime import datetime, timedelta
from django.core.exceptions import ObjectDoesNotExist



class MessageType(DjangoObjectType):
    chat_user_id = graphene.Int()
    
    class Meta:
        model = Message
        fields = ("id","sender","recipient","content","timestamp","is_read","parent")

    def resolve_chat_user_id(self, info):        
        return info.context.chat_user_id

class GroupType(DjangoObjectType):
    class Meta:
        model = Group
        fields = ("id","name","members","admin")

class customUserType(DjangoObjectType):
    class Meta:
        model = customUser
        fields = ("id","username","mobile_no","first_name","last_name","email","profile_picture")



class Query(graphene.ObjectType):

    user = graphene.Field(customUserType,user_id=graphene.Int())
    def resolve_user(root,info,user_id):
        return customUser.objects.get(id=user_id)        

    all_users = graphene.List(customUserType,your_user_id=graphene.Int())
    def resolve_all_users(root,info,your_user_id):
        return customUser.objects.exclude(Q(is_superuser=True) | Q(id=your_user_id))        
    
    chat_messages = graphene.List(MessageType,chat_user_id=graphene.Int(),your_user_id=graphene.Int())
    def resolve_chat_messages(root,info,chat_user_id,your_user_id):        
        chat_user = customUser.objects.get(id=chat_user_id)
        your_user = customUser.objects.get(id=your_user_id)
        messages = Message.objects.filter(Q(Q(sender=chat_user) & Q(recipient=your_user)) | Q(Q(sender=your_user) & Q(recipient=chat_user))).order_by('timestamp')
        messages.update(is_read=True)
        info.context.chat_user_id = chat_user_id
        return messages
    

class CreateMessageInput(graphene.InputObjectType):
    sender = graphene.Int(required=True)
    recipient = graphene.Int(required=True)
    content = graphene.String(required=True)
    replyToId = graphene.String(required=False)

class CreateMessage(graphene.Mutation):
    message = graphene.Field(MessageType)
    
    class Arguments:
        input = CreateMessageInput(required = True)
    
    def mutate(self,info,input):
        sender = customUser.objects.get(id=int(input.sender))
        recipient = customUser.objects.get(id=int(input.recipient))        
        message = Message(
            sender=sender,
            recipient = recipient,
            content = input.content
        )    
        if input.replyToId:
            parent = Message.objects.get(id=input.replyToId)
            message.parent = parent

        message.save()
        return CreateMessage(message = message)  

      
class UpdateProfileInput(graphene.InputObjectType):
    userId = graphene.ID(required=True)
    firstName = graphene.String(required = True)
    lastName = graphene.String(required = True)
    mobileNo = graphene.String(required=True)
    email = graphene.String(required = True)

class UpdateProfile(graphene.Mutation):
    customUser = graphene.Field(customUserType)

    class Arguments:
        input = UpdateProfileInput(required = True)

    def mutate(self, info, input):
        try:
            user = customUser.objects.get(id=input.userId)
            user.email = input.email
            user.first_name = input.firstName
            user.last_name = input.lastName
            user.mobile_no = input.mobileNo
            user.save()
            return UpdateProfile(customUser=user)
        except ObjectDoesNotExist as e:
            print(f"User with ID {input.userId} does not exist.")
            raise e
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            raise e                


class Mutation(graphene.ObjectType):
    create_message = CreateMessage.Field()    
    update_profile = UpdateProfile.Field()

    
schema = graphene.Schema(query=Query,mutation=Mutation)

