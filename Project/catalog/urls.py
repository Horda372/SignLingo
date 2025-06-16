from django.urls import path
from . import views

urlpatterns = [
    path('user/', views.list_users, name='list_users'),
]