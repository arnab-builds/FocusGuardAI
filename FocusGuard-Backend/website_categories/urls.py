from django.urls import path

from .views import WebsiteCategoryAPIView

urlpatterns = [
    path(
        "check/",
        WebsiteCategoryAPIView.as_view(),
        name="website-category-check",
    ),
]