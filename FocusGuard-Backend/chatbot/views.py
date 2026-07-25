from datetime import date

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from users.views import calculate_user_analytics
from users.models import ActivityLog

from focus.models import FocusGoal

from .serializers import (
    ChatRequestSerializer,
    ChatResponseSerializer,
)
from .services import ask_chatbot


class ChatbotAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = ChatRequestSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        question = serializer.validated_data["message"]

        selected_date = request.data.get(
            "selected_date",
            date.today().isoformat(),
        )

        analytics = calculate_user_analytics(
            request.user,
            selected_date,
        )

        activity_logs = list(
            ActivityLog.objects.filter(
                user=request.user,
                start_time__date=selected_date,
            ).values(
                "website_name",
                "website_url",
                "tab_title",
                "category",
                "productivity_type",
                "duration",
                "start_time",
                "end_time",
            )
        )

        goals = []

        for goal in FocusGoal.objects.filter(user=request.user):

            goals.append(
                {
                    "goal": goal.goal_metric,
                    "target": goal.target_value,
                    "priority": goal.priority,
                    "status": goal.status,
                    "progress": goal.progress,
                    "deadline": goal.deadline,
                    "notes": goal.notes,
                    "plan": (
                        goal.plan.plan
                        if hasattr(goal, "plan")
                        else "No plan generated."
                    ),
                }
            )

        response = ask_chatbot(
            question=question,
            analytics={
                **analytics,
                "focus_goals": goals,
            },
            activity_logs=activity_logs,
            selected_date=selected_date,
        )

        return Response(
            ChatResponseSerializer(
                {
                    "response": response,
                }
            ).data,
            status=status.HTTP_200_OK,
        )