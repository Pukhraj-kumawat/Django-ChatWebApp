import graphene
from graphene_django import DjangoObjectType
from graphene_django import DjangoListField
from .models import Quizzes, Category, Question, Answer


class CategoryType(DjangoObjectType):
    class Meta:
        model = Category
        fields = ("id","name")

class QuizzesType(DjangoObjectType):
    class Meta:
        model = Quizzes
        fields = ("id","title","category","quiz")

class QuestionType(DjangoObjectType):
    class Meta:
        model = Question
        fields = ("id","title","quiz")

class AnswerType(DjangoObjectType):
    class Meta:
        model = Answer
        fields = ("question","answer_text")

class Query(graphene.ObjectType):
    all_questions = graphene.Field(QuestionType, id=graphene.Int())
    # all_questions = graphene.List(QuestionType)
    # all_answers = graphene.List(AnswerType)
    one_question = graphene.Field(QuestionType,id=graphene.Int())
    
    def resolve_one_question(root,info,id):
        return Question.objects.get(pk=id)
    def resolve_all_questions(root, info):
        return Question.objects.all()
    # def resolve_all_answers(root, info):
    #     return Answer.objects.all()

    


schema = graphene.Schema(query=Query)

