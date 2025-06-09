# backend/courses/urls.py

from rest_framework.routers import DefaultRouter
# Импортируем все необходимые ViewSets из views.py
from .views import (
    CourseViewSet, 
    MyCoursesViewSet, 
    TeacherCoursesViewSet, 
    LessonViewSet, 
    TestQuestionViewSet, 
    UpcomingLessonsViewSet
)

router = DefaultRouter()

router.register('all', CourseViewSet, basename='course')
router.register('my', MyCoursesViewSet, basename='my-course')
router.register('teacher', TeacherCoursesViewSet, basename='teacher-course')
router.register('lessons', LessonViewSet, basename='lesson')
router.register('test-questions', TestQuestionViewSet, basename='test-question')
router.register('upcoming-lessons', UpcomingLessonsViewSet, basename='upcoming-lesson')

urlpatterns = router.urls
