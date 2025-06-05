# api/serializers.py
from rest_framework import serializers
from .models import CustomUser, Lesson, Course # Убедитесь, что модели Lesson и Course импортированы

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'user_type')

class UpcomingLessonSerializer(serializers.ModelSerializer):
    # Поля, которые должны прийти от связанных моделей, можно определить через source
    # или через SerializerMethodField для более сложной логики
    courseName = serializers.CharField(source='course.name', read_only=True)
    teacherName = serializers.SerializerMethodField(read_only=True)
    # lesson_date и start_time будут взяты из модели Lesson, если они там есть
    # conference_link также

    class Meta:
        model = Lesson # Ваша модель Урока
        fields = [
            'id',
            'title', # Если есть поле title в модели Lesson
            'lesson_date',
            'start_time',
            'conference_link', # Убедитесь, что это поле есть в модели Lesson
            'courseName',
            'teacherName'
        ]

    def get_teacherName(self, obj: Lesson): # obj будет экземпляром Lesson
        if obj.course and obj.course.teacher:
            full_name = obj.course.teacher.get_full_name()
            return full_name if full_name.strip() else obj.course.teacher.username
        return "Преподаватель не назначен"

# StudentDashboardDataSerializer - вы можете его определить, если планируете использовать,
# или закомментировать его импорт в views.py, если используете полностью ручную сериализацию
# и не хотите определять этот сериализатор сейчас.
# class StudentDashboardDataSerializer(serializers.Serializer):
#     upcoming_lessons = UpcomingLessonSerializer(many=True)
#     ent_progress_summary = serializers.CharField()