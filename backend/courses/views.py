# backend/courses/views.py

from rest_framework import viewsets, permissions
from .models import Course, Lesson
from .serializers import CourseSerializer, LessonSerializer
from backend.permissions import IsAdmin, IsTeacher, IsStudent

class CourseViewSet(viewsets.ModelViewSet):
    """ViewSet для управления курсами (только для админов)"""
    queryset = Course.objects.all().select_related('teacher', 'subject')
    serializer_class = CourseSerializer
    permission_classes = [IsAdmin]


class MyCoursesViewSet(viewsets.ReadOnlyModelViewSet):
    """Показывает курсы, на которые записан студент"""
    serializer_class = CourseSerializer
    permission_classes = [IsStudent]

    def get_queryset(self):
        return self.request.user.courses_enrolled.all().select_related('teacher', 'subject')

class TeacherCoursesViewSet(viewsets.ReadOnlyModelViewSet):
    """Показывает курсы, которые ведет преподаватель"""
    serializer_class = CourseSerializer
    permission_classes = [IsTeacher]

    def get_queryset(self):
        return self.request.user.courses_taught.all().select_related('teacher', 'subject')

class LessonViewSet(viewsets.ModelViewSet):
    """ViewSet для управления уроками. Полный доступ у админа, частичный у учителя."""
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer

    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'create', 'destroy']:
            return [IsAdmin()]
        # Добавим логику, чтобы учитель мог редактировать свои уроки
        # if self.action in ['update', 'partial_update']:
        #     return [IsTeacher()]
        return [permissions.IsAuthenticated()]