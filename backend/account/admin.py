from django.contrib import admin
from .models import customUser

class customUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'first_name', 'last_name', 'email','mobile_no')


admin.site.register(customUser,customUserAdmin)
