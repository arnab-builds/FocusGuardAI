from rest_framework import serializers
from .models import AdminNotification


class AdminNotificationSerializer(serializers.ModelSerializer):

    class Meta:
        model = AdminNotification

        fields = [
            "id",
            "title",
            "message",
            "notification_type",
            "is_read",
            "created_at",
        ]