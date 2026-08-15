from datetime import date, datetime
from datetime import timedelta

from django.db.models import Count, Sum
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from users.services.response_translation import TranslatedResponseMixin

from users.views import calculate_user_analytics
from users.models import (
    ActivityLog,
    EmployeeDeactivationRequest,
    User,
    Language,
)
from notifications.models import Notification

from focus.models import FocusGoal

from .serializers import (
    ChatMessageSerializer,
    ChatRequestSerializer,
    ChatResponseSerializer,
)
from .models import ChatMessage
from .services import (
    ask_chatbot,
    ask_organization_admin_assistant,
)


class ChatbotAPIView(TranslatedResponseMixin, APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = ChatRequestSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        question = serializer.validated_data["message"]

        selected_date = request.data.get(
            "selected_date",
            date.today().isoformat(),
        )
        selected_date_value = datetime.strptime(
            selected_date,
            "%Y-%m-%d",
        ).date()

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
            language=getattr(request.user.preferred_language, "language_code", "en-IN"),
        )

        ChatMessage.objects.bulk_create([
            ChatMessage(user=request.user, selected_date=selected_date_value, sender="user", content=question),
            ChatMessage(user=request.user, selected_date=selected_date_value, sender="ai", content=response),
        ])

        return Response(
            ChatResponseSerializer(
                {
                    "response": response,
                }
            ).data,
            status=status.HTTP_200_OK,
        )


class ChatHistoryAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        all_dates = str(
            request.query_params.get("all_dates", "")
        ).lower() in ("1", "true", "yes")

        if all_dates:
            messages = ChatMessage.objects.filter(
                user=request.user,
            ).order_by("-selected_date", "created_at", "id")
            return Response(ChatMessageSerializer(messages, many=True).data)

        selected_date = request.query_params.get(
            "selected_date",
            date.today().isoformat(),
        )
        messages = ChatMessage.objects.filter(
            user=request.user,
            selected_date=selected_date,
        )
        return Response(ChatMessageSerializer(messages, many=True).data)


class ClearChatHistoryAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        selected_date = request.query_params.get(
            "selected_date",
            date.today().isoformat(),
        )
        ChatMessage.objects.filter(
            user=request.user,
            selected_date=selected_date,
        ).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class OrganizationAdminChatbotAPIView(TranslatedResponseMixin, APIView):

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
        requested_language_code = request.data.get(
            "preferred_language_code"
        )
        preferred_language_code = getattr(
            request.user.preferred_language,
            "language_code",
            "en-IN",
        )

        if requested_language_code and Language.objects.filter(
            language_code=requested_language_code,
            is_active=True,
        ).exists():
            preferred_language_code = requested_language_code
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

        analytics_fields = (
            "productive_time",
            "non_productive_time",
            "neutral_time",
            "total_time",
            "productive_percentage",
            "productivity_percentage",
            "total_websites_visited",
            "total_tab_switches",
        )

        for employee in employees:
            # Closed accounts release their Django username for reuse. Use the
            # preserved value in admin-facing AI context, never the internal
            # `closed-<id>-...` placeholder.
            display_username = (
                employee.closed_username or employee.username
            )
            overall_analytics = calculate_user_analytics(employee)
            selected_date_analytics = calculate_user_analytics(
                employee,
                selected_date,
            )
            employee_context.append(
                {
                    "id": employee.id,
                    "username": display_username,
                    "email": employee.email,
                    "is_active": employee.is_active,
                    # Keep every employee in the AI context. The full
                    # analytics object includes large website/category maps
                    # that can otherwise force roster entries to be trimmed.
                    "overall_analytics": {
                        field: overall_analytics.get(field)
                        for field in analytics_fields
                    },
                    "selected_date_analytics": {
                        field: selected_date_analytics.get(field)
                        for field in analytics_fields
                    },
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
                "user_id",
                "user__username",
                "website_name",
                "website_url",
                "tab_title",
                "category",
                "productivity_type",
                "duration",
                "start_time",
                "end_time",
            # The assistant receives recent activity only. Sending hundreds
            # of raw logs can exceed the fallback provider's TPM allowance.
            )[:40]
        )

        # Activity-log values() cannot use the display property above, so
        # replace closed identifiers with their preserved usernames here too.
        usernames_by_id = {
            employee.id: employee.closed_username or employee.username
            for employee in employees
        }
        for activity_log in activity_logs:
            placeholder = activity_log.get("user__username", "")
            if placeholder.startswith("closed-"):
                display_username = usernames_by_id.get(
                    activity_log.get("user_id")
                )
                if display_username:
                    activity_log["user__username"] = usernames_by_id[
                        activity_log["user_id"]
                    ]

        requests = list(
            EmployeeDeactivationRequest.objects.filter(
                organization=organization
            )
            .select_related("employee")
            .order_by("-requested_at")
            .values(
                "id",
                "employee_id",
                "employee__username",
                "reason",
                "status",
                "requested_at",
                "reviewed_at",
            )[:50]
        )

        for deactivation_request in requests:
            placeholder = deactivation_request.get("employee__username", "")
            if placeholder.startswith("closed-"):
                display_username = usernames_by_id.get(
                    deactivation_request.get("employee_id")
                )
                if display_username:
                    deactivation_request["employee__username"] = display_username

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

        website_summary = list(
            ActivityLog.objects.filter(
                user__organization=organization,
                user__role="USER",
                start_time__date__gte=start_date,
            )
            .values("website_name", "website_url", "category")
            .annotate(
                visits=Count("id"),
                total_duration=Sum("duration"),
            )
            .order_by("-visits", "-total_duration", "website_name")[:10]
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
            "website_summary": website_summary,
            "requests": requests,
            "notifications": notifications,
        }

        try:
            result = ask_organization_admin_assistant(
                question,
                context,
                preferred_language_code,
            )
        except Exception as error:
            return Response(
                {
                    "error": str(error)
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        selected_date_value = datetime.strptime(
            selected_date,
            "%Y-%m-%d",
        ).date()
        ChatMessage.objects.bulk_create([
            ChatMessage(
                user=request.user,
                selected_date=selected_date_value,
                sender="user",
                content=question,
            ),
            ChatMessage(
                user=request.user,
                selected_date=selected_date_value,
                sender="ai",
                content=result["response"],
            ),
        ])

        return Response(
            {
                "response": result["response"],
                "provider": result["provider"],
            },
            status=status.HTTP_200_OK,
        )
