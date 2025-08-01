# Generated by Django 5.2.2 on 2025-06-07 15:44

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Review',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('author', models.CharField(max_length=100, verbose_name='Автор отзыва (имя, класс)')),
                ('text', models.TextField(verbose_name='Текст отзыва')),
                ('score_info', models.CharField(max_length=255, verbose_name='Информация о баллах/оценках')),
                ('is_published', models.BooleanField(default=True, verbose_name='Опубликован')),
            ],
            options={
                'verbose_name': 'Отзыв',
                'verbose_name_plural': 'Отзывы',
                'ordering': ['-id'],
            },
        ),
    ]
