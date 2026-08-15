from django.contrib.auth import authenticate
import unicodedata
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import EmployeeDeactivationRequest, NormalUserDeactivationRequest, OrganizationDeactivationRequest, User, Organization, Invitation, ActivityLog, UserInactivity, Language, Translation

from .models import User, Organization, Invitation


def validate_username_identifier(value):
    """Reject accidental mixing of Latin and non-Latin identifier text."""
    has_latin_letter = False
    has_non_latin_letter = False

    for character in value:
        if not character.isalpha():
            continue

        character_name = unicodedata.name(character, "")

        if character_name.startswith("LATIN "):
            has_latin_letter = True
        else:
            has_non_latin_letter = True

    if has_latin_letter and has_non_latin_letter:
        raise serializers.ValidationError(
            "Username cannot mix Latin and non-Latin characters."
        )

    return value


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        validators=[
            UniqueValidator(
                queryset=User.objects.filter(is_active=True),
                message=(
                    "An account with this email already exists. Please use "
                    "your existing credentials to log in."
                )
            )
        ]
    )
    preferred_language = serializers.PrimaryKeyRelatedField(
        queryset=Language.objects.filter(is_active=True),
        required=False,
        allow_null=True,
    )

    def validate_username(self, value):
        return validate_username_identifier(value)

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "password",
            "preferred_language",
        ]
        extra_kwargs = {
            "password": {"write_only": True}
        }

    def create(self, validated_data):
        preferred_language = validated_data.get(
            "preferred_language"
        )

        if preferred_language is None:
            preferred_language = (
                Language.objects.filter(
                    language_code="en",
                    is_active=True,
                ).first()
                or Language.objects.filter(
                    is_active=True
                ).order_by("language_name").first()
            )

        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            preferred_language=preferred_language,
        )

        refresh = RefreshToken.for_user(user)

        return {
            "user": user,
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }


class LoginRequestSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(
            username=data["username"],
            password=data["password"]
        )

        if not user:
            raise serializers.ValidationError(
                "Invalid username or password."
            )

        data["user"] = user
        return data


class LoginSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token["username"] = user.username
        token["email"] = user.email

        return token
    
class OrganizationSerializer(serializers.ModelSerializer):

    admin_email = serializers.EmailField(
        write_only=True,
        required=False,
    )

    class Meta:
        model = Organization
        fields = [
            "id",
            "name",
            "email",
            "address",
            "contact_number",
            "max_employees",
            "admin_email",
            "created_at",
            "is_active",
        ]

        read_only_fields = [
            "created_at",
            "is_active",
        ]

class InvitationSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()

    organization = serializers.PrimaryKeyRelatedField(
        queryset=Organization.objects.all(),
        required=False
    )

    class Meta:
        model = Invitation
        fields = [
            "id",
            "email",
            "role",
            "organization",
            "invited_by",
            "token",
            "invite_code",
            "is_accepted",
            "created_at",
        ]

        read_only_fields = [
            "invited_by",
            "token",
            "invite_code",
            "is_accepted",
            "created_at",
        ]

    def validate(self, attrs):

        request = self.context["request"]

        if request.user.role == "SUPER_ADMIN":

            if not attrs.get("organization"):
                raise serializers.ValidationError(
                    {
                        "organization": "Organization is required."
                    }
                )

        elif request.user.role == "SUB_ADMIN":

            attrs["organization"] = request.user.organization

        return attrs
from rest_framework import serializers


class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = [
            "id",
            "language_name",
            "native_name",
            "language_code",
            "is_active",
        ]


class TranslationSerializer(serializers.ModelSerializer):
    language = LanguageSerializer(read_only=True)
    language_id = serializers.PrimaryKeyRelatedField(
        source="language",
        queryset=Language.objects.filter(is_active=True),
        write_only=True,
    )

    class Meta:
        model = Translation
        fields = [
            "id",
            "language",
            "language_id",
            "key",
            "translated_text",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "created_at",
            "updated_at",
        ]


class RegisterWithInviteCodeSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150, required=False)

    password = serializers.CharField(
        write_only=True,
        min_length=8,
    )

    confirm_password = serializers.CharField(
        write_only=True,
        min_length=8,
    )

    invite_code = serializers.CharField(
        max_length=15,
    )

    # Organization-admin registration keeps supporting the legacy invitation
    # payload. Employee links always provide this value and are validated in
    # the view against the invitation's email.
    email = serializers.EmailField(required=False)

    preferred_language = serializers.PrimaryKeyRelatedField(
        queryset=Language.objects.filter(is_active=True),
    )

    def validate(self, attrs):

        if (
            attrs["password"]
            != attrs["confirm_password"]
        ):
            raise serializers.ValidationError(
                {
                    "confirm_password":
                    "Passwords do not match."
                }
            )

        return attrs

    def validate_username(self, value):
        return validate_username_identifier(value)


class NormalUserRegisterSerializer(serializers.Serializer):
    username = serializers.CharField(
        max_length=150,
        validators=[
            UniqueValidator(
                queryset=User.objects.all(),
                message="Username already exists.",
            )
        ],
    )
    email = serializers.EmailField(
        validators=[
            UniqueValidator(
                queryset=User.objects.filter(is_active=True),
                message=(
                    "An account with this email already exists. Please use "
                    "your existing credentials to log in."
                ),
            )
        ]
    )
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, min_length=8)
    preferred_language = serializers.PrimaryKeyRelatedField(
        queryset=Language.objects.filter(is_active=True),
    )

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        return attrs

    def validate_username(self, value):
        return validate_username_identifier(value)

from rest_framework import serializers

from .models import (
    User,
    UserAnalytics,
)


class UserListSerializer(serializers.ModelSerializer):

    full_name = serializers.SerializerMethodField()

    productivity_percentage = serializers.SerializerMethodField()
    productive_time = serializers.SerializerMethodField()
    non_productive_time = serializers.SerializerMethodField()
    unproductive_time = serializers.SerializerMethodField()

    class Meta:

        model = User

        fields = [

            "id",

            "username",

            "full_name",

            "email",

            "role",

            "is_active",

            "productivity_percentage",

            "productive_time",

            "non_productive_time",

            "unproductive_time",

        ]

    def get_full_name(self, obj):

        return obj.get_full_name() or obj.username

    def get_productivity_percentage(self, obj):

        analytics = UserAnalytics.objects.filter(
            user=obj
        ).first()

        if analytics:

            total = (
                analytics.productive_time +
                analytics.non_productive_time +
                analytics.neutral_time
            )

            if total.total_seconds() > 0:

                return round(

                    analytics.productive_time.total_seconds()

                    * 100

                    / total.total_seconds(),

                    2,

                )

        return 0

    def get_productive_time(self, obj):

        analytics = UserAnalytics.objects.filter(
            user=obj
        ).first()

        if analytics:

            return str(analytics.productive_time)

        return "0:00:00"

    def get_non_productive_time(self, obj):

        analytics = UserAnalytics.objects.filter(
            user=obj
        ).first()

        if analytics:

            return str(analytics.non_productive_time)

        return "0:00:00"

    def get_unproductive_time(self, obj):

        return self.get_non_productive_time(obj)
class ActivityLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityLog
        fields = "__all__"

        read_only_fields = (
            "user",
            "start_time",
            "end_time",
            "duration",
            "is_active",
            "created_at",
        )
class AdminActivitySerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        source="user.username",
        read_only=True
    )

    email = serializers.EmailField(
        source="user.email",
        read_only=True
    )

    organization = serializers.CharField(
        source="user.organization.name",
        read_only=True
    )

    class Meta:
        model = ActivityLog
        fields = [
            "organization",
            "id",
            "username",
            "email",
            "website_name",
            "website_url",
            "favicon_url",
            "tab_title",
            "start_time",
            "end_time",
            "duration",
            "is_active",
        ]
class UserInactivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInactivity
        fields = "__all__"

        read_only_fields = (
            "user",
            "inactive_from",
            "active_again_at",
            "duration",
            "is_active",
            "created_at",
        )
class EmployeeDeactivationRequestSerializer(serializers.ModelSerializer):
    employee_name = serializers.SerializerMethodField()
    employee_email = serializers.EmailField(
        source="employee.email",
        read_only=True,
    )
    employee_status = serializers.BooleanField(
        source="employee.is_active",
        read_only=True,
    )

    class Meta:
        model = EmployeeDeactivationRequest
        fields = [
            "id",
            "employee",
            "employee_name",
            "employee_email",
            "employee_status",
            "organization",
            "reason",
            "status",
            "requested_at",
            "reviewed_at",
            "reviewed_by",
        ]

        read_only_fields = (
            "employee",
            "employee_name",
            "employee_email",
            "employee_status",
            "organization",
            "status",
            "requested_at",
            "reviewed_at",
            "reviewed_by",
        )

    def get_employee_name(self, obj):
        return obj.employee.get_full_name() or obj.employee.username
class OrganizationDeactivationRequestSerializer(serializers.ModelSerializer):

    organization = serializers.CharField(
        source="organization.name",
        read_only=True,
    )

    admin = serializers.EmailField(
        source="requested_by.email",
        read_only=True,
    )

    class Meta:
        model = OrganizationDeactivationRequest
        fields = [
            "id",
            "organization",
            "admin",
            "reason",
            "status",
            "requested_at",
            "reviewed_at",
        ]

        read_only_fields = [
            "organization",
            "admin",
            "status",
            "requested_at",
            "reviewed_at",
        ]


class NormalUserDeactivationRequestSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = NormalUserDeactivationRequest
        fields = [
            "id", "user", "email", "reason", "status", "requested_at",
            "reviewed_at", "reviewed_by",
        ]
        read_only_fields = [
            "user", "email", "status", "requested_at", "reviewed_at",
            "reviewed_by",
        ]
