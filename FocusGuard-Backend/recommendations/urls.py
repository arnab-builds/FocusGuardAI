from django.urls import path

from .views import (
    RecommendationListAPIView,
    AnalyzeRecommendationAPIView,
)

urlpatterns = [
    path(
        "",
        RecommendationListAPIView.as_view(),
        name="recommendation-list",
    ),

    path(
        "analyze/",
        AnalyzeRecommendationAPIView.as_view(),
        name="analyze-recommendation",
    ),
]