# migrations/views.py

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Lessons, Users, Levels
from catalog.serializers import LessonSerializer, LevelSerializer


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

@api_view(['POST'])
def user_register(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')
    is_premium = request.data.get('is_premium', False)

    if not username or not password or not email:
        return Response({'error': 'Username, password, and email are required'}, status=status.HTTP_400_BAD_REQUEST)

    # Check if username or email already exists
    if Users.objects.filter(UserName=username).exists():
        return Response({'error': 'Username already taken'}, status=status.HTTP_400_BAD_REQUEST)
    if Users.objects.filter(Email=email).exists():
        return Response({'error': 'Email already in use'}, status=status.HTTP_400_BAD_REQUEST)

    # Create the user
    user = Users.objects.create(
        UserName=username,
        Password=password,  # ⚠️ Optional: Hash this for security
        Email=email,
        IsPremium=is_premium
    )

    return Response({
        'id': user.id,
        'username': user.UserName,
        'email': user.Email,
        'is_premium': user.IsPremium,
    }, status=status.HTTP_201_CREATED)

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Users

@api_view(['GET'])
def check_premium_status(request):
    username = request.query_params.get('username')
    user_id = request.query_params.get('id')

    if not username and not user_id:
        return Response({'error': 'Username or ID is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        if username:
            user = Users.objects.get(UserName=username)
        else:
            user = Users.objects.get(id=user_id)
    except Users.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    return Response({
        'id': user.id,
        'username': user.UserName,
        'is_premium': user.IsPremium
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
def levels_api(request):
    levels = Levels.objects.all()
    serializer = LevelSerializer(levels, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_level_by_id(request, level_id):
    level = get_object_or_404(Levels, pk=level_id)
    serializer = LevelSerializer(level)
    return Response(serializer.data)

@api_view(['GET'])
def get_lesson_by_id(request, lesson_id):
    user_id = request.query_params.get('user_id')
    if not user_id:
        return Response({'error': 'User ID required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = Users.objects.get(id=user_id)
    except Users.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    try:
        lesson = Lessons.objects.get(pk=lesson_id)
    except Lessons.DoesNotExist:
        return Response({'error': 'Lesson not found'}, status=status.HTTP_404_NOT_FOUND)

    show_ad = not user.IsPremium and lesson.IsLast

    from catalog.serializers import LessonSerializer
    serializer = LessonSerializer(lesson)

    return Response({
        **serializer.data,
        'show_ad': show_ad
    })
