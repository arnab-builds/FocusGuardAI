from rest_framework import serializers
from .models import FocusGoal, FocusPlan


class FocusPlanSerializer(serializers.ModelSerializer):

    class Meta:
        model = FocusPlan
        fields = (
            "id",
            "plan",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "created_at",
            "updated_at",
        )


class FocusGoalSerializer(serializers.ModelSerializer):

    plan = FocusPlanSerializer(
        read_only=True,
    )

    class Meta:
        model = FocusGoal
        fields = "__all__"
        read_only_fields = (
            "id",
            "user",
            "status",
            "progress",
            "created_at",
            "updated_at",
        )