from rest_framework import serializers
from .models import Recommendation


class RecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recommendation
        fields = [
            "id",
            "recommendation_type",
            "title",
            "message",
            "recommendation_date",
            "is_read",
            "created_at",
        ]
