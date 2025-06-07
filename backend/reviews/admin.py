from django.contrib import admin
from .models import Review

# Эта строка отвечает за появление "Reviews" в админке
admin.site.register(Review)