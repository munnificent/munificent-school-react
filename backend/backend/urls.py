# backend/backend/urls.py

from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),

    # Эндпоинты для аутентификации по JWT
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Подключаем URL-адреса из ваших приложений
    path('api/users/', include('users.urls')),
    path('api/courses/', include('courses.urls')),
    path('api/blog/', include('blog.urls')),
    path('api/applications/', include('applications.urls')),
    path('api/reviews/', include('reviews.urls')),
]