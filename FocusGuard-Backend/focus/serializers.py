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
    deadline = serializers.DateField(
        required=False,
        allow_null=True,
    )

    def to_internal_value(self, data):
        if hasattr(data, "copy"):
            data = data.copy()
        elif isinstance(data, dict):
            data = dict(data)
        if "deadline" in data:
            val = data.get("deadline")
            if val == "" or (isinstance(val, str) and not val.strip()):
                data["deadline"] = None
        return super().to_internal_value(data)

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