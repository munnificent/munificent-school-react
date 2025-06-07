# backend/users/views.py

from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import User
from .serializers import UserSerializer
from backend.permissions import IsAdmin # Импортируем наши права
from .serializers import TeacherPublicSerializer # Добавить импорт

class UserViewSet(viewsets.ModelViewSet):
    """ViewSet для управления пользователями (только для админов)"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def current_user_view(request):
    """Эндпоинт для получения данных о текущем залогиненном пользователе"""
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

class TeacherPublicViewSet(viewsets.ReadOnlyModelViewSet):
    """Отдает публичную информацию о преподавателях для главной страницы"""
    queryset = User.objects.filter(role='teacher').select_related('profile')
    serializer_class = TeacherPublicSerializer
    permission_classes = [permissions.AllowAny]