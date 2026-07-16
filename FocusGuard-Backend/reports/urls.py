from django.urls import path

from .views import (
    DailyReportAPIView,
    WeeklyReportAPIView,
    MonthlyReportAPIView,
)


urlpatterns = [

    path(
        "daily/",
        DailyReportAPIView.as_view(),
        name="daily-report",
    ),

    path(
        "weekly/",
        WeeklyReportAPIView.as_view(),
        name="weekly-report",
    ),

    path(
        "monthly/",
        MonthlyReportAPIView.as_view(),
        name="monthly-report",
    ),

]