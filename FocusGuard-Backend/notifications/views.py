from rest_framework import status
from rest_framework.generics import ListAPIView, UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Notification
from .serializers import NotificationSerializer
from .services import generate_notification


class NotificationListAPIView(ListAPIView):

    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(
            user=self.request.user
        )


class MarkNotificationReadAPIView(UpdateAPIView):

    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):

        try:
            notification = Notification.objects.get(
                pk=pk,
                user=request.user,
            )

        except Notification.DoesNotExist:
            return Response(
                {
                    "message": "Notification not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        notification.is_read = True
        notification.save(update_fields=["is_read"])

        serializer = NotificationSerializer(notification)

        return Response(serializer.data)


class GenerateNotificationAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        event = request.data.get("event")

        if not event:
            return Response(
                {
                    "message": "Event is required."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        valid_events = [
            choice.value
            for choice in Notification.NotificationType
        ]

        if event not in valid_events:
            return Response(
                {
                    "message": "Invalid notification event."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        notification = generate_notification(
            user=request.user,
            event=event,
        )

        serializer = NotificationSerializer(notification)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
        )