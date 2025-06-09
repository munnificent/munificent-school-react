# backend/users/serializers.py

from rest_framework import serializers
from .models import User, Profile

# --- НОВЫЙ СЕРИАЛИЗАТОР ДЛЯ СМЕНЫ ПАРОЛЯ ---
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True)
    new_password_confirm = serializers.CharField(required=True, write_only=True)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Старый пароль неверный.")
        return value

    def validate(self, data):
        if data['new_password'] != data['new_password_confirm']:
            raise serializers.ValidationError({"new_password_confirm": "Пароли не совпадают."})
        # Здесь можно добавить другие проверки для нового пароля (например, сложность)
        return data

# --- СУЩЕСТВУЮЩИЕ СЕРИАЛИЗАТОРЫ (без изменений) ---

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = [
            'photo_url', 
            'public_description', 
            'public_subjects',
            'phone',
            'school',
            'student_class',
            'parent_name',
            'parent_phone'
        ]

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'role', 'profile']

class TeacherPublicSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True) 
    name = serializers.CharField(source='get_full_name')
    class Meta:
        model = User
        fields = ['id', 'name', 'profile']
