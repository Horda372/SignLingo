from django.db import models
from django.utils import timezone

class Users(models.Model):
    UserName = models.CharField(max_length=255)
    Password = models.CharField(max_length=255)
    Email = models.CharField(max_length=255)
    IsPremium = models.BooleanField()

    class Meta:
        db_table = "Users"

class LessonProgress(models.Model):
    id = models.AutoField(primary_key=True)
    User = models.ForeignKey('Users', on_delete=models.CASCADE)

    class Meta:
        db_table = "LessonProgress"

class Levels(models.Model):
    id = models.AutoField(primary_key=True)
    Thumbnail = models.CharField(max_length=255)
    Language = models.CharField(max_length=50)
    Stage = models.BigIntegerField()

    class Meta:
        db_table = "Levels"

class Lessons(models.Model):
    id = models.AutoField(primary_key=True)
    Text = models.CharField(max_length=255)
    PhotoLink = models.CharField(max_length=255, null=True, blank=True)
    IsLast = models.BooleanField()
    LevelId = models.ForeignKey('Levels', on_delete=models.CASCADE, db_column='LevelId')
    Questions = models.ManyToManyField('Question', related_name='lessons', blank=True)  # 👈 New field

    class Meta:
        db_table = "Lessons"

class CommunityPost(models.Model):
    Description = models.TextField()
    User = models.ForeignKey('Users', on_delete=models.CASCADE)
    Tag = models.CharField(max_length=100)
    Timestamp = models.DateTimeField(default=timezone.now)
    Likes = models.ManyToManyField('Users', related_name='liked_posts', blank=True)

    class Meta:
        db_table = "CommunityPost"


class PostComment(models.Model):
    Post = models.ForeignKey('CommunityPost', on_delete=models.CASCADE, related_name='comments')
    User = models.ForeignKey('Users', on_delete=models.CASCADE)
    Text = models.TextField()
    Timestamp = models.DateTimeField(default=timezone.now)
    Parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name='replies')
    Likes = models.ManyToManyField('Users', related_name='liked_comments', blank=True)

    class Meta:
        db_table = "PostComment"

class Question(models.Model):
    TEXT = 'text'
    MULTIPLE_CHOICE = 'mcq'

    QUESTION_TYPES = [
        (TEXT, 'Text'),
        (MULTIPLE_CHOICE, 'Multiple Choice'),
    ]

    Text = models.TextField()
    Type = models.CharField(max_length=10, choices=QUESTION_TYPES)
    Answers = models.JSONField()  # can store list of answers or expected format
    VideoLink = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = "Question"
