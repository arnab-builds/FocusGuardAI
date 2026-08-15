from datetime import timedelta

from django.contrib.auth.models import AbstractUser
from django.db import models
import random
import string


class Language(models.Model):
    language_name = models.CharField(max_length=100, unique=True)
    native_name = models.CharField(max_length=100)
    language_code = models.CharField(max_length=10, unique=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["language_name"]

    def __str__(self):
        return f"{self.language_name} ({self.language_code})"


class Translation(models.Model):
    language = models.ForeignKey(
        Language,
        on_delete=models.CASCADE,
        related_name="translations",
    )
    key = models.CharField(max_length=255)
    translated_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["key", "language__language_name"]
        constraints = [
            models.UniqueConstraint(
                fields=["language", "key"],
                name="unique_translation_per_language",
            )
        ]

    def __str__(self):
        return f"{self.key} ({self.language.language_code})"


class RuntimeTranslation(models.Model):
    """Persistent cache for provider-translated, non-catalog text."""

    source_digest = models.CharField(max_length=64)
    source_text = models.TextField()
    target_language_code = models.CharField(max_length=10)
    translated_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["source_digest", "target_language_code"],
                name="unique_runtime_translation_per_language",
            )
        ]

    def __str__(self):
        return f"{self.target_language_code}: {self.source_text[:50]}"


class Organization(models.Model):
    name = models.CharField(max_length=255)

    email = models.EmailField(
        blank=True,
        null=True,
    )

    address = models.TextField(
        blank=True,
        null=True,
    )

    contact_number = models.CharField(
        max_length=20,
        blank=True,
        null=True,
    )

    max_employees = models.PositiveIntegerField(
        default=50,
    )

    owner = models.ForeignKey(
        "User",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="owned_organizations",
    )

    created_at = models.DateTimeField(auto_now_add=True)

    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class User(AbstractUser):

    ROLE_CHOICES = [
        ("SUPER_ADMIN", "Super Admin"),
        ("SUB_ADMIN", "Organization Admin"),
        ("USER", "Employee"),
        ("NORMAL_USER", "Normal User"),
    ]

    # Closed accounts are retained for audit/history, but only an active
    # account may reserve an email address. This permits a new registration
    # after an approved deactivation without reactivating the old account.
    email = models.EmailField()
    # Preserve the original identifier when a closed account's unique Django
    # username is released for a new active registration.
    closed_username = models.CharField(
        max_length=150,
        blank=True,
        null=True,
        editable=False,
    )

    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )

    preferred_language = models.ForeignKey(
        Language,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="users",
    )

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default="USER",
    )

    class Meta:
        verbose_name = "user"
        verbose_name_plural = "users"
        constraints = [
            models.UniqueConstraint(
                fields=["email"],
                condition=models.Q(is_active=True),
                name="unique_active_user_email",
            ),
        ]

    def __str__(self):
        return self.display_username

    @property
    def display_username(self):
        """Name safe to show outside the authentication/database layer."""
        return self.closed_username or self.username


import random
import string

class Invitation(models.Model):
    # Invitations are historical records. A previous invitation must not
    # prevent a newly created organization from inviting an email again.
    email = models.EmailField()

    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
    )

    invited_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )

    role = models.CharField(
        max_length=20,
        choices=User.ROLE_CHOICES,
    )

    token = models.CharField(
        max_length=255,
        unique=True,
    )

    invite_code = models.CharField(
        max_length=15,
        unique=True,
        editable=False,
    )

    is_accepted = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def generate_invite_code(self):
        while True:
            code = "FGA-" + "".join(
                random.choices(
                    string.ascii_uppercase + string.digits,
                    k=8,
                )
            )

            if not Invitation.objects.filter(
                invite_code=code
            ).exists():
                return code

    def save(self, *args, **kwargs):
        if not self.invite_code:
            self.invite_code = self.generate_invite_code()

        super().save(*args, **kwargs)

    def __str__(self):
        return self.email
class ActivityLog(models.Model):
    user = models.ForeignKey(
        "User",
        on_delete=models.CASCADE,
        related_name="activity_logs"
    )

    website_name = models.CharField(max_length=255)

    tab_title = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )
    website_url = models.URLField(
    max_length=500,
    blank=True,
    null=True
)

    favicon_url = models.URLField(
        max_length=1000,
        blank=True,
        null=True,
    )

    category = models.CharField(
    max_length=100,
    blank=True,
    null=True
)

    PRODUCTIVITY_TYPES = [
        ("PRODUCTIVE", "Productive"),
        ("NON_PRODUCTIVE", "Non Productive"),
        ("NEUTRAL", "Neutral"),
    ]

    productivity_type = models.CharField(
        max_length=20,
        choices=PRODUCTIVITY_TYPES,
        default="NEUTRAL",
    )

    start_time = models.DateTimeField()

    end_time = models.DateTimeField(
        blank=True,
        null=True
    )

    duration = models.DurationField(
        blank=True,
        null=True
    )

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.website_name}"
class UserInactivity(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="inactivity_logs"
    )

    website_name = models.CharField(
        max_length=255,
        blank=True,
        default=""
    )

    website_url = models.URLField(
        blank=True,
        default=""
    )

    tab_title = models.CharField(
        max_length=500,
        blank=True,
        default=""
    )

    inactive_from = models.DateTimeField()

    active_again_at = models.DateTimeField(
        null=True,
        blank=True
    )

    duration = models.DurationField(
        null=True,
        blank=True
    )

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - Inactive"

class EmployeeDeactivationRequest(models.Model):

    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("APPROVED", "Approved"),
        ("REJECTED", "Rejected"),
    ]

    employee = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="deactivation_requests"
    )

    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE
    )

    reason = models.TextField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="PENDING"
    )

    requested_at = models.DateTimeField(auto_now_add=True)

    reviewed_at = models.DateTimeField(
        null=True,
        blank=True
    )

    reviewed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="reviewed_deactivation_requests"
    )

    def __str__(self):
        return f"{self.employee.username} - {self.status}"

class OrganizationDeactivationRequest(models.Model):

    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("APPROVED", "Approved"),
        ("REJECTED", "Rejected"),
    ]

    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name="deactivation_requests"
    )

    requested_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="organization_deactivation_requests"
    )

    reason = models.TextField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="PENDING"
    )

    requested_at = models.DateTimeField(auto_now_add=True)

    reviewed_at = models.DateTimeField(
        null=True,
        blank=True
    )

    reviewed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="reviewed_organization_requests"
    )

    def __str__(self):
        return f"{self.organization.name} - {self.status}"


class NormalUserDeactivationRequest(models.Model):

    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("APPROVED", "Approved"),
        ("REJECTED", "Rejected"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="normal_user_deactivation_requests",
    )
    reason = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="PENDING")
    requested_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    reviewed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="reviewed_normal_user_deactivation_requests",
    )

    def __str__(self):
        return f"{self.user.email} - {self.status}"
    
class UserAnalytics(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="analytics"
    )

    productive_time = models.DurationField(default=timedelta)

    non_productive_time = models.DurationField(default=timedelta)

    neutral_time = models.DurationField(default=timedelta)

    idle_time = models.DurationField(default=timedelta)

    websites_visited = models.PositiveIntegerField(default=0)

    tab_switches = models.PositiveIntegerField(default=0)

    generated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} Analytics"
