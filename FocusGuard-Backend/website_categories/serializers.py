from rest_framework import serializers

from .models import WebsiteCategory


class WebsiteCategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = WebsiteCategory
        fields = [
            "id",
            "domain",
            "category",
            "productivity_type",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]