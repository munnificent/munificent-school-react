# backend/blog/models.py

from django.db import models
from django.conf import settings

class Category(models.Model):
    """Модель категории блога"""
    name = models.CharField(max_length=100, unique=True, verbose_name='Название категории')
    slug = models.SlugField(max_length=100, unique=True, help_text="Используйте только латиницу, цифры, и дефисы")

    class Meta:
        verbose_name = 'Категория блога'
        verbose_name_plural = 'Категории блога'

    def __str__(self):
        return self.name

class Post(models.Model):
    """Модель поста в блоге"""
    title = models.CharField(max_length=255, verbose_name='Заголовок')
    excerpt = models.TextField(verbose_name='Краткое содержание')
    content = models.TextField(verbose_name='Полное содержание')
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        verbose_name='Автор'
    )
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='posts', verbose_name='Категория')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Дата обновления')
    image_url = models.URLField(max_length=500, blank=True, null=True, verbose_name='URL изображения')

    class Meta:
        verbose_name = 'Пост'
        verbose_name_plural = 'Посты'
        ordering = ['-created_at']

    def __str__(self):
        return self.title