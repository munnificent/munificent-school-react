# backend/courses/serializers.py

from rest_framework import serializers
from .models import Subject, Course, Lesson, TestQuestion
# импортируем сериализатор пользователя, чтобы вложить информацию о преподавателе
from users.serializers import UserSerializer 

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = '__all__'

class CourseSerializer(serializers.ModelSerializer):
    # Вкладываем сериализатор, чтобы получить имя преподавателя, а не просто ID
    teacher = UserSerializer(read_only=True)
    # Показываем количество студентов, а не весь список
    student_count = serializers.IntegerField(source='students.count', read_only=True)

    class Meta:
        model = Course
        fields = ['id', 'name', 'teacher', 'subject', 'description', 'student_count']

class TestQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestQuestion
        fields = '__all__'