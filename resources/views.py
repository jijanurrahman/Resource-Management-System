from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Resource
from .serializers import ResourceSerializer

def check_permission(user, action):
    if action == 'read':
        return user.role in ['admin', 'staff', 'user']
    elif action in ['create', 'update', 'delete']:
        return user.role in ['admin', 'staff']
    return False

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def resources_list(request):
    if request.method == 'GET':
        if not check_permission(request.user, 'read'):
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        resources = Resource.objects.all()
        search = request.GET.get('search', '')
        if search:
            resources = resources.filter(name__icontains=search)
        
        serializer = ResourceSerializer(resources, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        if not check_permission(request.user, 'create'):
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = ResourceSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def resource_detail(request, pk):
    resource = get_object_or_404(Resource, pk=pk)
    
    if request.method == 'GET':
        if not check_permission(request.user, 'read'):
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = ResourceSerializer(resource)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        if not check_permission(request.user, 'update'):
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = ResourceSerializer(resource, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        if not check_permission(request.user, 'delete'):
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        resource.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)