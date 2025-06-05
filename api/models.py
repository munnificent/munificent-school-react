# api/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings # Чтобы ссылаться на AUTH_USER_MODEL

class CustomUser(AbstractUser):
    USER_TYPE_CHOICES = [
        ('student', 'Student'),
        ('teacher', 'Teacher'),
        ('admin', 'Admin'),
    ]
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, default='student')
    
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        related_name="customuser_set",
        related_query_name="user",
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name="customuser_set",
        related_query_name="user",
    )

    # Дополнительные поля для профиля можно добавить сюда или в отдельную модель Profile
    # Например:
    # phone_number = models.CharField(max_length=20, blank=True, null=True)
    # school_name = models.CharField(max_length=255, blank=True, null=True)
    # current_class = models.CharField(max_length=10, blank=True, null=True) # Например, "9 класс"

    def __str__(self):
        return self.username

class Subject(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name="Название предмета")
    # slug = models.SlugField(unique=True, blank=True, null=True) # Опционально, для URL

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Предмет"
        verbose_name_plural = "Предметы"

class Course(models.Model):
    name = models.CharField(max_length=200, verbose_name="Название курса")
    subject = models.ForeignKey(Subject, on_delete=models.SET_NULL, null=True, blank=True, related_name='courses', verbose_name="Предмет")
    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        limit_choices_to={'user_type': 'teacher'}, 
        related_name='taught_courses',
        verbose_name="Преподаватель"
    )
    description = models.TextField(blank=True, null=True, verbose_name="Описание курса")
    # image_url = models.URLField(blank=True, null=True) # Опционально

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Курс"
        verbose_name_plural = "Курсы"

class Lesson(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='lessons', verbose_name="Курс")
    title = models.CharField(max_length=200, verbose_name="Название урока")
    lesson_date = models.DateField(verbose_name="Дата урока")
    start_time = models.TimeField(verbose_name="Время начала")
    end_time = models.TimeField(verbose_name="Время окончания")
    conference_link = models.URLField(blank=True, null=True, verbose_name="Ссылка на конференцию")
    recording_link = models.URLField(blank=True, null=True, verbose_name="Ссылка на запись урока")
    homework_details = models.TextField(blank=True, null=True, verbose_name="Детали домашнего задания")
    homework_file_link = models.URLField(blank=True, null=True, verbose_name="Ссылка на файл ДЗ")
    # created_at = models.DateTimeField(auto_now_add=True)
    # updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.course.name} - {self.title}"

    class Meta:
        verbose_name = "Урок"
        verbose_name_plural = "Уроки"
        ordering = ['lesson_date', 'start_time']

class Enrollment(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='enrollments', limit_choices_to={'user_type': 'student'}, verbose_name="Студент")
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrolled_students', verbose_name="Курс")
    enrollment_date = models.DateField(auto_now_add=True, verbose_name="Дата зачисления")
    progress = models.PositiveIntegerField(default=0, verbose_name="Прогресс (%)") # от 0 до 100

    class Meta:
        unique_together = ('student', 'course') # Студент может быть записан на курс только один раз
        verbose_name = "Зачисление на курс"
        verbose_name_plural = "Зачисления на курсы"

    def __str__(self):
        return f"{self.student.username} на курсе {self.course.name}"

# Модель для отслеживания пройденных студентом уроков (опционально, если прогресс сложнее чем просто %)
class StudentLessonProgress(models.Model):
    enrollment = models.ForeignKey(Enrollment, on_delete=models.CASCADE, related_name='lesson_progresses')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    completed_at = models.DateTimeField(auto_now_add=True)
    # status = models.CharField(max_length=20, default='completed') # Например, 'completed', 'viewed_recording'

    class Meta:
        unique_together = ('enrollment', 'lesson')
        verbose_name = "Прогресс урока студента"
        verbose_name_plural = "Прогресс уроков студентов"

    def __str__(self):
        return f"{self.enrollment.student.username} - {self.lesson.title} (пройдено)"