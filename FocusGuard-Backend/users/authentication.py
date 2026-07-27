from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed


class FocusGuardJWTAuthentication(JWTAuthentication):

    def get_user(self, validated_token):

        user = super().get_user(validated_token)

        if not user.is_active:
            raise AuthenticationFailed(
                "Your account has been deactivated."
            )

        if (
            user.role != "SUPER_ADMIN"
            and user.organization
            and not user.organization.is_active
        ):
            raise AuthenticationFailed(
                "Your organization has been deactivated."
            )

        return user