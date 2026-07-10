from django.urls import path
from .views import (
    ActivityStartView,
    AdminActivityView,
    ApproveOrganizationDeactivationRequestView,
    EmployeeDeactivationRequestView,
    InactivityStopView,
    OrganizationActivityView,
    OrganizationAnalyticsView,
    OrganizationDeactivationRequestListView,
    OrganizationDeactivationRequestView,
    OrganizationMembersView,
    RegisterView,
    CustomLoginView,
    ProfileView,
    LogoutView,
    OrganizationCreateView,
    InvitationCreateView,
    AcceptInvitationView,
    ActivityHistoryView,
    InactivityStartView,
    RejectEmployeeDeactivationRequestView,
    RejectOrganizationDeactivationRequestView,
    SuperAdminAnalyticsView,
    UserAnalyticsView,
    EmployeeDeactivationRequestListView,
    ApproveEmployeeDeactivationRequestView,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", CustomLoginView.as_view(), name="login"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path(
        "organization/create/",
        OrganizationCreateView.as_view(),
        name="organization-create",
    ),
    path(
        "invitation/create/",
        InvitationCreateView.as_view(),
        name="invitation-create",
    ),
    path(
        "invitation/accept/",
        AcceptInvitationView.as_view(),
        name="invitation-accept",
    ),
    path(
    "organization/members/",
    OrganizationMembersView.as_view(),
    name="organization-members",
),
path(
    "activity/start/",
    ActivityStartView.as_view(),
    name="activity-start",
),
path(
    "activity/history/",
    ActivityHistoryView.as_view(),
    name="activity-history",
),
path(
    "organization/activity/",
    OrganizationActivityView.as_view(),
    name="organization-activity",
),
path(
    "admin/activity/",
    AdminActivityView.as_view(),
    name="admin-activity",
),
path(
    "inactivity/start/",
    InactivityStartView.as_view(),
    name="inactivity-start",
),

path(
    "inactivity/stop/",
    InactivityStopView.as_view(),
    name="inactivity-stop",
),
path(
    "analytics/",
    UserAnalyticsView.as_view(),
    name="user-analytics",
),

path(
    "organization/analytics/",
    OrganizationAnalyticsView.as_view(),
    name="organization-analytics",
),

path(
    "superadmin/analytics/",
    SuperAdminAnalyticsView.as_view(),
    name="superadmin-analytics",
),
path(
    "employee/deactivation-request/",
    EmployeeDeactivationRequestView.as_view(),
    name="employee-deactivation-request",
),
path(
    "employee/deactivation-request/",
    EmployeeDeactivationRequestView.as_view(),
    name="employee-deactivation-request",
),

path(
    "employee/deactivation-requests/",
    EmployeeDeactivationRequestListView.as_view(),
    name="employee-deactivation-requests",
),

path(
    "employee/deactivation-request/<int:request_id>/approve/",
    ApproveEmployeeDeactivationRequestView.as_view(),
    name="approve-employee-deactivation-request",
),

path(
    "employee/deactivation-request/<int:request_id>/reject/",
    RejectEmployeeDeactivationRequestView.as_view(),
    name="reject-employee-deactivation-request",
),
path(
    "organization/deactivation-request/",
    OrganizationDeactivationRequestView.as_view(),
    name="organization-deactivation-request",
),

path(
    "organization/deactivation-requests/",
    OrganizationDeactivationRequestListView.as_view(),
    name="organization-deactivation-requests",
),

path(
    "organization/deactivation-request/<int:request_id>/approve/",
    ApproveOrganizationDeactivationRequestView.as_view(),
    name="approve-organization-deactivation-request",
),

path(
    "organization/deactivation-request/<int:request_id>/reject/",
        RejectOrganizationDeactivationRequestView.as_view(),
    name="reject-organization-deactivation-request",
),
]