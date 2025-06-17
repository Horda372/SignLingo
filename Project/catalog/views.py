from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Users, Lessons, Levels, Question, CommunityPost, PostComment
from catalog.serializers import (
    LessonSerializer, LevelSerializer, QuestionSerializer,
    CommunityPostSerializer, PostCommentSerializer
)

# ---------- LESSONS ----------
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


@api_view(['GET'])
def get_lesson_by_id(request, lesson_id):
    user_id = request.query_params.get('user_id')
    if not user_id:
        return Response({'error': 'User ID required'}, status=status.HTTP_400_BAD_REQUEST)

    user = get_object_or_404(Users, id=user_id)
    lesson = get_object_or_404(Lessons, pk=lesson_id)

    show_ad = not user.IsPremium and lesson.IsLast
    serializer = LessonSerializer(lesson)
    return Response({**serializer.data, 'show_ad': show_ad})

@api_view(['GET'])
def get_lessons_by_level(request, level_id):
    try:
        level = Levels.objects.get(id=level_id)
    except Levels.DoesNotExist:
        return Response({'error': 'Level not found'}, status=status.HTTP_404_NOT_FOUND)

    lessons = Lessons.objects.filter(LevelId=level)
    serializer = LessonSerializer(lessons, many=True)
    return Response(serializer.data)



# ---------- LEVELS ----------
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


# ---------- AUTH ----------
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

    if Users.objects.filter(UserName=username).exists():
        return Response({'error': 'Username already taken'}, status=status.HTTP_400_BAD_REQUEST)
    if Users.objects.filter(Email=email).exists():
        return Response({'error': 'Email already in use'}, status=status.HTTP_400_BAD_REQUEST)

    user = Users.objects.create(
        UserName=username,
        Password=password,
        Email=email,
        IsPremium=is_premium
    )

    return Response({
        'id': user.id,
        'username': user.UserName,
        'email': user.Email,
        'is_premium': user.IsPremium,
    }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def check_premium_status(request):
    username = request.query_params.get('username')
    user_id = request.query_params.get('id')

    if not username and not user_id:
        return Response({'error': 'Username or ID is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = Users.objects.get(UserName=username) if username else Users.objects.get(id=user_id)
    except Users.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    return Response({
        'id': user.id,
        'username': user.UserName,
        'is_premium': user.IsPremium
    })


# ---------- QUESTIONS ----------
@api_view(['GET'])
def get_all_questions(request):
    questions = Question.objects.all()
    serializer = QuestionSerializer(questions, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def create_question(request):
    serializer = QuestionSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ---------- COMMUNITY POSTS ----------
@api_view(['GET'])
def get_all_community_posts(request):
    posts = CommunityPost.objects.all().order_by('-Timestamp')
    serializer = CommunityPostSerializer(posts, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def create_community_post(request):
    serializer = CommunityPostSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ---------- COMMENTS ----------
@api_view(['POST'])
def add_comment_to_post(request):
    serializer = PostCommentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ---------- LIKES ----------
@api_view(['POST'])
def toggle_post_like(request, post_id):
    user_id = request.data.get('user_id')
    if not user_id:
        return Response({'error': 'User ID required'}, status=status.HTTP_400_BAD_REQUEST)

    post = get_object_or_404(CommunityPost, id=post_id)
    user = get_object_or_404(Users, id=user_id)

    if user in post.Likes.all():
        post.Likes.remove(user)
        liked = False
    else:
        post.Likes.add(user)
        liked = True

    return Response({'liked': liked, 'like_count': post.Likes.count()})


@api_view(['POST'])
def toggle_comment_like(request, comment_id):
    user_id = request.data.get('user_id')
    if not user_id:
        return Response({'error': 'User ID required'}, status=status.HTTP_400_BAD_REQUEST)

    comment = get_object_or_404(PostComment, id=comment_id)
    user = get_object_or_404(Users, id=user_id)

    if user in comment.Likes.all():
        comment.Likes.remove(user)
        liked = False
    else:
        comment.Likes.add(user)
        liked = True

    return Response({'liked': liked, 'like_count': comment.Likes.count()})
