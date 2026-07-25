from django.urls import path

from .views import (
    DailyReportAPIView,
    WeeklyReportAPIView,
    MonthlyReportAPIView,
    DownloadPDFReportAPIView,
    DownloadCSVReportAPIView,
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

    path(
        "download/pdf/",
        DownloadPDFReportAPIView.as_view(),
        name="download-pdf-report",
    ),

    path(
        "download/csv/",
        DownloadCSVReportAPIView.as_view(),
        name="download-csv-report",
    ),

]