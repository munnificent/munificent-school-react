# backend/users/urls.py

from django.urls import path
from rest_framework.routers import DefaultRouter
# Убедитесь, что все нужные ViewSet импортированы
from .views import UserViewSet, current_user_view, TeacherPublicViewSet 

router = DefaultRouter()
# Маршрут для управления пользователями в админке фронтенда
router.register('all', UserViewSet, basename='user') 
# ЭТОТ МАРШРУТ БЫЛ ПРОПУЩЕН: маршрут для отображения учителей на главной
router.register('public-teachers', TeacherPublicViewSet, basename='public-teacher')

urlpatterns = [
    # Маршрут для получения данных текущего залогиненного пользователя
    path('me/', current_user_view, name='current-user'),
] + router.urls