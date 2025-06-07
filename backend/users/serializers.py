# backend/users/serializers.py

from rest_framework import serializers
from .models import User
from .models import Profile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # Включаем только безопасные для отображения поля
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'role']


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['photo_url', 'public_description', 'public_subjects']

class TeacherPublicSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)
    # Формируем полное имя для отображения
    name = serializers.CharField(source='get_full_name')

    class Meta:
        model = User
        fields = ['id', 'name', 'profile']