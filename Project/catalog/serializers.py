from rest_framework import serializers
from .models import Lessons, Levels, Question, PostComment, CommunityPost


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'


class LessonSerializer(serializers.ModelSerializer):
    Questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Lessons
        fields = '__all__'


class LevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Levels
        fields = '__all__'


class PostCommentSerializer(serializers.ModelSerializer):
    UserName = serializers.CharField(source='User.UserName', read_only=True)
    Replies = serializers.SerializerMethodField()

    class Meta:
        model = PostComment
        fields = ['id', 'Post', 'User', 'UserName', 'Text', 'Timestamp', 'Parent', 'Likes', 'Replies']

    def get_Replies(self, obj):
        replies = obj.replies.all()
        return PostCommentSerializer(replies, many=True).data


class CommunityPostSerializer(serializers.ModelSerializer):
    UserName = serializers.CharField(source='User.UserName', read_only=True)
    Comments = PostCommentSerializer(many=True, source='comments', read_only=True)

    class Meta:
        model = CommunityPost
        fields = ['id', 'Description', 'User', 'UserName', 'Tag', 'Timestamp', 'Likes', 'Comments']
