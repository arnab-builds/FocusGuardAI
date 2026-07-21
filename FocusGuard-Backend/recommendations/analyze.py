from rest_framework import serializers


class AnalyzeRecommendationSerializer(serializers.Serializer):
    RANGE_CHOICES = [
        ("today", "Today"),
        ("yesterday", "Yesterday"),
        ("last_week", "Last Week"),
        ("last_month", "Last Month"),
        ("custom", "Custom"),
    ]

    range = serializers.ChoiceField(choices=RANGE_CHOICES)
    start_date = serializers.DateField(required=False)
    end_date = serializers.DateField(required=False)

    def validate(self, data):
        if data["range"] == "custom":
            if "start_date" not in data or "end_date" not in data:
                raise serializers.ValidationError(
                    "start_date and end_date are required for custom range."
                )

        return data