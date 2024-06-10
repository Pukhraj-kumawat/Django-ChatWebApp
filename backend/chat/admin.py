from django.contrib import admin
from .models import Message,Group


# admin.site.register(Message)

class MessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'recipient', 'content', 'timestamp','is_read')


admin.site.register(Message, MessageAdmin)

admin.site.register(Group)



# # admin.site.register(models.Answer)
# # admin.site.register(models.Question)
# # admin.site.register(models.Quizzes)
# # admin.site.register(models.Category)


# @admin.register(models.Category)

# class CatAdmin(admin.ModelAdmin):
# 	list_display = [
#         'name',
#         ]

# @admin.register(models.Quizzes)

# class QuizAdmin(admin.ModelAdmin):
# 	list_display = [
#         'id', 
#         'title',
#         ]

# class AnswerInlineModel(admin.TabularInline):
#     model = models.Answer
#     fields = [
#         'answer_text', 
#         'is_right'
#         ]

# @admin.register(models.Question)

# class QuestionAdmin(admin.ModelAdmin):
#     fields = [
#         'title',
#         'quiz',
#         ]
#     list_display = [
#         'title', 
#         'quiz',
#         ]
#     inlines = [
#         AnswerInlineModel, 
#         ] 

# @admin.register(models.Answer)

# class AnswerAdmin(admin.ModelAdmin):
#     list_display = [
#         'answer_text', 
#         'is_right', 
#         'question'
#         ]

