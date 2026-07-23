from datetime import datetime

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import DailyReportSerializer
from .services import generate_report


class DailyReportAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        date = request.query_params.get("date")
        selected_date = None

        if date:
            try:
                selected_date = datetime.strptime(
                    date,
                    "%Y-%m-%d"
                ).date()
            except ValueError:
                return Response(
                    {
                        "error": "Invalid date format. Use YYYY-MM-DD."
                    },
                    status=400,
                )

        report = generate_report(
            request.user,
            days=1,
            selected_date=selected_date,
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

        date = request.query_params.get("date")
        selected_date = None

        if date:
            try:
                selected_date = datetime.strptime(
                    date,
                    "%Y-%m-%d"
                ).date()
            except ValueError:
                return Response(
                    {
                        "error": "Invalid date format. Use YYYY-MM-DD."
                    },
                    status=400,
                )

        report = generate_report(
            request.user,
            days=7,
            selected_date=selected_date,
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

        date = request.query_params.get("date")
        selected_date = None

        if date:
            try:
                selected_date = datetime.strptime(
                    date,
                    "%Y-%m-%d"
                ).date()
            except ValueError:
                return Response(
                    {
                        "error": "Invalid date format. Use YYYY-MM-DD."
                    },
                    status=400,
                )

        report = generate_report(
            request.user,
            days=30,
            selected_date=selected_date,
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