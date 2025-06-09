from django.utils import timezone
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Course, Lesson, TestQuestion
from .serializers import (
    CourseSerializer, 
    LessonSerializer, 
    TestQuestionSerializer, 
    UpcomingLessonSerializer
)
from backend.permissions import IsAdmin, IsTeacher, IsStudent

class CourseViewSet(viewsets.ModelViewSet):
    """ViewSet для управления курсами (только для админов)"""
    queryset = Course.objects.all().select_related('teacher', 'subject')
    serializer_class = CourseSerializer
    permission_classes = [IsAdmin]
    
    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def lessons(self, request, pk=None):
        course = self.get_object()
        # В реальном приложении здесь нужна проверка прав доступа к урокам
        lessons = course.lessons.all()
        serializer = LessonSerializer(lessons, many=True)
        return Response(serializer.data)

class MyCoursesViewSet(viewsets.ReadOnlyModelViewSet):
    """Показывает курсы, на которые записан студент."""
    serializer_class = CourseSerializer
    permission_classes = [IsStudent]

    def get_queryset(self):
        # Пользователь видит только те курсы, на которые он записан
        return self.request.user.courses_enrolled.all().select_related('teacher', 'subject')

    # ДОБАВЛЕН: Метод для получения уроков конкретного курса
    @action(detail=True, methods=['get'], url_path='lessons')
    def get_lessons_for_course(self, request, pk=None):
        """
        Возвращает список уроков для курса, на который записан студент.
        URL: /api/courses/my/{id}/lessons/
        """
        course = self.get_object() # Получаем объект курса по id
        lessons = course.lessons.all().order_by('date', 'time') # Получаем все связанные уроки
        serializer = LessonSerializer(lessons, many=True)
        return Response(serializer.data)


class TeacherCoursesViewSet(viewsets.ReadOnlyModelViewSet):
    """Показывает курсы, которые ведет преподаватель"""
    serializer_class = CourseSerializer
    permission_classes = [IsTeacher]

    def get_queryset(self):
        return self.request.user.courses_taught.all().select_related('teacher', 'subject')

class UpcomingLessonsViewSet(viewsets.ReadOnlyModelViewSet):
    """Отдает 3 ближайших предстоящих урока для залогиненного студента."""
    serializer_class = UpcomingLessonSerializer
    permission_classes = [IsStudent]

    def get_queryset(self):
        user = self.request.user
        enrolled_courses = user.courses_enrolled.all()
        return Lesson.objects.filter(
            course__in=enrolled_courses,
            date__gte=timezone.now().date()
        ).order_by('date', 'id')[:3]
        
class LessonViewSet(viewsets.ModelViewSet):
    """ViewSet для управления уроками."""
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer

    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'create', 'destroy']:
            return [IsAdmin()]
        return [permissions.IsAuthenticated()]

class TestQuestionViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet для получения вопросов для теста по определенному предмету."""
    serializer_class = TestQuestionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        subject_id = self.request.query_params.get('subject_id')
        if subject_id:
            return TestQuestion.objects.filter(subject_id=subject_id)
        return TestQuestion.objects.none()
