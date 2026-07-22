from rest_framework import serializers
from .models import UserSettings


class UserSettingsSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserSettings
        fields = [
            "productive_threshold",
            "non_productive_threshold",
            "idle_threshold",
            "browser_notifications",
        ]