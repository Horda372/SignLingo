from django.db import models

class User(models.Model):
    UserName = models.CharField(max_length=255)
    Password = models.CharField(max_length=255)
    Email = models.CharField(max_length=255)
    IsPremium = models.BooleanField()

    class Meta:
        db_table = "Users"

# class LessonProgress(models.Model):
#     id = models.AutoField(primary_key=True)
#     User = models.ForeignKey('Users', on_delete=models.CASCADE)
#
#     class Meta:
#         db_table = "LessonProgress"
#
# class Levels(models.Model):
#     id = models.AutoField(primary_key=True)
#     Thumbnail = models.CharField(max_length=255)
#     Language = models.CharField(max_length=50)
#     Stage = models.BigIntegerField()
#
#     class Meta:
#         db_table = "Levels"
#
# class Lessons(models.Model):
#     id = models.AutoField(primary_key=True)
#     Text = models.CharField(max_length=255)
#     PhotoLink = models.CharField(max_length=255, null=True, blank=True)
#     IsLast = models.BooleanField()
#     LevelId = models.ForeignKey('Levels', on_delete=models.CASCADE, db_column='LevelId')
#
#     class Meta:
#         db_table = "Lessons"
