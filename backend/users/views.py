# backend/users/views.py

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import User
from .serializers import UserSerializer, TeacherPublicSerializer, ProfileSerializer, ChangePasswordSerializer # Добавлен ChangePasswordSerializer
from backend.permissions import IsAdmin

# ... (current_user_view без изменений) ...
@api_view(['GET', 'PATCH'])
@permission_classes([permissions.IsAuthenticated])
def current_user_view(request):
    if request.method == 'GET':
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    elif request.method == 'PATCH':
        user = request.user
        user_serializer = UserSerializer(user, data=request.data, partial=True)
        if user_serializer.is_valid():
            user_serializer.save()
            if 'profile' in request.data:
                profile_data = request.data.get('profile', {})
                profile_serializer = ProfileSerializer(user.profile, data=profile_data, partial=True)
                if profile_serializer.is_valid():
                    profile_serializer.save()
                else:
                    return Response(profile_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            return Response(UserSerializer(user).data)
        return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# --- НОВЫЙ VIEW ДЛЯ СМЕНЫ ПАРОЛЯ ---
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def change_password_view(request):
    serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save()
        return Response({"status": "password set"}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ... (остальные ViewSet'ы без изменений) ...
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]

class TeacherPublicViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.filter(role='teacher').select_related('profile')
    serializer_class = TeacherPublicSerializer
    permission_classes = [permissions.AllowAny]
