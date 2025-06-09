from django.contrib import admin
from .models import Subject, Course, Lesson, TestQuestion

# Регистрируем Subject и TestQuestion
admin.site.register(Subject)
admin.site.register(TestQuestion)

# Настраиваем отображение для модели Course
@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('name', 'teacher', 'subject', 'zoom_link') # Добавляем zoom_link в список
    list_filter = ('subject', 'teacher')
    search_fields = ('name', 'teacher__username')
    # Позволяет удобно добавлять учеников к курсу
    filter_horizontal = ('students',)

# Настраиваем отображение для модели Lesson
@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'date', 'time', 'status')
    list_filter = ('status', 'course__name', 'date') # Фильтр по названию курса
    search_fields = ('title', 'course__name')
