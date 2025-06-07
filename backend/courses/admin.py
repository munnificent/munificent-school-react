from django.contrib import admin
from .models import Subject, Course, Lesson, TestQuestion

admin.site.register(Subject)
admin.site.register(Course)
admin.site.register(Lesson)
admin.site.register(TestQuestion)