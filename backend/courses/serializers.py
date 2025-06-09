# backend/courses/serializers.py

from rest_framework import serializers
from .models import Subject, Course, Lesson, TestQuestion
from users.serializers import UserSerializer 

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'

# ИСПРАВЛЯЕМ ЭТОТ СЕРИАЛИЗАТОР
class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        # Явно перечисляем все поля, чтобы гарантировать их наличие в ответе API
        fields = [
            'id', 
            'course', 
            'title', 
            'date', 
            'time', 
            'status', 
            'recording_url', 
            'homework_url', 
            'homework_text'
        ]

class CourseSerializer(serializers.ModelSerializer):
    teacher = UserSerializer(read_only=True)
    student_count = serializers.IntegerField(source='students.count', read_only=True)
    progress = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = ['id', 'name', 'teacher', 'subject', 'description', 'student_count', 'progress']

    def get_progress(self, obj):
        total_lessons = obj.lessons.count()
        if total_lessons == 0:
            return 0
        
        passed_lessons = obj.lessons.filter(status='пройден').count()
        return round((passed_lessons / total_lessons) * 100)

class TestQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestQuestion
        exclude = ('correct_option_index',)

class CourseForLessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'name']

class UpcomingLessonSerializer(serializers.ModelSerializer):
    courseName = serializers.CharField(source='course.name', read_only=True)
    teacherName = serializers.CharField(source='course.teacher.get_full_name', read_only=True)
    zoomLink = serializers.URLField(source='course.zoom_link', read_only=True, default="https://zoom.us/j/123456789")
    
    class Meta:
        model = Lesson
        fields = ['id', 'courseName', 'teacherName', 'date', 'time', 'zoomLink']

