from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Recommendation
from .serializers import RecommendationSerializer


class RecommendationListAPIView(generics.ListAPIView):
    serializer_class = RecommendationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Recommendation.objects.filter(
            user=self.request.user
        ).order_by("-created_at")