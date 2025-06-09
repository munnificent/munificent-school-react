# backend/users/urls.py

from django.urls import path
from rest_framework.routers import DefaultRouter
# Добавьте change_password_view
from .views import UserViewSet, current_user_view, TeacherPublicViewSet, change_password_view

router = DefaultRouter()
router.register('all', UserViewSet, basename='user') 
router.register('public-teachers', TeacherPublicViewSet, basename='public-teacher')

urlpatterns = [
    path('me/', current_user_view, name='current-user'),
    # Новый маршрут для смены пароля
    path('change-password/', change_password_view, name='change-password'),
] + router.urls
