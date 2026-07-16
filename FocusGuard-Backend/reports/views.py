from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import DailyReportSerializer
from .services import generate_report


class DailyReportAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        report = generate_report(
            request.user,
            days=1
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

        report = generate_report(
            request.user,
            days=7
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

        report = generate_report(
            request.user,
            days=30
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