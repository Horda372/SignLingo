from django.http import JsonResponse
from django.core import serializers
from .models import User


def list_users(request):
    authors = User.objects.all()
    data = [serializers.serialize('json', authors)]
    return JsonResponse(data, safe=False)