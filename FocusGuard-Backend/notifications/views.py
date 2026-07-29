from rest_framework import status
from rest_framework.generics import ListAPIView, UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Notification
from .serializers import NotificationSerializer
from .services import generate_notification
from rest_framework.generics import DestroyAPIView
from users.services.response_translation import TranslatedResponseMixin

class NotificationListAPIView(TranslatedResponseMixin, ListAPIView):

    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(
            user=self.request.user
        )


class MarkNotificationReadAPIView(TranslatedResponseMixin, UpdateAPIView):

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


class MarkAllNotificationsReadAPIView(TranslatedResponseMixin, APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        updated_count = Notification.objects.filter(
            user=request.user,
            is_read=False,
        ).update(is_read=True)

        return Response(
            {
                "message": "All notifications marked as read.",
                "updated_count": updated_count,
            },
            status=status.HTTP_200_OK,
        )


class UnreadNotificationCountAPIView(TranslatedResponseMixin, APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        return Response(
            {
                "count": Notification.objects.filter(
                    user=request.user,
                    is_read=False,
                ).count()
            },
            status=status.HTTP_200_OK,
        )


class GenerateNotificationAPIView(TranslatedResponseMixin, APIView):

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
class DeleteNotificationAPIView(TranslatedResponseMixin, DestroyAPIView):

    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):

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

        notification.delete()

        return Response(
            {
                "message": "Notification deleted successfully."
            },
            status=status.HTTP_204_NO_CONTENT,
        )
