# Generated by Django 5.2.3 on 2025-06-30 04:08

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0001_initial'),
        ('users', '0003_profile_parent_name_profile_parent_phone_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='enrolled_courses',
            field=models.ManyToManyField(blank=True, related_name='enrolled_student_profiles', to='courses.course'),
        ),
        migrations.AddField(
            model_name='user',
            name='avatar',
            field=models.URLField(blank=True, null=True, verbose_name='URL аватара'),
        ),
        migrations.AlterField(
            model_name='profile',
            name='parent_name',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='profile',
            name='parent_phone',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AlterField(
            model_name='profile',
            name='phone',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AlterField(
            model_name='profile',
            name='photo_url',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='profile',
            name='public_description',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='profile',
            name='public_subjects',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='profile',
            name='school',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='profile',
            name='student_class',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='profile',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='profile', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='user',
            name='role',
            field=models.CharField(choices=[('student', 'Ученик'), ('teacher', 'Преподаватель'), ('admin', 'Администратор')], default='student', max_length=10),
        ),
    ]
