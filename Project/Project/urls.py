from django.contrib import admin
from django.urls import path
from catalog.views import (
    lessons_api, get_lesson_by_id,
    user_login, user_register, check_premium_status,
    levels_api, get_level_by_id,
    get_all_questions, create_question,
    get_all_community_posts, create_community_post, add_comment_to_post, toggle_post_like, toggle_comment_like,
    get_lessons_by_level
)

urlpatterns = [
    path('admin/', admin.site.urls),

    # Lessons
    path('api/lessons/', lessons_api, name='lessons'),
    path('api/lessons/<int:lesson_id>/', get_lesson_by_id, name='lesson-detail'),
    path('api/levels/<int:level_id>/lessons/', get_lessons_by_level, name='lessons-by-level'),

    # Levels
    path('api/levels/', levels_api, name='levels'),
    path('api/levels/<int:level_id>/', get_level_by_id, name='level-detail'),

    # User Auth
    path('api/login/', user_login, name='login'),
    path('api/register/', user_register, name='register'),
    path('api/check-premium/', check_premium_status, name='check-premium'),

    # Questions
    path('api/questions/', get_all_questions, name='questions'),
    path('api/questions/create/', create_question, name='create-question'),

    # Community
    path('api/community/posts/', get_all_community_posts, name='community-posts'),
    path('api/community/posts/create/', create_community_post, name='create-post'),
    path('api/community/comments/create/', add_comment_to_post, name='create-comment'),
# Likes
    path('api/community/posts/<int:post_id>/toggle-like/', toggle_post_like, name='toggle-post-like'),
    path('api/community/comments/<int:comment_id>/toggle-like/', toggle_comment_like, name='toggle-comment-like'),

]
