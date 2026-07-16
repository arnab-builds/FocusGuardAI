from django.contrib import admin
from .models import Recommendation


@admin.register(Recommendation)
class RecommendationAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "recommendation_type",
        "title",
        "is_read",
        "created_at",
    )

    list_filter = (
        "recommendation_type",
        "is_read",
    )

    search_fields = (
        "user__username",
        "title",
    )

    ordering = ("-created_at",)