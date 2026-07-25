from django.urls import path

from .views import (
    FocusGoalView,
    FocusGoalDetailView,
    GenerateFocusPlanView,
    FocusPlanView,
)

urlpatterns = [
    path(
        "goals/",
        FocusGoalView.as_view(),
    ),
    path(
        "goals/<int:pk>/",
        FocusGoalDetailView.as_view(),
    ),
    path(
        "goals/<int:pk>/generate-plan/",
        GenerateFocusPlanView.as_view(),
    ),
    path(
        "goals/<int:pk>/plan/",
        FocusPlanView.as_view(),
    ),
]