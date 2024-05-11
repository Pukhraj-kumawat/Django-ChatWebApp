import graphene
from graphene_django import DjangoObjectType
from graphene_django import DjangoListField
from .models import Message,Group
from account.models import customUser



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


    def resolve_all_messages(root,info):
        return Message.objects.all()
    
    def resolve_one_sender(root,info,id):
        return customUser.objects.get(id=id)
    
    def resolve_one_recipient(root,info,id):
        return customUser.objects.get(id=id)



schema = graphene.Schema(query=Query)

