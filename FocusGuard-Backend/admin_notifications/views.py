from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import BasePermission, IsAuthenticated

from .models import AdminNotification
from .serializers import AdminNotificationSerializer


class IsSuperAdmin(BasePermission):

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "SUPER_ADMIN"
        )


class AdminNotificationListView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsSuperAdmin,
    ]

    def get(self, request):

        notifications = AdminNotification.objects.filter(
            user=request.user
        )

        serializer = AdminNotificationSerializer(
            notifications,
            many=True,
        )

        return Response({
            "unread_count": notifications.filter(
                is_read=False
            ).count(),
            "notifications": serializer.data,
        })


class UnreadNotificationCountView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsSuperAdmin,
    ]

    def get(self, request):

        count = AdminNotification.objects.filter(
            user=request.user,
            is_read=False,
        ).count()

        return Response({
            "count": count
        })


class MarkNotificationReadView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsSuperAdmin,
    ]

    def post(self, request, pk):

        notification = get_object_or_404(
            AdminNotification,
            id=pk,
            user=request.user,
        )

        notification.is_read = True
        notification.save()

        return Response({
            "message": "Notification marked as read."
        })


class MarkAllNotificationsReadView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsSuperAdmin,
    ]

    def post(self, request):

        AdminNotification.objects.filter(
            user=request.user,
            is_read=False,
        ).update(
            is_read=True
        )

        return Response({
            "message": "All notifications marked as read."
        })