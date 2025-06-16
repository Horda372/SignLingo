"""
URL configuration for Project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from catalog.views import lessons_api, get_lesson_by_id, user_login, user_register, check_premium_status, levels_api, \
    get_level_by_id

urlpatterns = [
    path('admin/', admin.site.urls),
    path('catalog/', include('catalog.urls')),
    path('api/lessons/', lessons_api),
    path('api/lessons/<int:lesson_id>/', get_lesson_by_id),
    path('api/login/', user_login),
    path('api/register/', user_register),
    path('api/check-premium/', check_premium_status),
    path('api/levels/', levels_api),
    path('api/levels/<int:level_id>/', get_level_by_id),
    path('api/lessons/<int:lesson_id>/', get_lesson_by_id),


]
