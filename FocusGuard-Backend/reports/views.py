from datetime import datetime

import csv
from io import BytesIO

from django.http import FileResponse, HttpResponse

from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import (
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import DailyReportSerializer
from .services import generate_report


def get_report_data(request, days):

    date = request.query_params.get("date")
    selected_date = None

    if date:
        try:
            selected_date = datetime.strptime(
                date,
                "%Y-%m-%d",
            ).date()

        except ValueError:
            return None

    return generate_report(
        request.user,
        days=days,
        selected_date=selected_date,
    )


class DailyReportAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        report = get_report_data(
            request,
            days=1,
        )

        if not report:
            return Response(
                {
                    "message": "No analytics found."
                },
                status=404,
            )

        serializer = DailyReportSerializer(report)

        return Response(serializer.data)


class WeeklyReportAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        report = get_report_data(
            request,
            days=7,
        )

        if not report:
            return Response(
                {
                    "message": "No analytics found."
                },
                status=404,
            )

        serializer = DailyReportSerializer(report)

        return Response(serializer.data)


class MonthlyReportAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        report = get_report_data(
            request,
            days=30,
        )

        if not report:
            return Response(
                {
                    "message": "No analytics found."
                },
                status=404,
            )

        serializer = DailyReportSerializer(report)

        return Response(serializer.data)
class DownloadPDFReportAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        report_type = request.query_params.get(
            "type",
            "daily",
        )

        days = {
            "daily": 1,
            "weekly": 7,
            "monthly": 30,
        }.get(report_type, 1)

        report = get_report_data(
            request,
            days,
        )

        if not report:
            return Response(
                {
                    "message": "No analytics found."
                },
                status=404,
            )

        buffer = BytesIO()

        document = SimpleDocTemplate(buffer)

        styles = getSampleStyleSheet()

        elements = []

        elements.append(
            Paragraph(
                "<b>FocusGuard AI Productivity Report</b>",
                styles["Title"],
            )
        )

        elements.append(Spacer(1, 20))

        table_data = [
            ["Metric", "Value"],
            [
                "Productive Time",
                str(report["productive_time"]),
            ],
            [
                "Non Productive Time",
                str(report["non_productive_time"]),
            ],
            [
                "Neutral Time",
                str(report["neutral_time"]),
            ],
            [
                "Idle Time",
                str(report["idle_time"]),
            ],
            [
                "Websites Visited",
                str(report["websites_visited"]),
            ],
            [
                "Tab Switches",
                str(report["tab_switches"]),
            ],
            [
                "Productivity %",
                f'{report["productivity_percentage"]}%',
            ],
        ]

        table = Table(table_data)

        table.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, 0), colors.indigo),
                    ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                    ("GRID", (0, 0), (-1, -1), 1, colors.grey),
                    ("BACKGROUND", (0, 1), (-1, -1), colors.whitesmoke),
                    ("BOTTOMPADDING", (0, 0), (-1, 0), 12),
                ]
            )
        )

        elements.append(table)

        document.build(elements)

        buffer.seek(0)

        return FileResponse(
            buffer,
            as_attachment=True,
            filename=f"{report_type}_report.pdf",
        )


class DownloadCSVReportAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        report_type = request.query_params.get(
            "type",
            "daily",
        )

        days = {
            "daily": 1,
            "weekly": 7,
            "monthly": 30,
        }.get(report_type, 1)

        report = get_report_data(
            request,
            days,
        )

        if not report:
            return Response(
                {
                    "message": "No analytics found."
                },
                status=404,
            )

        response = HttpResponse(
            content_type="text/csv"
        )

        response[
            "Content-Disposition"
        ] = f'attachment; filename="{report_type}_report.csv"'

        writer = csv.writer(response)

        writer.writerow(
            [
                "Metric",
                "Value",
            ]
        )

        writer.writerow(
            [
                "Productive Time",
                report["productive_time"],
            ]
        )

        writer.writerow(
            [
                "Non Productive Time",
                report["non_productive_time"],
            ]
        )

        writer.writerow(
            [
                "Neutral Time",
                report["neutral_time"],
            ]
        )

        writer.writerow(
            [
                "Idle Time",
                report["idle_time"],
            ]
        )

        writer.writerow(
            [
                "Websites Visited",
                report["websites_visited"],
            ]
        )

        writer.writerow(
            [
                "Tab Switches",
                report["tab_switches"],
            ]
        )

        writer.writerow(
            [
                "Productivity %",
                report["productivity_percentage"],
            ]
        )

        return response