from datetime import timedelta

from django.contrib.auth.models import AbstractUser
from django.db import models



class Organization(models.Model):
    name = models.CharField(max_length=255)
    address = models.TextField(blank=True, null=True)

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
    ]

    email = models.EmailField(unique=True)

    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default="USER",
    )

    def __str__(self):
        return self.username


class Invitation(models.Model):
    email = models.EmailField(unique=True)

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

    is_accepted = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

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

    category = models.CharField(
    max_length=100,
    blank=True,
    null=True
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
    
class UserAnalytics(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="analytics"
    )

    productive_time = models.DurationField(default=timedelta)

    non_productive_time = models.DurationField(default=timedelta)

    idle_time = models.DurationField(default=timedelta)

    websites_visited = models.PositiveIntegerField(default=0)

    tab_switches = models.PositiveIntegerField(default=0)

    generated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} Analytics"