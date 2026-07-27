from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import EmployeeDeactivationRequest, OrganizationDeactivationRequest, User, Organization, Invitation, ActivityLog, UserInactivity

from .models import User, Organization, Invitation


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        validators=[
            UniqueValidator(
                queryset=User.objects.all(),
                message="User already exists."
            )
        ]
    )

    class Meta:
        model = User
        fields = ["username", "email", "password"]
        extra_kwargs = {
            "password": {"write_only": True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"]
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


class RegisterWithInviteCodeSerializer(serializers.Serializer):

    username = serializers.CharField(
        max_length=150
    )

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

class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "role",
        ]
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

    class Meta:
        model = EmployeeDeactivationRequest
        fields = "__all__"

        read_only_fields = (
            "employee",
            "organization",
            "status",
            "requested_at",
            "reviewed_at",
            "reviewed_by",
        )
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