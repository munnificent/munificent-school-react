from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, MyCoursesViewSet, TeacherCoursesViewSet, LessonViewSet

router = DefaultRouter()
router.register('all', CourseViewSet, basename='course') # для админа
router.register('my', MyCoursesViewSet, basename='my-course') # для студента
router.register('teacher', TeacherCoursesViewSet, basename='teacher-course') # для учителя
router.register('lessons', LessonViewSet, basename='lesson')

urlpatterns = router.urls