# migrations/views.py

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Lessons, Users
from catalog.serializers import LessonSerializer

@api_view(['GET', 'POST'])
def lessons_api(request):
    if request.method == 'GET':
        lessons = Lessons.objects.all()
        serializer = LessonSerializer(lessons, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = LessonSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from django.shortcuts import get_object_or_404

@api_view(['GET'])
def get_lesson_by_id(request, lesson_id):
    lesson = get_object_or_404(Lessons, pk=lesson_id)
    serializer = LessonSerializer(lesson)
    return Response(serializer.data)


@api_view(['POST'])
def user_login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({'error': 'Username and password required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = Users.objects.get(UserName=username)
    except Users.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    if user.Password != password:
        return Response({'error': 'Invalid password'}, status=status.HTTP_401_UNAUTHORIZED)

    # Success
    return Response({
        'id': user.id,
        'username': user.UserName,
        'email': user.Email,
        'is_premium': user.IsPremium,
    })