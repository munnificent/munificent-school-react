# api/urls.py
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView # <--- ДОБАВЬТЕ ЭТОТ ИМПОРТ
from .views import (
    CustomTokenObtainPairView, 
    UserProfileView, 
    StudentDashboardDataView
)

urlpatterns = [
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/me/', UserProfileView.as_view(), name='user_profile'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), # Теперь TokenRefreshView должен быть определен
    path('student/dashboard-data/', StudentDashboardDataView.as_view(), name='student_dashboard_data'),
]