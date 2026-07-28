from datetime import date
from datetime import timedelta

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from users.views import calculate_user_analytics
from users.models import (
    ActivityLog,
    EmployeeDeactivationRequest,
    User,
)
from notifications.models import Notification

from focus.models import FocusGoal

from .serializers import (
    ChatRequestSerializer,
    ChatResponseSerializer,
)
from .services import (
    ask_chatbot,
    ask_organization_admin_assistant,
)


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


class OrganizationAdminChatbotAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        if request.user.role != "SUB_ADMIN":
            return Response(
                {
                    "error": "Only Organization Admins can use this assistant."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        if not request.user.organization:
            return Response(
                {
                    "error": "No organization is assigned to this user."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = ChatRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        question = serializer.validated_data["message"]
        selected_date = request.data.get(
            "selected_date",
            date.today().isoformat(),
        )

        organization = request.user.organization
        employees = User.objects.filter(
            organization=organization,
            role="USER",
        ).order_by("id")

        employee_context = []

        for employee in employees:
            employee_context.append(
                {
                    "id": employee.id,
                    "username": employee.username,
                    "email": employee.email,
                    "is_active": employee.is_active,
                    "overall_analytics": calculate_user_analytics(
                        employee
                    ),
                    "selected_date_analytics": calculate_user_analytics(
                        employee,
                        selected_date,
                    ),
                }
            )

        start_date = date.today() - timedelta(days=6)

        activity_logs = list(
            ActivityLog.objects.filter(
                user__organization=organization,
                user__role="USER",
                start_time__date__gte=start_date,
            )
            .select_related("user")
            .order_by("-start_time")
            .values(
                "user__username",
                "website_name",
                "website_url",
                "tab_title",
                "category",
                "productivity_type",
                "duration",
                "start_time",
                "end_time",
            )[:200]
        )

        requests = list(
            EmployeeDeactivationRequest.objects.filter(
                organization=organization
            )
            .select_related("employee")
            .order_by("-requested_at")
            .values(
                "id",
                "employee__username",
                "reason",
                "status",
                "requested_at",
                "reviewed_at",
            )[:50]
        )

        notifications = list(
            Notification.objects.filter(
                user=request.user
            )
            .order_by("-created_at")
            .values(
                "id",
                "notification_type",
                "title",
                "message",
                "is_read",
                "created_at",
            )[:50]
        )

        context = {
            "organization": {
                "id": organization.id,
                "name": organization.name,
            },
            "selected_date": selected_date,
            "activity_log_window": {
                "from": start_date.isoformat(),
                "to": date.today().isoformat(),
            },
            "employees": employee_context,
            "activity_logs": activity_logs,
            "requests": requests,
            "notifications": notifications,
        }

        try:
            result = ask_organization_admin_assistant(
                question,
                context,
            )
        except Exception as error:
            return Response(
                {
                    "error": str(error)
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        return Response(
            {
                "response": result["response"],
                "provider": result["provider"],
            },
            status=status.HTTP_200_OK,
        )
