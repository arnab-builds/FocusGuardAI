from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import UserSettings
from .serializers import UserSettingsSerializer


class UserSettingsView(generics.RetrieveUpdateAPIView):

    serializer_class = UserSettingsSerializer

    permission_classes = [IsAuthenticated]

    def get_object(self):
        settings, created = UserSettings.objects.get_or_create(
            user=self.request.user
        )

        return settings
