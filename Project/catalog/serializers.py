# migrations/serializers.py

from rest_framework import serializers
from .models import Lessons, Levels


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lessons
        fields = '__all__'


class LevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Levels
        fields = '__all__'