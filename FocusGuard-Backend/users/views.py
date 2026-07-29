import uuid
from collections import defaultdict
from datetime import timedelta
from datetime import datetime
from django.conf import settings
from django.core.mail import send_mail
from django.utils import duration, timezone
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, BasePermission, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework_simplejwt.views import TokenObtainPairView
from admin_notifications.utils import create_admin_notification
from notifications.services import create_user_notification
from users.services.response_translation import TranslatedResponseMixin
from users.services.translation_service import (
    get_user_language,
    translate_text,
)

from .models import ActivityLog, EmployeeDeactivationRequest, Invitation, Language, Organization, OrganizationDeactivationRequest, Translation, User, UserAnalytics, UserInactivity
from .pagination import ActivityPagination
from .serializers import (
    RegisterWithInviteCodeSerializer,
    ActivityLogSerializer,
    AdminActivitySerializer,
    EmployeeDeactivationRequestSerializer,
    InvitationSerializer,
    LanguageSerializer,
    LoginRequestSerializer,
    LoginSerializer,
    OrganizationDeactivationRequestSerializer,
    OrganizationSerializer,
    RegisterSerializer,
    UserInactivitySerializer,
    UserListSerializer,
)
from .serializers import RegisterWithInviteCodeSerializer

DEFAULT_CATEGORY = "Others"


def get_default_language():
    return (
        Language.objects.filter(
            language_code="en",
            is_active=True,
        ).first()
        or Language.objects.filter(
            is_active=True
        ).order_by("language_name").first()
    )


def serialize_user_language(user):
    language = user.preferred_language or get_default_language()

    if not language:
        return None

    return LanguageSerializer(language).data


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

class RegisterView(TranslatedResponseMixin, generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.save()
        self.translation_user = data["user"]

        return Response(
            {
                "message": "User registered successfully.",
                "user": {
                    "id": data["user"].id,
                    "username": data["user"].username,
                    "email": data["user"].email,
                    "role": data["user"].role,
                    "preferred_language": serialize_user_language(
                        data["user"]
                    ),
                },
                "access": data["access"],
                "refresh": data["refresh"],
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer


class CustomLoginView(TranslatedResponseMixin, APIView):
    permission_classes = [AllowAny]

    def post(self, request):

        serializer = LoginRequestSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        user = serializer.validated_data["user"]
        self.translation_user = user

        # User account deactivated
        if not user.is_active:
            return Response(
                {
                    "error": "Your account has been deactivated."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        # Organization deactivated
        if (
            user.organization and
            not user.organization.is_active
        ):
            return Response(
                {
                    "error": "Your organization has been deactivated. Please contact the Super Administrator."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "message": "Login successful.",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "role": user.role,
                    "preferred_language": serialize_user_language(user),
                },
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
            status=status.HTTP_200_OK,
        )

class ProfileView(TranslatedResponseMixin, APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        user = request.user

        return Response(
            {
                "id": user.id,
                "username": user.username,
                "full_name": user.get_full_name(),
                "email": user.email,
                "role": user.role,
                "date_joined": user.date_joined,
                "preferred_language": serialize_user_language(user),

                "organization": {
                    "id": user.organization.id,
                    "name": user.organization.name,
                } if user.organization else None,
            },
            status=status.HTTP_200_OK,
        )


class LanguageListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        languages = Language.objects.filter(
            is_active=True
        ).order_by("language_name")

        return Response(
            LanguageSerializer(
                languages,
                many=True,
            ).data,
            status=status.HTTP_200_OK,
        )


class TranslationListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        language_code = request.query_params.get(
            "language",
            "en",
        )

        language = Language.objects.filter(
            language_code=language_code,
            is_active=True,
        ).first()

        if not language:
            language = get_default_language()

        if not language:
            return Response(
                {},
                status=status.HTTP_200_OK,
            )

        translations = Translation.objects.filter(
            language=language
        ).values(
            "key",
            "translated_text",
        )

        return Response(
            {
                translation["key"]: translation["translated_text"]
                for translation in translations
            },
            status=status.HTTP_200_OK,
        )


class PreferredLanguageView(TranslatedResponseMixin, APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(
            {
                "preferred_language": serialize_user_language(
                    request.user
                )
            },
            status=status.HTTP_200_OK,
        )

    def patch(self, request):
        language_id = request.data.get("preferred_language")

        if language_id is None:
            language_id = request.data.get("preferred_language_id")

        if language_id in [None, ""]:
            return Response(
                {
                    "error": "Preferred language is required."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            language = Language.objects.get(
                id=language_id,
                is_active=True,
            )
        except Language.DoesNotExist:
            return Response(
                {
                    "error": "Invalid preferred language."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        request.user.preferred_language = language
        request.user.save(
            update_fields=["preferred_language"]
        )

        return Response(
            {
                "message": "Preferred language updated successfully.",
                "preferred_language": LanguageSerializer(
                    language
                ).data,
            },
            status=status.HTTP_200_OK,
        )

    def put(self, request):
        return self.patch(request)


class LogoutView(TranslatedResponseMixin, APIView):
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


class OrganizationCreateView(TranslatedResponseMixin, APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        if request.user.role != "SUPER_ADMIN":
            return Response(
                {
                    "error": "Only Super Admin can create organizations."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = OrganizationSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        admin_email = serializer.validated_data.pop(
            "admin_email",
            None,
        )

        organization = serializer.save(
            owner=request.user,
        )

        # Notification : Organization Created
        create_admin_notification(
            title="New Organization Created",
            message=(
                f"{organization.name} has been created by "
                f"{request.user.username}."
            ),
            notification_type="organization",
        )

        if admin_email:

            invitation = Invitation.objects.create(
                email=admin_email,
                organization=organization,
                invited_by=request.user,
                role="SUB_ADMIN",
                token=str(uuid.uuid4()),
            )

            

            send_mail(
    subject="Welcome to FocusGuardAI - Organization Administrator Invitation",
    message=f"""
Hello,

You have been invited to join FocusGuardAI as an Organization Administrator.

Organization:
{organization.name}

Role:
Organization Administrator

Invitation Code:
{invitation.invite_code}

To complete your registration, please click the link below:

http://localhost:3001/organization-register

Regards,
FocusGuardAI Team
""",
    from_email=f"FocusGuardAI <{settings.DEFAULT_FROM_EMAIL}>",
    recipient_list=[admin_email],
    fail_silently=False,
)

            # Notification : Invitation Sent
            create_admin_notification(
                title="Invitation Sent",
                message=(
                    f"Invitation sent to "
                    f"{admin_email} for "
                    f"{organization.name}."
                ),
                notification_type="invitation",
            )

        return Response(
            {
                "message": "Organization created successfully.",
                "organization": OrganizationSerializer(
                    organization
                ).data,
            },
            status=status.HTTP_201_CREATED,
        )
class InvitationCreateView(TranslatedResponseMixin, APIView):
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

        if role == "SUB_ADMIN":
            subject = (
                "Welcome to FocusGuardAI - "
                "Organization Administrator Invitation"
            )
            message = f"""
Hello,

You have been invited to join FocusGuardAI as an Organization Administrator.

Organization:
{organization.name}

Role:
Organization Administrator

Invitation Code:
{invitation.invite_code}

To complete your registration, please click the link below:

http://localhost:3001/organization-register

Regards,
FocusGuardAI Team
"""

        else:
            subject = "Welcome to FocusGuardAI - Employee Invitation"
            message = f"""
Hello,

You have been invited to join FocusGuardAI.

Role:
{invitation.get_role_display()}

Invitation Code:
{invitation.invite_code}

To complete your registration, please click the link below:

http://localhost:3000/employee-register

Regards,
FocusGuardAI Team
"""

        send_mail(
            subject=subject,
            message=message,
            from_email=f"FocusGuardAI <{settings.DEFAULT_FROM_EMAIL}>",
            recipient_list=[invitation.email],
            fail_silently=False,
        )

        return Response(
            {
                "message": "Invitation sent successfully.",
                "invitation": InvitationSerializer(invitation).data,
            },
            status=status.HTTP_201_CREATED,
        )
from admin_notifications.utils import create_admin_notification


class InvitationRegistrationBaseView(TranslatedResponseMixin, APIView):
    permission_classes = [AllowAny]
    required_role = None

    def post(self, request):

        serializer = RegisterWithInviteCodeSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        invitation = Invitation.objects.filter(
            invite_code=serializer.validated_data["invite_code"],
        ).first()

        if not invitation:
            return Response(
                {
                    "error": "Invalid invitation code."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if (
            self.required_role
            and invitation.role != self.required_role
        ):
            return Response(
                {
                    "error": "Invalid invitation code."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if invitation.is_accepted:
            return Response(
                {
                    "error": "This invitation has already been used."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        expires_at = getattr(invitation, "expires_at", None)

        if expires_at and expires_at < timezone.now():
            return Response(
                {
                    "error": "This invitation has expired."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if User.objects.filter(
            username=serializer.validated_data["username"]
        ).exists():

            return Response(
                {
                    "error": "Username already exists."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if User.objects.filter(
            email=invitation.email
        ).exists():

            return Response(
                {
                    "error": "An account with this email already exists."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = User.objects.create_user(
            username=serializer.validated_data["username"],
            email=invitation.email,
            password=serializer.validated_data["password"],
            organization=invitation.organization,
            role=invitation.role,
            preferred_language=serializer.validated_data[
                "preferred_language"
            ],
        )

        invitation.is_accepted = True
        invitation.save()

        create_admin_notification(
            title="Invitation Accepted",
            message=(
                f"{user.username} has joined "
                f"{invitation.organization.name}."
            ),
            notification_type="invitation",
        )
        self.translation_user = user

        if user.role == "USER":
            for organization_admin in User.objects.filter(
                organization=invitation.organization,
                role="SUB_ADMIN",
                is_active=True,
            ):
                create_user_notification(
                    user=organization_admin,
                    title="Employee Joined",
                    message=(
                        f"{user.username} accepted the invitation "
                        f"and joined {invitation.organization.name}."
                    ),
                    notification_type="INVITATION",
                )

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "message": "Registration successful.",

                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "organization": user.organization.name,
                    "role": user.role,
                    "preferred_language": serialize_user_language(user),
                },

                "access": str(
                    refresh.access_token
                ),

                "refresh": str(
                    refresh
                ),
            },
            status=status.HTTP_201_CREATED,
        )


class OrganizationAdminRegisterWithInviteCodeView(
    InvitationRegistrationBaseView
):
    required_role = "SUB_ADMIN"


class EmployeeRegisterWithInviteCodeView(
    InvitationRegistrationBaseView
):
    required_role = "USER"
class OrganizationMembersView(TranslatedResponseMixin, APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        print("=" * 60)
        print("Logged User :", request.user.username)
        print("Role :", request.user.role)
        print("Organization :", request.user.organization)
        print("=" * 60)

        users = User.objects.filter(
    organization=request.user.organization,
    role="USER",
)

        print("Members Returned:")

        for user in users:
            calculate_user_analytics(user)
            print(
                user.username,
                user.role,
                user.organization
            )

        serializer = UserListSerializer(
            users,
            many=True,
        )

        return Response({
    "organization": request.user.organization.name,
    "total_employees": users.count(),
    "members": serializer.data,
    "users": serializer.data,
})
class ActivityStartView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        print("RAW REQUEST DATA:", request.data)
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
        category = serializer.validated_data.get("category")
        productivity_type = serializer.validated_data.get("productivity_type", "NEUTRAL")

        activity = ActivityLog.objects.create(
            user=request.user,
            website_name=website_name,
            website_url=website_url,
            category=category,
            productivity_type=productivity_type,
            tab_title=serializer.validated_data.get("tab_title"),
            start_time=timezone.now(),
            is_active=True,
        )

        calculate_user_analytics(request.user)

        return Response(
            {
                "message": "Activity started successfully.",
                "activity": ActivityLogSerializer(activity).data,
            },
            status=status.HTTP_201_CREATED,
        )


from datetime import datetime

class ActivityHistoryView(TranslatedResponseMixin, APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        date = request.query_params.get("date")

        activities = ActivityLog.objects.filter(
            user=request.user
        )

        if date:
            try:
                selected_date = datetime.strptime(
                    date,
                    "%Y-%m-%d"
                ).date()

                activities = activities.filter(
                    start_time__date=selected_date
                )

            except ValueError:
                return Response(
                    {
                        "error": "Invalid date format. Use YYYY-MM-DD."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

        activities = activities.order_by("-start_time")

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

class OrganizationActivityView(TranslatedResponseMixin, APIView):
    permission_classes = [
        IsAuthenticated,
        IsOrganizationAdmin,
    ]

    def serialize_activity_row(self, activity):
        if activity.duration:
            activity_duration = activity.duration
        elif activity.is_active:
            activity_duration = timezone.now() - activity.start_time
        else:
            activity_duration = timedelta()

        return {
            "id": activity.id,
            "user": activity.user.id,
            "username": activity.user.username,
            "employee": activity.user.username,
            "website": activity.website_name,
            "website_name": activity.website_name,
            "website_url": activity.website_url,
            "tab_title": activity.tab_title,
            "category": activity.category or DEFAULT_CATEGORY,
            "duration": str(activity_duration),
            "start_time": activity.start_time,
            "end_time": activity.end_time,
            "productivity_type": activity.productivity_type,
            "is_active": activity.is_active,
        }

    def get(self, request):

        organization = request.user.organization
        employee_id = request.query_params.get("employee_id")
        selected_date = request.query_params.get("date")
        wants_history = any(
            [
                employee_id,
                selected_date,
                request.query_params.get("page"),
                request.query_params.get("page_size"),
            ]
        )

        activities = ActivityLog.objects.filter(
            user__organization=organization,
            user__role="USER",
        ).select_related("user")

        if employee_id:
            activities = activities.filter(user_id=employee_id)

        if selected_date:
            try:
                parsed_date = datetime.strptime(
                    selected_date,
                    "%Y-%m-%d",
                ).date()
            except ValueError:
                return Response(
                    {
                        "error": "Invalid date format. Use YYYY-MM-DD."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            activities = activities.filter(start_time__date=parsed_date)

        activities = activities.order_by("-start_time")

        if wants_history:
            paginator = ActivityPagination()
            page = paginator.paginate_queryset(activities, request)
            rows = [
                self.serialize_activity_row(activity)
                for activity in page
            ]

            return Response(
                {
                    "organization": {
                        "id": organization.id,
                        "name": organization.name,
                    },
                    "count": paginator.page.paginator.count,
                    "next": paginator.get_next_link(),
                    "previous": paginator.get_previous_link(),
                    "results": rows,
                },
                status=status.HTTP_200_OK,
            )

        recent_activities = [
            self.serialize_activity_row(activity)
            for activity in activities[:20]
        ]

        serializer = ActivityLogSerializer(
            activities[:20],
            many=True,
        )

        return Response(
            {
                "organization": {
                    "id": organization.id,
                    "name": organization.name,
                },
                "total_activities": activities.count(),
                "activities": serializer.data,
                "users": recent_activities,
            },
            status=status.HTTP_200_OK,
        )
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


from collections import defaultdict
from datetime import timedelta

from django.utils import timezone

from .models import ActivityLog, UserInactivity

DEFAULT_CATEGORY = "Uncategorized"


def calculate_user_analytics(user, selected_date=None):

    activities = ActivityLog.objects.filter(user=user)

    if selected_date:
        activities = activities.filter(
            start_time__date=selected_date
        )

    activities = activities.order_by("start_time")

    productive_time = timedelta()
    non_productive_time = timedelta()
    neutral_time = timedelta()
    idle_time = timedelta()

    category_summary = defaultdict(timedelta)
    website_summary = defaultdict(timedelta)
    website_visits = defaultdict(int)
    website_urls = {}
    website_categories = {}

    websites = set()

    tab_switches = max(activities.count() - 1, 0)

    for activity in activities:

        website = activity.website_name or "Unknown"
        url = activity.website_url or ""
        category = activity.category or DEFAULT_CATEGORY

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

        if website not in website_categories and category:
            website_categories[website] = category

        category_summary[category] += duration
        website_summary[website] += duration

        if activity.productivity_type == "PRODUCTIVE":

            productive_time += duration

        elif activity.productivity_type == "NON_PRODUCTIVE":

            non_productive_time += duration

        else:

            neutral_time += duration

    inactivity_logs = UserInactivity.objects.filter(
        user=user
    )

    if selected_date:
        inactivity_logs = inactivity_logs.filter(
            inactive_from__date=selected_date
        )

    for inactivity in inactivity_logs:

        if inactivity.duration:

            idle_time += inactivity.duration

        elif inactivity.is_active:

            idle_time += (
                timezone.now() -
                inactivity.inactive_from
            )

    total_time = (
        productive_time +
        non_productive_time +
        neutral_time
    )

    total_seconds = total_time.total_seconds()

    if total_seconds > 0:

        productive_percentage = round(
            productive_time.total_seconds()
            * 100
            / total_seconds,
            2,
        )

        non_productive_percentage = round(
            non_productive_time.total_seconds()
            * 100
            / total_seconds,
            2,
        )

        neutral_percentage = round(
            neutral_time.total_seconds()
            * 100
            / total_seconds,
            2,
        )

    else:

        productive_percentage = 0
        non_productive_percentage = 0
        neutral_percentage = 0

    website_report = {}

    for website in website_summary:

        website_report[website] = {
            "url": website_urls.get(
                website,
                "",
            ),
            "time_spent": str(
                website_summary[website]
            ),
            "visits": website_visits[website],
        }

    top_websites = sorted(
        website_summary.items(),
        key=lambda item: item[1],
        reverse=True,
    )[:5]

    top_websites_report = []

    for website, duration in top_websites:

        top_websites_report.append(
            {
                "website_name": website,
                "website_url": website_urls.get(
                    website,
                    "",
                ),
                "category": website_categories.get(
                    website,
                    "Unknown",
                ),
                "duration": str(duration),
                "duration_seconds": round(duration.total_seconds(), 2),
                "visits": website_visits[website],
            }
        )

    if selected_date is None:
        analytics = UserAnalytics.objects.filter(
            user=user
        ).order_by("id").first()

        if analytics is None:
            analytics = UserAnalytics(user=user)

        analytics.productive_time = productive_time
        analytics.non_productive_time = non_productive_time
        analytics.neutral_time = neutral_time
        analytics.idle_time = idle_time
        analytics.websites_visited = len(websites)
        analytics.tab_switches = tab_switches
        analytics.save()

    return {

        "productive_time": str(
            productive_time
        ),

        "non_productive_time": str(
            non_productive_time
        ),

        "neutral_time": str(
            neutral_time
        ),

        "idle_time": str(
            idle_time
        ),

        "total_time": str(
            total_time
        ),

        "productive_percentage":
            productive_percentage,

        "productivity_percentage":
            productive_percentage,

        "non_productive_percentage":
            non_productive_percentage,

        "neutral_percentage":
            neutral_percentage,

        "total_websites_visited":
            len(websites),

        "total_tab_switches":
            tab_switches,

        "category_summary": {

            category: str(duration)

            for category, duration
            in category_summary.items()

        },

        "website_summary":
            website_report,

        "top_websites":
            top_websites_report,

    }
from datetime import datetime

class UserAnalyticsView(TranslatedResponseMixin, APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        date = request.query_params.get("date")

        selected_date = None

        if date:

            try:

                selected_date = datetime.strptime(
                    date,
                    "%Y-%m-%d",
                ).date()

            except ValueError:

                return Response(
                    {
                        "error": "Invalid date format. Use YYYY-MM-DD."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

        analytics = calculate_user_analytics(
            request.user,
            selected_date,
        )

        category_summary = analytics.get("category_summary", {})
        analytics["category_summary"] = {
            translate_text(category, get_user_language(request)): duration
            for category, duration in category_summary.items()
        }

        return Response(
            {

                "user": {

                    "id": request.user.id,

                    "username": request.user.username,

                    "full_name": request.user.get_full_name(),

                    "email": request.user.email,

                    "role": request.user.role,

                },

                **analytics,

            },
            status=status.HTTP_200_OK,
        )
class OrganizationAnalyticsView(TranslatedResponseMixin, APIView):
    permission_classes = [IsAuthenticated, IsOrganizationAdmin]

    def get(self, request):

        organization = request.user.organization
        language_code = get_user_language(request)

        users = User.objects.filter(
    organization=organization,
    role="USER",
).order_by("id")

        total_employees = users.count()
        active_employees = users.filter(is_active=True).count()
        inactive_employees = total_employees - active_employees

        members = []
        productivity_sum = 0
        non_productivity_sum = 0
        website_totals = {}

        for user in users:

            analytics = calculate_user_analytics(user)
            category_summary = analytics.get("category_summary", {})

            # Category summaries use category names as dictionary keys. Those
            # keys are normally protected by the response translation layer to
            # preserve API contracts, so translate them here for chart labels.
            analytics["category_summary"] = {
                translate_text(str(category), language_code): duration
                for category, duration in category_summary.items()
            }

            productivity = analytics.get(
                "productive_percentage",
                0
            )

            productivity_sum += productivity
            non_productivity_sum += analytics.get(
                "non_productive_percentage",
                0,
            )

            for website in analytics.get("top_websites", []):
                website_name = website.get("website_name") or "Unknown"

                if website_name not in website_totals:
                    website_totals[website_name] = {
                        "website_name": website_name,
                        "website_url": website.get("website_url", ""),
                        "category": website.get("category", "Unknown"),
                        "duration_seconds": 0,
                        "visits": 0,
                    }

                website_totals[website_name]["duration_seconds"] += (
                    website.get("duration_seconds", 0)
                )
                website_totals[website_name]["visits"] += website.get(
                    "visits",
                    0,
                )

            members.append({
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role,
                **analytics,
            })

        average_productivity = (
            productivity_sum / total_employees
            if total_employees else 0
        )
        average_non_productivity = (
            non_productivity_sum / total_employees
            if total_employees else 0
        )

        top_websites = sorted(
            website_totals.values(),
            key=lambda website: website["duration_seconds"],
            reverse=True,
        )[:5]

        for website in top_websites:
            website["duration"] = str(
                timedelta(seconds=website["duration_seconds"])
            )

        return Response({

            "organization": {
                "id": organization.id,
                "name": organization.name,
            },

            "total_employees": total_employees,

            "active_employees": active_employees,

            "inactive_employees": inactive_employees,

            "productive_percentage": round(
                average_productivity,
                2,
            ),

            "unproductive_percentage": round(
                average_non_productivity,
                2,
            ),

            "top_websites": top_websites,

            "members": members,
            "users": members,

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

        calculate_user_analytics(request.user)

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

        calculate_user_analytics(request.user)

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

        for organization_admin in User.objects.filter(
            organization=request.user.organization,
            role="SUB_ADMIN",
            is_active=True,
        ):
            create_user_notification(
                user=organization_admin,
                title="Employee Deactivation Request",
                message=(
                    f"{request.user.get_full_name() or request.user.username} "
                    f"requested account deactivation."
                ),
                notification_type="REQUEST",
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
class EmployeeDeactivationRequestListView(TranslatedResponseMixin, APIView):
    permission_classes = [
        IsAuthenticated,
        IsOrganizationAdmin,
    ]

    def get(self, request):

        requests = (
            EmployeeDeactivationRequest.objects
            .filter(
                organization=request.user.organization
            )
            .select_related("employee")
            .order_by("-requested_at")
        )

        serializer = EmployeeDeactivationRequestSerializer(
            requests,
            many=True,
        )

        return Response(
            {
                "organization": {
                    "id": request.user.organization.id,
                    "name": request.user.organization.name,
                },

                "count": requests.count(),

                "results": serializer.data,
            },
            status=status.HTTP_200_OK,
        )
from django.db import transaction

class ApproveEmployeeDeactivationRequestView(TranslatedResponseMixin, APIView):
    permission_classes = [
        IsAuthenticated,
        IsOrganizationAdmin,
    ]

    @transaction.atomic
    def post(self, request, request_id):

        try:

            deactivation_request = (
                EmployeeDeactivationRequest.objects
                .select_related("employee")
                .get(
                    id=request_id,
                    organization=request.user.organization,
                )
            )

        except EmployeeDeactivationRequest.DoesNotExist:

            return Response(
                {
                    "error": "Request not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        if deactivation_request.status != "PENDING":

            return Response(
                {
                    "error": "This request has already been processed."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        deactivation_request.status = "APPROVED"
        deactivation_request.reviewed_by = request.user
        deactivation_request.reviewed_at = timezone.now()
        deactivation_request.save()

        employee = deactivation_request.employee
        employee.is_active = False
        employee.save(update_fields=["is_active"])

        return Response(
            {
                "message": "Employee deactivated successfully.",

                "request": {

                    "id": deactivation_request.id,

                    "status": deactivation_request.status,

                    "employee": employee.get_full_name()
                    or employee.username,

                    "reviewed_by": request.user.username,

                    "reviewed_at": deactivation_request.reviewed_at,

                }

            },
            status=status.HTTP_200_OK,
        )
from django.db import transaction

class RejectEmployeeDeactivationRequestView(TranslatedResponseMixin, APIView):
    permission_classes = [
        IsAuthenticated,
        IsOrganizationAdmin,
    ]

    @transaction.atomic
    def post(self, request, request_id):

        try:

            deactivation_request = (
                EmployeeDeactivationRequest.objects
                .select_related("employee")
                .get(
                    id=request_id,
                    organization=request.user.organization,
                )
            )

        except EmployeeDeactivationRequest.DoesNotExist:

            return Response(
                {
                    "error": "Request not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        if deactivation_request.status != "PENDING":

            return Response(
                {
                    "error": "This request has already been processed."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        deactivation_request.status = "REJECTED"
        deactivation_request.reviewed_by = request.user
        deactivation_request.reviewed_at = timezone.now()
        deactivation_request.save()

        return Response(
            {
                "message": "Request rejected successfully.",

                "request": {

                    "id": deactivation_request.id,

                    "status": deactivation_request.status,

                    "employee": (
                        deactivation_request.employee.get_full_name()
                        or deactivation_request.employee.username
                    ),

                    "reviewed_by": request.user.username,

                    "reviewed_at": deactivation_request.reviewed_at,

                }

            },
            status=status.HTTP_200_OK,
        )
class OrganizationDeactivationRequestView(TranslatedResponseMixin, APIView):
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

        create_admin_notification(
            title="Organization Deactivation Request",
            message=(
                f"{request.user.organization.name} has requested "
                f"deactivation.\n\n"
                f"Requested by: {request.user.username}"
            ),
            notification_type="request",
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
from admin_notifications.utils import create_admin_notification


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

        organization.is_active = False
        organization.save(update_fields=["is_active"])

        users_deactivated = User.objects.filter(
            organization=organization,
        ).exclude(
            role="SUPER_ADMIN"
        ).update(
            is_active=False
        )

        create_admin_notification(
            title="Organization Deactivated",
            message=(
                f"{organization.name} has been deactivated by "
                f"{request.user.username}."
            ),
            notification_type="request",
        )

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

        create_admin_notification(
            title="Deactivation Request Rejected",
            message=(
                f"The deactivation request for "
                f"{organization_request.organization.name} "
                f"was rejected by {request.user.username}."
            ),
            notification_type="request",
        )

        if organization_request.requested_by.is_active:
            create_user_notification(
                user=organization_request.requested_by,
                title="Deactivation Request Rejected",
                message=(
                    f"Your deactivation request for "
                    f"{organization_request.organization.name} "
                    f"was rejected by {request.user.username}."
                ),
                notification_type="REQUEST",
            )

        return Response({
            "message": "Organization deactivation request rejected successfully."
        })
class ActivityStopView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        activity = ActivityLog.objects.filter(
            user=request.user,
            is_active=True
        ).order_by("-start_time").first()

        if not activity:
            return Response(
                {"message": "No active activity found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        activity.end_time = timezone.now()
        activity.duration = (
            activity.end_time - activity.start_time
        )
        activity.is_active = False
        activity.save()

        calculate_user_analytics(request.user)

        return Response(
            {
                "message": "Activity stopped successfully.",
                "activity": ActivityLogSerializer(activity).data,
            },
            status=status.HTTP_200_OK,
        )
from datetime import datetime, timedelta

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from users.models import ActivityLog
from users.serializers import ActivityLogSerializer


from collections import defaultdict
from datetime import datetime, timedelta

from collections import defaultdict
from datetime import datetime, timedelta

class DashboardTrendAPIView(TranslatedResponseMixin, APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        selected_date = request.GET.get("date")

        if selected_date:
            try:
                end_date = datetime.strptime(
                    selected_date,
                    "%Y-%m-%d",
                ).date()
            except ValueError:
                return Response(
                    {"error": "Invalid date format. Use YYYY-MM-DD."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        else:
            end_date = timezone.localdate()

        start_date = end_date - timedelta(days=6)

        activities = ActivityLog.objects.filter(
            start_time__date__range=(
                start_date,
                end_date,
            ),
        )

        if request.user.role == "SUB_ADMIN":
            activities = activities.filter(
                user__organization=request.user.organization,
                user__role="USER",
            )
        else:
            activities = activities.filter(
                user=request.user,
            )

        trend = defaultdict(
            lambda: {
                "productive_seconds": 0,
                "non_productive_seconds": 0,
                "neutral_seconds": 0,
                "idle_seconds": 0,
            }
        )

        for activity in activities:

            if activity.duration:

                seconds = activity.duration.total_seconds()

            elif activity.is_active:

                seconds = (
                    timezone.now() -
                    activity.start_time
                ).total_seconds()

            else:

                seconds = 0

            # The database date filter uses Django's configured timezone.
            # Group by that same local date; using `.date()` here groups an
            # aware UTC timestamp under the previous day for users in IST.
            day = timezone.localtime(activity.start_time).date()

            if activity.productivity_type == "PRODUCTIVE":

                trend[day]["productive_seconds"] += seconds

            elif activity.productivity_type == "NON_PRODUCTIVE":

                trend[day]["non_productive_seconds"] += seconds

            else:
                trend[day]["neutral_seconds"] += seconds

        inactivity_logs = UserInactivity.objects.filter(
            inactive_from__date__range=(start_date, end_date),
        )

        if request.user.role == "SUB_ADMIN":
            inactivity_logs = inactivity_logs.filter(
                user__organization=request.user.organization,
                user__role="USER",
            )
        else:
            inactivity_logs = inactivity_logs.filter(user=request.user)

        for inactivity in inactivity_logs:
            if inactivity.duration:
                seconds = inactivity.duration.total_seconds()
            elif inactivity.is_active:
                seconds = (
                    timezone.now() - inactivity.inactive_from
                ).total_seconds()
            else:
                seconds = 0

            local_day = timezone.localtime(inactivity.inactive_from).date()
            trend[local_day]["idle_seconds"] += seconds

        response = []

        for i in range(7):

            current = start_date + timedelta(days=i)

            values = trend[current]
            productive_seconds = round(values["productive_seconds"], 2)
            non_productive_seconds = round(
                values["non_productive_seconds"], 2
            )
            neutral_seconds = round(values["neutral_seconds"], 2)
            idle_seconds = round(values["idle_seconds"], 2)
            total_seconds = round(
                productive_seconds + non_productive_seconds + neutral_seconds,
                2,
            )

            response.append({
                # ISO dates make the API ordering and the frontend date join
                # unambiguous, including weeks that cross month/year boundaries.
                "date": current.isoformat(),
                # Keep the duration contract used by daily analytics so every
                # dashboard consumer refers to the same named measurements.
                "productive_time": str(
                    timedelta(seconds=productive_seconds)
                ),
                "non_productive_time": str(
                    timedelta(seconds=non_productive_seconds)
                ),
                "neutral_time": str(timedelta(seconds=neutral_seconds)),
                "idle_time": str(timedelta(seconds=idle_seconds)),
                "total_time": str(timedelta(seconds=total_seconds)),
                "productive_seconds": productive_seconds,
                "non_productive_seconds": non_productive_seconds,
                "neutral_seconds": neutral_seconds,
                "idle_seconds": idle_seconds,
                "total_seconds": total_seconds,
            })

        return Response(response)
from django.db.models import Count

from django.db.models import Count

class SuperAdminDashboardView(APIView):
    permission_classes = [IsAuthenticated, IsSuperAdmin]

    def get(self, request):

        organizations = Organization.objects.all()
        employees = User.objects.filter(role="USER")
        organization_admins = User.objects.filter(role="SUB_ADMIN")

        recent_organizations = organizations.order_by("-created_at")[:5]

        pending_requests = OrganizationDeactivationRequest.objects.filter(
            status="PENDING"
        )

        pending_invitations = Invitation.objects.filter(
    role="SUB_ADMIN",
    is_accepted=False,
).select_related(
    "organization"
).order_by("-created_at")[:5]

        organization_growth = []

        for organization in organizations:
            organization_growth.append({
                "name": organization.name,
                "employees": User.objects.filter(
                    organization=organization,
                    role="USER"
                ).count()
            })

        employee_distribution = {
            "active": employees.filter(
                is_active=True
            ).count(),
            "inactive": employees.filter(
                is_active=False
            ).count(),
        }

        return Response({

            "stats": {
                "organizations": organizations.count(),
                "organization_admins": organization_admins.count(),
                "employees": employees.count(),
                "pending_requests": pending_requests.count(),
            },

            "organization_growth": organization_growth,

            "employee_distribution": employee_distribution,

            "recent_organizations": [
                {
                    "id": org.id,
                    "name": org.name,
                    "created_at": org.created_at,
                    "status": org.is_active,
                }
                for org in recent_organizations
            ],

            "pending_invitations": [
    {
        "id": invite.id,
        "email": invite.email,
        "organization": invite.organization.name,
        "role": "Organization Admin",
        "status": "Pending",
        "created_at": invite.created_at,
    }
    for invite in pending_invitations
],
        })
class SuperAdminOrganizationListView(APIView):
    permission_classes = [IsAuthenticated, IsSuperAdmin]

    def get(self, request):

        def duration_to_seconds(duration):
            if not duration:
                return 0

            hours, minutes, seconds = duration.split(":")

            return (
                int(hours) * 3600 +
                int(minutes) * 60 +
                float(seconds)
            )

        organizations = Organization.objects.all().order_by("name")

        data = []

        for organization in organizations:

            admin = User.objects.filter(
                organization=organization,
                role="SUB_ADMIN"
            ).first()

            employees = User.objects.filter(
                organization=organization,
                role="USER"
            )

            total = employees.count()

            analytics = []

            for employee in employees:
                analytics.append(
                    calculate_user_analytics(employee)
                )

            productive = 0
            non_productive = 0
            neutral = 0

            for report in analytics:

                p = report["productive_time"]
                np = report["non_productive_time"]
                n = report["neutral_time"]

                productive += duration_to_seconds(p)
                non_productive += duration_to_seconds(np)
                neutral += duration_to_seconds(n)

            percent = 0

            if productive + non_productive + neutral > 0:
                percent = round(
                    productive * 100 /
                    (productive + non_productive + neutral),
                    2,
                )

            data.append({
                "id": organization.id,
                "name": organization.name,
                "admin": admin.email if admin else "",
                "employees": total,
                "productive": percent,
                "status": (
                    "Active"
                    if organization.is_active
                    else "Inactive"
                ),
            })

        return Response(data)
class SuperAdminOrganizationDetailView(APIView):
    permission_classes = [IsAuthenticated, IsSuperAdmin]

    def duration_to_seconds(self, duration):
        if not duration:
            return 0

        try:
            hours, minutes, seconds = duration.split(":")
            return (
                int(hours) * 3600
                + int(minutes) * 60
                + float(seconds)
            )
        except Exception:
            return 0

    def get(self, request, organization_id):

        try:
            organization = Organization.objects.get(
                id=organization_id
            )
        except Organization.DoesNotExist:
            return Response(
                {"error": "Organization not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        employees = User.objects.filter(
            organization=organization,
            role="USER",
        )

        active = employees.filter(is_active=True).count()
        inactive = employees.filter(is_active=False).count()

        employee_data = []

        productive_total = 0
        non_productive_total = 0
        neutral_total = 0

        for employee in employees:

            analytics = calculate_user_analytics(employee)

            p = self.duration_to_seconds(
                analytics["productive_time"]
            )
            np = self.duration_to_seconds(
                analytics["non_productive_time"]
            )
            neutral = self.duration_to_seconds(
                analytics["neutral_time"]
            )

            productive_total += p
            non_productive_total += np
            neutral_total += neutral

            percent = analytics.get(
                "productivity_percentage",
                0,
            )

            employee_data.append({
                "id": employee.id,
                "name": employee.username,
                "email": employee.email,
                "department": "N/A",
                "productive": percent,
                "unproductive": analytics.get(
                    "non_productive_percentage",
                    0,
                ),
                "status": (
                    "Active"
                    if employee.is_active
                    else "Inactive"
                ),
            })

        overall = 0

        if productive_total + non_productive_total + neutral_total > 0:
            overall = round(
                productive_total * 100 /
                (
                    productive_total +
                    non_productive_total +
                    neutral_total
                ),
                2,
            )

        return Response({
            "organization": {
                "id": organization.id,
                "name": organization.name,
                "address": organization.address,
            },
            "summary": {
                "employees": employees.count(),
                "active": active,
                "inactive": inactive,
                "productive": overall,
                "unproductive": round(
                    non_productive_total * 100 /
                    (
                        productive_total +
                        non_productive_total +
                        neutral_total
                    ),
                    2,
                ) if (
                    productive_total +
                    non_productive_total +
                    neutral_total
                ) > 0 else 0,
            },
            "employees_data": employee_data,
        })
class SuperAdminOrganizationUpdateDeleteView(APIView):
    permission_classes = [IsAuthenticated, IsSuperAdmin]

    def put(self, request, organization_id):

        try:
            organization = Organization.objects.get(
                id=organization_id
            )

        except Organization.DoesNotExist:

            return Response(
                {
                    "error": "Organization not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = OrganizationSerializer(
            organization,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(raise_exception=True)

        serializer.save()

        return Response(
            {
                "message": "Organization updated successfully.",
                "organization": serializer.data,
            }
        )

    def delete(self, request, organization_id):

        try:
            organization = Organization.objects.get(
                id=organization_id
            )

        except Organization.DoesNotExist:

            return Response(
                {
                    "error": "Organization not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        organization.delete()

        return Response(
            {
                "message": "Organization deleted successfully."
            },
            status=status.HTTP_204_NO_CONTENT,
        )
# views.py

class SuperAdminEmployeesSummaryView(APIView):
    permission_classes = [IsAuthenticated, IsSuperAdmin]

    def get(self, request, organization_id):

        try:
            organization = Organization.objects.get(id=organization_id)
        except Organization.DoesNotExist:
            return Response(
                {"error": "Organization not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        employees = User.objects.filter(
            organization=organization,
            role="USER"
        ).order_by("username")

        data = []

        for employee in employees:

            analytics = calculate_user_analytics(employee)

            percentage = analytics.get(
                "productivity_percentage",
                0,
            )

            data.append({
                "id": employee.id,
                "username": employee.username,
                "email": employee.email,
                "department": "N/A",
                "productive": percentage,
                "unproductive": analytics.get(
                    "non_productive_percentage",
                    0,
                ),
                "status": employee.is_active,
            })

        return Response(data)
# views.py

class SuperAdminAnalyticsAPIView(APIView):
    permission_classes = [IsAuthenticated, IsSuperAdmin]

    def get(self, request):

        organizations = Organization.objects.filter(
            is_active=True
        ).order_by("name")

        overall_productive = 0
        overall_non_productive = 0
        overall_neutral = 0
        overall_idle = 0

        total_employees = 0

        organizations_data = []

        def seconds(value):
            parts = value.split(":")

            h = int(parts[0])
            m = int(parts[1])
            s = float(parts[2])

            return int(
                h * 3600 +
                m * 60 +
                s
            )

        for organization in organizations:

            employees = User.objects.filter(
                organization=organization,
                role="USER",
                is_active=True,
            )

            total_employees += employees.count()

            productive = 0
            non_productive = 0
            neutral = 0
            idle = 0

            for employee in employees:

                analytics = calculate_user_analytics(employee)

                productive += seconds(
                    analytics["productive_time"]
                )

                non_productive += seconds(
                    analytics["non_productive_time"]
                )

                neutral += seconds(
                    analytics["neutral_time"]
                )

                idle += seconds(
                    analytics["idle_time"]
                )

            total = (
                productive +
                non_productive +
                neutral
            )

            productive_percent = 0
            non_productive_percent = 0
            neutral_percent = 0

            if total:

                productive_percent = round(
                    productive * 100 / total,
                    2,
                )

                non_productive_percent = round(
                    non_productive * 100 / total,
                    2,
                )

                neutral_percent = round(
                    neutral * 100 / total,
                    2,
                )

            overall_productive += productive
            overall_non_productive += non_productive
            overall_neutral += neutral
            overall_idle += idle

            organizations_data.append(
                {
                    "organization_id": organization.id,
                    "organization": organization.name,
                    "employees": employees.count(),
                    "productive": productive_percent,
                    "non_productive": non_productive_percent,
                    "neutral": neutral_percent,
                    "idle_seconds": idle,
                }
            )

        overall_total = (
            overall_productive +
            overall_non_productive +
            overall_neutral
        )

        if overall_total:

            productive_percentage = round(
                overall_productive * 100 / overall_total,
                2,
            )

            non_productive_percentage = round(
                overall_non_productive * 100 / overall_total,
                2,
            )

            neutral_percentage = round(
                overall_neutral * 100 / overall_total,
                2,
            )

        else:

            productive_percentage = 0
            non_productive_percentage = 0
            neutral_percentage = 0

        return Response(
            {
                "summary": {
                    "organizations": organizations.count(),
                    "employees": total_employees,
                    "productive": productive_percentage,
                    "non_productive": non_productive_percentage,
                    "neutral": neutral_percentage,
                    "idle_seconds": overall_idle,
                },
                "organizations_data": organizations_data,
            }
        )
class SuperAdminInvitationListView(APIView):
    permission_classes = [IsAuthenticated, IsSuperAdmin]

    def get(self, request):

        invitations = Invitation.objects.filter(
            role="SUB_ADMIN"
        ).select_related(
            "organization"
        ).order_by("-created_at")

        data = []

        for invitation in invitations:
            data.append({
                "id": invitation.id,
                "email": invitation.email,
                "organization": invitation.organization.name,
                "invite_code": invitation.invite_code,
                "role": "Organization Admin",
                "status": "Accepted" if invitation.is_accepted else "Pending",
                "created_at": invitation.created_at,
            })

        return Response(data)
# views.py

class SuperAdminInvitationDeleteView(TranslatedResponseMixin, APIView):
    permission_classes = [IsAuthenticated, IsSuperAdmin]

    def delete(self, request, invitation_id):

        try:
            invitation = Invitation.objects.get(
                id=invitation_id
            )
        except Invitation.DoesNotExist:
            return Response(
                {
                    "error": "Invitation not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        invitation.delete()

        return Response(
            {
                "message": "Invitation deleted successfully."
            }
        )
# views.py

from django.contrib.auth.password_validation import validate_password
from rest_framework import status

class SuperAdminSettingsView(TranslatedResponseMixin, APIView):
    permission_classes = [IsAuthenticated, IsSuperAdmin]

    def get(self, request):

        user = request.user

        return Response({
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "preferred_language": serialize_user_language(user),
        })

    def put(self, request):

        user = request.user

        username = request.data.get("username", "").strip()
        email = request.data.get("email", "").strip()
        first_name = request.data.get("first_name", "").strip()
        last_name = request.data.get("last_name", "").strip()

        current_password = request.data.get("current_password")
        new_password = request.data.get("new_password")
        confirm_password = request.data.get("confirm_password")
        preferred_language_id = request.data.get("preferred_language")

        if preferred_language_id is None:
            preferred_language_id = request.data.get(
                "preferred_language_id"
            )

        if (
            User.objects.exclude(id=user.id)
            .filter(username=username)
            .exists()
        ):
            return Response(
                {
                    "error": "Username already exists."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if (
            User.objects.exclude(id=user.id)
            .filter(email=email)
            .exists()
        ):
            return Response(
                {
                    "error": "Email already exists."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.username = username
        user.email = email
        user.first_name = first_name
        user.last_name = last_name

        if preferred_language_id:
            try:
                user.preferred_language = Language.objects.get(
                    id=preferred_language_id,
                    is_active=True,
                )
            except Language.DoesNotExist:
                return Response(
                    {
                        "error": "Invalid preferred language."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

        if new_password:

            if not current_password:
                return Response(
                    {
                        "error": "Current password is required."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if not user.check_password(current_password):
                return Response(
                    {
                        "error": "Current password is incorrect."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if new_password != confirm_password:
                return Response(
                    {
                        "error": "Passwords do not match."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            try:
                validate_password(new_password)
            except Exception as e:
                return Response(
                    {
                        "error": e.messages[0]
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user.set_password(new_password)

        user.save()

        return Response({
            "message": "Profile updated successfully.",
            "preferred_language": serialize_user_language(user),
        })
class SuperAdminLoginView(TranslatedResponseMixin, APIView):
    permission_classes = [AllowAny]

    def post(self, request):

        serializer = LoginRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]
        self.translation_user = user

        if user.role != "SUPER_ADMIN":
            return Response(
                {
                    "error": "Only Super Admin can login."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "message": "Login successful.",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "role": user.role,
                    "preferred_language": serialize_user_language(user),
                },
            },
            status=status.HTTP_200_OK,
        )
