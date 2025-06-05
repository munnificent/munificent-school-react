# api/views.py
from django.utils import timezone
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView # Убедитесь, что этот импорт есть, если используете CustomTokenObtainPairView

# Импортируем все необходимые модели
from .models import Lesson, Enrollment, CustomUser, Course, Subject # <--- ДОБАВЬТЕ 'Enrollment' СЮДА (и другие, если нужны)

# Импортируем все необходимые сериализаторы
from .serializers import UserSerializer #, UpcomingLessonSerializer, StudentDashboardDataSerializer # <--- Если используете, убедитесь, что они импортированы и определены

UserModel = get_user_model()

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            try:
                # Предполагается, что USERNAME_FIELD для вашей модели - 'username'
                user = UserModel.objects.get(username=request.data['username'])
                user_data = UserSerializer(user).data
                response.data['user'] = user_data
                response.data['token'] = response.data['access'] # Добавляем access токен как 'token' для фронтенда
            except UserModel.DoesNotExist:
                # Эта ситуация маловероятна, если super().post() вернул 200,
                # так как это означает, что пользователь был аутентифицирован.
                return Response({"detail": "User not found after successful token generation."}, status=400)
        return response

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # request.user здесь уже будет экземпляром вашей UserModel (CustomUser)
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class StudentDashboardDataView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        student_user = request.user 

        if student_user.user_type != 'student':
            return Response({"detail": "Not authorized for student dashboard. Access denied."}, status=403)

        # Теперь Enrollment должен быть известен благодаря импорту выше
        enrolled_courses_ids = Enrollment.objects.filter(student=student_user).values_list('course_id', flat=True)

        upcoming_lessons_query = Lesson.objects.filter(
            course_id__in=enrolled_courses_ids,
            lesson_date__gte=timezone.now().date()
        ).select_related('course', 'course__teacher').order_by('lesson_date', 'start_time')[:3]

        serialized_lessons = []
        for lesson in upcoming_lessons_query:
            teacher = lesson.course.teacher
            teacher_name = ""
            if teacher:
                teacher_name = teacher.get_full_name()
                if not teacher_name.strip():
                    teacher_name = teacher.username
            
            lesson_date_obj = lesson.lesson_date
            today_date = timezone.now().date()
            
            date_str = ""
            if lesson_date_obj == today_date:
                date_str = "Сегодня"
            elif lesson_date_obj == today_date + timezone.timedelta(days=1):
                date_str = "Завтра"
            else:
                date_str = lesson.lesson_date.strftime("%d %B %Y") # Учитывайте локаль для месяцев

            serialized_lessons.append({
                "id": lesson.id,
                "courseName": lesson.course.name if lesson.course else "Название курса не указано",
                "teacherName": teacher_name if teacher else "Преподаватель не назначен",
                "date": date_str,
                "time": lesson.start_time.strftime("%H:%M") if lesson.start_time else "",
                "zoomLink": lesson.conference_link
            })
        
        ent_summary = "Пройди первый тест ЕНТ, чтобы оценить свой уровень!"

        dashboard_data = {
            "upcoming_lessons": serialized_lessons,
            "ent_progress_summary": ent_summary
        }
        
        return Response(dashboard_data)