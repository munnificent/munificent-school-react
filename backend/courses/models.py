# backend/courses/models.py

from django.db import models
from django.conf import settings # Для ссылки на кастомную модель User

class Subject(models.Model):
    """Модель учебного предмета"""
    name = models.CharField(max_length=100, unique=True, verbose_name='Название предмета')

    class Meta:
        verbose_name = 'Предмет'
        verbose_name_plural = 'Предметы'

    def __str__(self):
        return self.name

class Course(models.Model):
    """Модель курса"""
    name = models.CharField(max_length=200, verbose_name='Название курса')
    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='courses_taught',
        limit_choices_to={'role': 'teacher'},
        verbose_name='Преподаватель'
    )
    students = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='courses_enrolled',
        blank=True,
        limit_choices_to={'role': 'student'},
        verbose_name='Ученики'
    )
    subject = models.ForeignKey(Subject, on_delete=models.SET_NULL, null=True, blank=True, verbose_name='Предмет')
    description = models.TextField(verbose_name='Описание курса', blank=True)
    
    class Meta:
        verbose_name = 'Курс'
        verbose_name_plural = 'Курсы'

    def __str__(self):
        return self.name

class Lesson(models.Model):
    """Модель урока"""
    STATUS_CHOICES = (
        ('пройден', 'Пройден'),
        ('предстоит', 'Предстоит'),
    )
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='lessons', verbose_name='Курс')
    title = models.CharField(max_length=200, verbose_name='Название урока')
    date = models.DateField(verbose_name='Дата проведения')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='предстоит', verbose_name='Статус')
    recording_url = models.URLField(max_length=500, blank=True, null=True, verbose_name='Ссылка на запись')
    homework_url = models.URLField(max_length=500, blank=True, null=True, verbose_name='Ссылка на ДЗ')
    homework_text = models.TextField(blank=True, null=True, verbose_name='Текст ДЗ')

    class Meta:
        verbose_name = 'Урок'
        verbose_name_plural = 'Уроки'
        ordering = ['date']

    def __str__(self):
        return f'{self.course.name} - {self.title}'

class TestQuestion(models.Model):
    """Модель вопроса для теста"""
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='test_questions', verbose_name='Предмет')
    question = models.TextField(verbose_name='Текст вопроса')
    # Для простоты храним опции как JSON. Можно сделать отдельную модель Option.
    options = models.JSONField(verbose_name='Варианты ответов')
    correct_option_index = models.PositiveSmallIntegerField(verbose_name='Индекс правильного ответа')

    class Meta:
        verbose_name = 'Вопрос для теста'
        verbose_name_plural = 'Вопросы для тестов'

    def __str__(self):
        return f'{self.subject.name} - {self.question[:50]}...'