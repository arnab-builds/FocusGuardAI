from rest_framework import status
from rest_framework.generics import ListAPIView, UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Notification
from .serializers import NotificationSerializer


class NotificationListAPIView(ListAPIView):

    serializer_class = NotificationSerializer

    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        return Notification.objects.filter(
            user=self.request.user
        ).order_by("-created_at")


class MarkNotificationReadAPIView(UpdateAPIView):

    serializer_class = NotificationSerializer

    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):

        try:

            notification = Notification.objects.get(
                pk=pk,
                user=request.user
            )

        except Notification.DoesNotExist:

            return Response(

                {
                    "message": "Notification not found."
                },

                status=status.HTTP_404_NOT_FOUND,

            )

        notification.is_read = True

        notification.save()

        serializer = NotificationSerializer(notification)

        return Response(serializer.data)