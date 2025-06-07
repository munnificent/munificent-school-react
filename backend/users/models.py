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
    # Добавляем поле role с выбором из ROLE_CHOICES
    # default='student' - чтобы новые пользователи по умолчанию были учениками
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student', verbose_name='Роль')

    # Вы можете добавить сюда другие поля, если они напрямую касаются
    # аутентификации пользователя, например, email_verified = models.BooleanField(...)
    # Но для большинства доп. информации (телефон, фото) мы создадим отдельную модель Profile.

    def __str__(self):
        return self.username

class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    photo_url = models.URLField(max_length=500, blank=True, null=True, verbose_name='URL фото')
    # ... другие поля ...

    # Новые поля для преподавателей
    public_description = models.TextField(blank=True, verbose_name="Описание для лендинга")
    public_subjects = models.CharField(max_length=200, blank=True, verbose_name="Предметы для лендинга (через запятую)")