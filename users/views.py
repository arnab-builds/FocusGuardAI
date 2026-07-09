import uuid
from collections import defaultdict
from datetime import timedelta

from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone

from rest_framework import generics, status
from rest_framework.permissions import AllowAny, BasePermission, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import ActivityLog, EmployeeDeactivationRequest, Invitation, Organization, OrganizationDeactivationRequest, User, UserInactivity
from .pagination import ActivityPagination
from .serializers import (
    AcceptInvitationSerializer,
    ActivityLogSerializer,
    AdminActivitySerializer,
    EmployeeDeactivationRequestSerializer,
    InvitationSerializer,
    LoginRequestSerializer,
    LoginSerializer,
    OrganizationDeactivationRequestSerializer,
    OrganizationSerializer,
    RegisterSerializer,
    UserInactivitySerializer,
    UserListSerializer,
)


DEFAULT_CATEGORY = "Others"


class IsOrganizationAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == "SUB_ADMIN"
        )


class IsSuperAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == "SUPER_ADMIN"
        )

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.save()

        return Response(
            {
                "message": "User registered successfully.",
                "access": data["access"],
                "refresh": data["refresh"],
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer


class CustomLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]
        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "message": "Login successful.",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                },
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
            status=status.HTTP_200_OK,
        )


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        return Response(
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "organization": user.organization.name if user.organization else None,
            },
            status=status.HTTP_200_OK,
        )


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(
                {"message": "Logout successful."},
                status=status.HTTP_205_RESET_CONTENT,
            )

        except TokenError:
            return Response(
                {"error": "Invalid or expired token."},
                status=status.HTTP_400_BAD_REQUEST,
            )


class OrganizationCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        if request.user.role != "SUPER_ADMIN":
            return Response(
                {
                    "error": "Only Super Admin can create organizations."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = OrganizationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        organization = serializer.save(owner=request.user)

        return Response(
            {
                "message": "Organization created successfully.",
                "organization": OrganizationSerializer(
                    organization
                ).data,
            },
            status=status.HTTP_201_CREATED,
        )

class InvitationCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        if request.user.role not in ["SUPER_ADMIN", "SUB_ADMIN"]:
            return Response(
                {
                    "error": "You are not allowed to send invitations."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = InvitationSerializer(
            data=request.data,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)

        role = serializer.validated_data["role"]

        # SUPER_ADMIN can invite only Organization Admin
        if request.user.role == "SUPER_ADMIN":

            if role != "SUB_ADMIN":
                return Response(
                    {
                        "error": "Super Admin can invite only Organization Admin."
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )

            organization = Organization.objects.get(
                id=request.data.get("organization")
            )

        # Organization Admin can invite only Employees
        else:

            if role != "USER":
                return Response(
                    {
                        "error": "Organization Admin can invite only Employees."
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )

            organization = request.user.organization

        invitation = serializer.save(
            organization=organization,
            invited_by=request.user,
            token=str(uuid.uuid4()),
        )

        accept_url = (
            f"http://localhost:3000/accept-invitation/{invitation.token}"
        )

        send_mail(
            subject="FocusGuard Invitation",
            message=f"""
Hello,

You have been invited to FocusGuard.

Role:
{invitation.role}

Click the link below to accept your invitation:

{accept_url}

Regards,
FocusGuard Team
""",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[invitation.email],
            fail_silently=False,
        )

        return Response(
            {
                "message": "Invitation created successfully.",
                "invitation": InvitationSerializer(invitation).data,
            },
            status=status.HTTP_201_CREATED,
        )
class AcceptInvitationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):

        serializer = AcceptInvitationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        invitation = Invitation.objects.filter(
            token=serializer.validated_data["token"],
            is_accepted=False,
        ).first()

        if not invitation:
            return Response(
                {"error": "Invalid invitation token."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = User.objects.create_user(
            username=serializer.validated_data["username"],
            email=invitation.email,
            password=serializer.validated_data["password"],
            organization=invitation.organization,
            role=invitation.role,
        )

        invitation.is_accepted = True
        invitation.save()

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "message": "Invitation accepted successfully.",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "organization": user.organization.name,
                    "role": user.role,
                },
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
            status=status.HTTP_201_CREATED,
        )


class OrganizationMembersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        if request.user.organization is None:
            return Response(
                {
                    "error": "You are not assigned to any organization."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        users = User.objects.filter(
            organization=request.user.organization
        )

        serializer = UserListSerializer(users, many=True)

        return Response(
            {
                "organization": request.user.organization.name,
                "members": serializer.data,
            },
            status=status.HTTP_200_OK,
        )
CATEGORY_MAP = {
    "chatgpt": "AI Tools",
    "openai": "AI Tools",

    "github": "Development",

    "python": "Documentation",
    "docs": "Documentation",

    "linkedin": "Professional Networking",

    "gmail": "Communication",
    "outlook": "Communication",

    "instagram": "Social Media",
    "facebook": "Social Media",
    "twitter": "Social Media",
    "x.com": "Social Media",
    "twitter": "Social Media",

    "youtube": "Entertainment",

    "leetcode": "Coding Practice",
    "hackerrank": "Coding Practice",

    "stackoverflow": "Development",

    "geeksforgeeks": "Learning",

    "w3schools": "Learning",
}
PRODUCTIVE_CATEGORIES = [
    "Development",
    "Documentation",
    "Learning",
    "Professional Networking",
    "AI Tools",
    "Coding Practice",
]

class ActivityStartView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = ActivityLogSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Check if an activity is already running
        active_activity = ActivityLog.objects.filter(
            user=request.user,
            is_active=True,
        ).order_by("-start_time").first()

        # Stop previous activity
        if active_activity:
            active_activity.end_time = timezone.now()
            active_activity.duration = (
                active_activity.end_time -
                active_activity.start_time
            )
            active_activity.is_active = False
            active_activity.save()

        # Start new activity
        website_name = serializer.validated_data["website_name"]
        website_url = serializer.validated_data.get("website_url", "")

        search_text = f"{website_name} {website_url}".lower()

        category = DEFAULT_CATEGORY

        for keyword, value in CATEGORY_MAP.items():
            if keyword in search_text:
                category = value
                break

        activity = ActivityLog.objects.create(
            user=request.user,
            website_name=website_name,
            website_url=website_url,
            category=category,
            tab_title=serializer.validated_data.get("tab_title"),
            start_time=timezone.now(),
            is_active=True,
        )

        return Response(
            {
                "message": "Activity started successfully.",
                "activity": ActivityLogSerializer(activity).data,
            },
            status=status.HTTP_201_CREATED,
        )


class ActivityHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        activities = ActivityLog.objects.filter(
            user=request.user
        ).order_by("-start_time")

        paginator = ActivityPagination()

        page = paginator.paginate_queryset(
            activities,
            request
        )

        serializer = ActivityLogSerializer(
            page,
            many=True
        )

        return paginator.get_paginated_response(
            serializer.data
        )


from collections import defaultdict

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class OrganizationActivityView(APIView):
    permission_classes = [IsAuthenticated, IsOrganizationAdmin]

    def get(self, request):

        organization = request.user.organization

        users = User.objects.filter(
            organization=organization
        ).order_by("id")

        grouped_users = []

        for user in users:

            activities = ActivityLog.objects.filter(
                user=user
            ).order_by("-start_time")

            serializer = ActivityLogSerializer(
                activities,
                many=True
            )

            grouped_users.append({
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role,
                "total_activities": activities.count(),
                "activities": serializer.data
            })

        return Response({
            "organization": {
                "id": organization.id,
                "name": organization.name,
            },
            "total_users": users.count(),
            "users": grouped_users
        })
class AdminActivityView(APIView):
    permission_classes = [IsAuthenticated, IsSuperAdmin]

    def get(self, request):

        organizations = Organization.objects.all().order_by("id")

        organization_data = []

        for organization in organizations:

            users = User.objects.filter(
                organization=organization
            ).order_by("id")

            user_data = []

            for user in users:

                activities = ActivityLog.objects.filter(
                    user=user
                ).order_by("-start_time")

                serializer = ActivityLogSerializer(
                    activities,
                    many=True
                )

                user_data.append({
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "role": user.role,
                    "total_activities": activities.count(),
                    "activities": serializer.data
                })

            organization_data.append({
                "id": organization.id,
                "name": organization.name,
                "total_users": users.count(),
                "users": user_data
            })

        return Response({
            "total_organizations": organizations.count(),
            "organizations": organization_data
        })


def calculate_user_analytics(user):

    activities = ActivityLog.objects.filter(
        user=user
    ).order_by("start_time")

    productive_time = timedelta()
    non_productive_time = timedelta()

    category_summary = defaultdict(timedelta)
    website_summary = defaultdict(timedelta)
    website_visits = defaultdict(int)
    website_urls = {}

    websites = set()

    tab_switches = max(activities.count() - 1, 0)

    for activity in activities:

        website = activity.website_name or "Unknown"
        url = activity.website_url or ""
        category = activity.category or DEFAULT_CATEGORY

        # Calculate duration
        if activity.duration:
            duration = activity.duration
        elif activity.is_active:
            duration = timezone.now() - activity.start_time
        else:
            continue

        websites.add(url or website)

        website_visits[website] += 1

        if website not in website_urls:
            website_urls[website] = url

        category_summary[category] += duration

        website_summary[website] += duration

        if category in PRODUCTIVE_CATEGORIES:
            productive_time += duration
        else:
            non_productive_time += duration

    website_report = {}

    for website in website_summary:
        website_report[website] = {
            "url": website_urls.get(website, ""),
            "time_spent": str(website_summary[website]),
            "visits": website_visits[website],
        }

    return {
        "productive_time": str(productive_time),
        "non_productive_time": str(non_productive_time),
        "total_websites_visited": len(websites),
        "total_tab_switches": tab_switches,
        "category_summary": {
            key: str(value)
            for key, value in category_summary.items()
        },
        "website_summary": website_report,
    }
class UserAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        analytics = calculate_user_analytics(request.user)

        return Response(
            analytics,
            status=status.HTTP_200_OK
        )
class OrganizationAnalyticsView(APIView):
    permission_classes = [IsAuthenticated, IsOrganizationAdmin]

    def get(self, request):

        organization = request.user.organization

        users = User.objects.filter(
            organization=organization
        ).order_by("id")

        grouped_users = []

        for user in users:

            analytics = calculate_user_analytics(user)

            grouped_users.append({
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role,
                "analytics": analytics
            })

        return Response({
            "organization": {
                "id": organization.id,
                "name": organization.name,
            },
            "total_users": users.count(),
            "users": grouped_users
        })


class InactivityStartView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        active_inactivity = UserInactivity.objects.filter(
            user=request.user,
            is_active=True
        ).first()

        if active_inactivity:
            return Response(
                {
                    "message": "User is already marked as inactive."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        inactivity = UserInactivity.objects.create(
    user=request.user,
    website_name=request.data.get("website_name", ""),
    website_url=request.data.get("website_url", ""),
    tab_title=request.data.get("tab_title", ""),
    inactive_from=timezone.now(),
    is_active=True,
)

        return Response(
            {
                "message": "User marked as inactive.",
                "data": UserInactivitySerializer(inactivity).data,
            },
            status=status.HTTP_201_CREATED,
        )
class SuperAdminAnalyticsView(APIView):
    permission_classes = [IsAuthenticated, IsSuperAdmin]

    def get(self, request):

        organizations = Organization.objects.all().order_by("id")

        organization_data = []

        for organization in organizations:

            users = User.objects.filter(
                organization=organization
            ).order_by("id")

            user_data = []

            for user in users:

                analytics = calculate_user_analytics(user)

                user_data.append({
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "role": user.role,
                    "analytics": analytics
                })

            organization_data.append({
                "id": organization.id,
                "name": organization.name,
                "total_users": users.count(),
                "users": user_data
            })

        return Response({
            "total_organizations": organizations.count(),
            "organizations": organization_data
        })


class InactivityStopView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        inactivity = UserInactivity.objects.filter(
            user=request.user,
            is_active=True
        ).order_by("-inactive_from").first()

        if not inactivity:
            return Response(
                {
                    "message": "No active inactivity record found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        inactivity.active_again_at = timezone.now()

        inactivity.duration = (
            inactivity.active_again_at -
            inactivity.inactive_from
        )

        inactivity.is_active = False

        inactivity.save()

        return Response(
            {
                "message": "User is active again.",
                "data": UserInactivitySerializer(inactivity).data,
            },
            status=status.HTTP_200_OK,
        )
class EmployeeDeactivationRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        # Only employees can send deactivation requests
        if request.user.role != "USER":
            return Response(
                {
                    "error": "Only employees can send deactivation requests."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # Check if a pending request already exists
        if EmployeeDeactivationRequest.objects.filter(
            employee=request.user,
            status="PENDING"
        ).exists():

            return Response(
                {
                    "error": "You already have a pending deactivation request."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = EmployeeDeactivationRequestSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        deactivation_request = EmployeeDeactivationRequest.objects.create(
            employee=request.user,
            organization=request.user.organization,
            reason=serializer.validated_data["reason"]
        )

        return Response(
            {
                "message": "Deactivation request submitted successfully.",
                "request": EmployeeDeactivationRequestSerializer(
                    deactivation_request
                ).data,
            },
            status=status.HTTP_201_CREATED,
        )
class EmployeeDeactivationRequestListView(APIView):
    permission_classes = [IsAuthenticated, IsOrganizationAdmin]

    def get(self, request):

        requests = EmployeeDeactivationRequest.objects.filter(
            organization=request.user.organization
        ).order_by("-requested_at")

        serializer = EmployeeDeactivationRequestSerializer(
            requests,
            many=True
        )

        return Response({
            "count": requests.count(),
            "results": serializer.data
        })
class ApproveEmployeeDeactivationRequestView(APIView):
    permission_classes = [IsAuthenticated, IsOrganizationAdmin]

    def post(self, request, request_id):

        try:
            deactivation_request = EmployeeDeactivationRequest.objects.get(
                id=request_id,
                organization=request.user.organization
            )

        except EmployeeDeactivationRequest.DoesNotExist:

            return Response(
                {
                    "error": "Request not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        if deactivation_request.status != "PENDING":

            return Response(
                {
                    "error": "This request has already been processed."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        deactivation_request.status = "APPROVED"
        deactivation_request.reviewed_by = request.user
        deactivation_request.reviewed_at = timezone.now()
        deactivation_request.save()

        employee = deactivation_request.employee
        employee.is_active = False
        employee.save()

        return Response({
            "message": "Employee deactivated successfully."
        })
class RejectEmployeeDeactivationRequestView(APIView):
    permission_classes = [IsAuthenticated, IsOrganizationAdmin]

    def post(self, request, request_id):

        try:
            deactivation_request = EmployeeDeactivationRequest.objects.get(
                id=request_id,
                organization=request.user.organization
            )

        except EmployeeDeactivationRequest.DoesNotExist:

            return Response(
                {
                    "error": "Request not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        if deactivation_request.status != "PENDING":

            return Response(
                {
                    "error": "This request has already been processed."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        deactivation_request.status = "REJECTED"
        deactivation_request.reviewed_by = request.user
        deactivation_request.reviewed_at = timezone.now()
        deactivation_request.save()

        return Response({
            "message": "Request rejected successfully."
        })
    
class OrganizationDeactivationRequestView(APIView):
    permission_classes = [IsAuthenticated, IsOrganizationAdmin]

    def post(self, request):

        if OrganizationDeactivationRequest.objects.filter(
            organization=request.user.organization,
            status="PENDING"
        ).exists():

            return Response(
                {
                    "error": "A deactivation request is already pending."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = OrganizationDeactivationRequestSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        organization_request = OrganizationDeactivationRequest.objects.create(
            organization=request.user.organization,
            requested_by=request.user,
            reason=serializer.validated_data["reason"]
        )

        return Response(
            {
                "message": "Organization deactivation request submitted successfully.",
                "request": OrganizationDeactivationRequestSerializer(
                    organization_request
                ).data
            },
            status=status.HTTP_201_CREATED
        )
class OrganizationDeactivationRequestListView(APIView):
    permission_classes = [IsAuthenticated, IsSuperAdmin]

    def get(self, request):

        requests = OrganizationDeactivationRequest.objects.all().order_by(
            "-requested_at"
        )

        serializer = OrganizationDeactivationRequestSerializer(
            requests,
            many=True
        )

        return Response({
            "count": requests.count(),
            "results": serializer.data
        })
class ApproveOrganizationDeactivationRequestView(APIView):
    permission_classes = [IsAuthenticated, IsSuperAdmin]

    def post(self, request, request_id):

        try:
            organization_request = OrganizationDeactivationRequest.objects.get(
                id=request_id
            )

        except OrganizationDeactivationRequest.DoesNotExist:

            return Response(
                {
                    "error": "Request not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        if organization_request.status != "PENDING":

            return Response(
                {
                    "error": "This request has already been processed."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        organization_request.status = "APPROVED"
        organization_request.reviewed_by = request.user
        organization_request.reviewed_at = timezone.now()
        organization_request.save()

        organization = organization_request.organization

        # Deactivate the organization
        organization.is_active = False
        organization.save()

        # Deactivate all users in the organization
        users_deactivated = User.objects.filter(
            organization=organization
        ).update(is_active=False)

        return Response({
            "message": "Organization deactivated successfully.",
            "organization": organization.name,
            "users_deactivated": users_deactivated
        })
class RejectOrganizationDeactivationRequestView(APIView):
    permission_classes = [IsAuthenticated, IsSuperAdmin]

    def post(self, request, request_id):

        try:
            organization_request = OrganizationDeactivationRequest.objects.get(
                id=request_id
            )

        except OrganizationDeactivationRequest.DoesNotExist:

            return Response(
                {
                    "error": "Request not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        if organization_request.status != "PENDING":

            return Response(
                {
                    "error": "This request has already been processed."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        organization_request.status = "REJECTED"
        organization_request.reviewed_by = request.user
        organization_request.reviewed_at = timezone.now()
        organization_request.save()

        return Response({
            "message": "Organization deactivation request rejected successfully."
        })
    