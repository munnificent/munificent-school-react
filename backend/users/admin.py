# backend/users/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Profile

# Эта часть остается без изменений
class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = 'Профили'
    fk_name = 'user'

# В этот класс мы добавляем один новый метод
class CustomUserAdmin(BaseUserAdmin):
    inlines = (ProfileInline,)
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'role')
    list_filter = ('role', 'is_staff', 'is_superuser', 'groups')
    
    fieldsets = BaseUserAdmin.fieldsets + (
        (None, {'fields': ('role',)}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        (None, {'fields': ('role',)}),
    )

    # ДОБАВЛЕННЫЙ МЕТОД
    def get_inlines(self, request, obj=None):
        """
        Не показывать форму профиля на странице создания пользователя.
        """
        if obj is None:
            return []
        return super().get_inlines(request, obj)

# Регистрация остается без изменений
admin.site.register(User, CustomUserAdmin)