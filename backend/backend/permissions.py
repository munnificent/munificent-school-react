# backend/backend/permissions.py

from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    """
    Разрешает доступ только пользователям с ролью 'admin'.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'admin'

class IsTeacher(BasePermission):
    """
    Разрешает доступ только пользователям с ролью 'teacher'.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'teacher'

class IsStudent(BasePermission):
    """
    Разрешает доступ только пользователям с ролью 'student'.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'student'