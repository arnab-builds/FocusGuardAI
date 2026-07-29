from datetime import timedelta

from django.utils import timezone
from rest_framework import generics
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from users.services.response_translation import TranslatedResponseMixin

from .models import Recommendation
from .serializers import RecommendationSerializer
from .analyze import AnalyzeRecommendationSerializer
from .services import generate_ai_recommendation


class RecommendationListAPIView(TranslatedResponseMixin, generics.ListAPIView):
    serializer_class = RecommendationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Recommendation.objects.filter(
            user=self.request.user
        ).order_by("-created_at")

class AnalyzeRecommendationAPIView(TranslatedResponseMixin, APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = AnalyzeRecommendationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        data = serializer.validated_data
        today = timezone.localdate()

        date_range = data["range"]

        if date_range == "today":
            start_date = today
            end_date = today

        elif date_range == "yesterday":
            start_date = today - timedelta(days=1)
            end_date = start_date

        elif date_range == "last_week":
            start_date = today - timedelta(days=7)
            end_date = today

        elif date_range == "last_month":
            start_date = today - timedelta(days=30)
            end_date = today

        else:
            start_date = data["start_date"]
            end_date = data["end_date"]

        recommendation = generate_ai_recommendation(
         user=user,
         start_date=start_date,
         end_date=end_date,
         language=getattr(user.preferred_language, "language_code", "en-IN"),
        )

        return Response(
            RecommendationSerializer(recommendation).data,
            status=status.HTTP_200_OK,
        )
