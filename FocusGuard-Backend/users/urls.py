from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    CustomLoginView,
    ProfileView,
    LogoutView,

    OrganizationCreateView,
    OrganizationMembersView,

    InvitationCreateView,
    OrganizationAdminRegisterWithInviteCodeView,
    EmployeeRegisterWithInviteCodeView,

    ActivityStartView,
    ActivityStopView,
    ActivityHistoryView,
    OrganizationActivityView,
    AdminActivityView,

    InactivityStartView,
    InactivityStopView,

    UserAnalyticsView,
    OrganizationAnalyticsView,
    SuperAdminAnalyticsView,
    DashboardTrendAPIView,

    EmployeeDeactivationRequestView,
    EmployeeDeactivationRequestListView,
    ApproveEmployeeDeactivationRequestView,
    RejectEmployeeDeactivationRequestView,

    OrganizationDeactivationRequestView,
    OrganizationDeactivationRequestListView,
    ApproveOrganizationDeactivationRequestView,
    RejectOrganizationDeactivationRequestView,

    SuperAdminDashboardView,
    SuperAdminOrganizationListView,
    SuperAdminOrganizationDetailView,
    SuperAdminOrganizationUpdateDeleteView,
    SuperAdminEmployeesSummaryView,
    SuperAdminAnalyticsAPIView,
    SuperAdminInvitationListView,
    SuperAdminInvitationDeleteView,
    SuperAdminSettingsView,
    SuperAdminLoginView,
)

urlpatterns = [

    # ==========================
    # Authentication
    # ==========================

    path(
        "organization-register/",
        OrganizationAdminRegisterWithInviteCodeView.as_view(),
        name="organization-register-with-invite-code",
    ),

    path(
        "employee-register/",
        EmployeeRegisterWithInviteCodeView.as_view(),
        name="employee-register-with-invite-code",
    ),

    path(
        "login/",
        CustomLoginView.as_view(),
        name="login",
    ),

    path(
        "logout/",
        LogoutView.as_view(),
        name="logout",
    ),

    path(
        "profile/",
        ProfileView.as_view(),
        name="profile",
    ),

    path(
        "token/refresh/",
        TokenRefreshView.as_view(),
        name="token-refresh",
    ),

    # ==========================
    # Organization
    # ==========================

    path(
        "organization/create/",
        OrganizationCreateView.as_view(),
        name="organization-create",
    ),

    path(
        "organization/members/",
        OrganizationMembersView.as_view(),
        name="organization-members",
    ),

    # ==========================
    # Invitation
    # ==========================

    path(
        "invitation/create/",
        InvitationCreateView.as_view(),
        name="invitation-create",
    ),

    # ==========================
    # Activity
    # ==========================

    path(
        "activity/start/",
        ActivityStartView.as_view(),
        name="activity-start",
    ),

    path(
        "activity/stop/",
        ActivityStopView.as_view(),
        name="activity-stop",
    ),

    path(
        "activity/history/",
        ActivityHistoryView.as_view(),
        name="activity-history",
    ),

    # ==========================
    # Inactivity
    # ==========================

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

    # ==========================
    # Activity Admin
    # ==========================

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

    # ==========================
    # Analytics
    # ==========================

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
        "dashboard/trend/",
        DashboardTrendAPIView.as_view(),
        name="dashboard-trend",
    ),

    # ==========================
    # Employee Deactivation
    # ==========================

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

    # ==========================
    # Organization Deactivation
    # ==========================

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

    # ==========================
    # Super Admin
    # ==========================

    path(
        "super-admin/login/",
        SuperAdminLoginView.as_view(),
        name="super-admin-login",
    ),

    path(
        "super-admin/dashboard/",
        SuperAdminDashboardView.as_view(),
        name="super-admin-dashboard",
    ),

    path(
        "super-admin/organizations/",
        SuperAdminOrganizationListView.as_view(),
        name="super-admin-organizations",
    ),

    path(
        "super-admin/organizations/create/",
        OrganizationCreateView.as_view(),
        name="super-admin-create-organization",
    ),

    path(
        "super-admin/organizations/<int:organization_id>/",
        SuperAdminOrganizationDetailView.as_view(),
        name="super-admin-organization-detail",
    ),

    path(
        "super-admin/organizations/<int:organization_id>/manage/",
        SuperAdminOrganizationUpdateDeleteView.as_view(),
        name="super-admin-organization-manage",
    ),

    path(
        "super-admin/organizations/<int:organization_id>/employees/",
        SuperAdminEmployeesSummaryView.as_view(),
        name="super-admin-employees-summary",
    ),

    path(
        "super-admin/analytics/",
        SuperAdminAnalyticsAPIView.as_view(),
        name="super-admin-analytics",
    ),

    path(
        "super-admin/invitations/",
        SuperAdminInvitationListView.as_view(),
        name="super-admin-invitations",
    ),

    path(
        "super-admin/invitations/<int:invitation_id>/",
        SuperAdminInvitationDeleteView.as_view(),
        name="super-admin-delete-invitation",
    ),

    path(
        "super-admin/settings/",
        SuperAdminSettingsView.as_view(),
        name="super-admin-settings",
    ),
]
