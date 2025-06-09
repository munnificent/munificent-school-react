# backend/users/models.py

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings

class User(AbstractUser):
    """
    Кастомная модель пользователя.
    """
    ROLE_CHOICES = (
        ('student', 'Ученик'),
        ('teacher', 'Преподаватель'),
        ('admin', 'Администратор'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student', verbose_name='Роль')

    def __str__(self):
        return self.username

class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    photo_url = models.URLField(max_length=500, blank=True, null=True, verbose_name='URL фото')
    
    # Поля для публичной информации преподавателя
    public_description = models.TextField(blank=True, verbose_name="Описание для лендинга")
    public_subjects = models.CharField(max_length=200, blank=True, verbose_name="Предметы для лендинга (через запятую)")

    # --- НОВЫЕ ПОЛЯ ДЛЯ ПРОФИЛЯ СТУДЕНТА ---
    phone = models.CharField(max_length=20, blank=True, verbose_name="Телефон")
    school = models.CharField(max_length=200, blank=True, verbose_name="Школа")
    student_class = models.CharField(max_length=50, blank=True, verbose_name="Класс")
    parent_name = models.CharField(max_length=150, blank=True, verbose_name="ФИО родителя")
    parent_phone = models.CharField(max_length=20, blank=True, verbose_name="Телефон родителя")

    def __str__(self):
        return f"Профиль пользователя {self.user.username}"
