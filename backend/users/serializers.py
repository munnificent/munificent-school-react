# backend/users/serializers.py

from rest_framework import serializers
from .models import User
from .models import Profile

# --- ИЗМЕНЕНИЯ НАЧИНАЮТСЯ ЗДЕСЬ ---

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        # Можно оставить все поля или указать нужные, например, photo_url
        fields = ['photo_url', 'public_description', 'public_subjects']

class UserSerializer(serializers.ModelSerializer):
    # 1. Добавляем вложенный сериализатор для профиля
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        # 2. Добавляем 'profile' в список полей для отображения
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'role', 'profile']


# ProfileSerializer и TeacherPublicSerializer остаются без изменений,
# но для ясности приводим их здесь

class TeacherPublicSerializer(serializers.ModelSerializer):
    # Для публичной информации используем другой ProfileSerializer,
    # чтобы не смешивать с полным профилем
    profile = ProfileSerializer(read_only=True) 
    name = serializers.CharField(source='get_full_name')

    class Meta:
        model = User
        fields = ['id', 'name', 'profile']