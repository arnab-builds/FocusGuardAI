import API from "./api";

export const getDashboard = () =>
  API.get("super-admin/dashboard/");

// Organizations

export const getOrganizations = () =>
  API.get("super-admin/organizations/");

export const createOrganization = (data) =>
  API.post(
    "super-admin/organizations/create/",
    data
  );

export const getOrganization = (id) =>
  API.get(
    `super-admin/organizations/${id}/`
  );

export const updateOrganization = (
  id,
  data
) =>
  API.put(
    `super-admin/organizations/${id}/manage/`,
    data
  );

export const deleteOrganization = (id) =>
  API.delete(
    `super-admin/organizations/${id}/manage/`
  );

// Invitations

export const getInvitations = () =>
  API.get("super-admin/invitations/");

export const deleteInvitation = (id) =>
  API.delete(
    `super-admin/invitations/${id}/`
  );

  export const getOrganizationDeactivationRequests = () =>
  API.get(
    "organization/deactivation-requests/"
  );

export const approveOrganizationDeactivation = (id) =>
  API.post(
    `organization/deactivation-request/${id}/approve/`
  );

export const rejectOrganizationDeactivation = (id) =>
  API.post(
    `organization/deactivation-request/${id}/reject/`
  );
  export const getAnalytics = () =>
  API.get("super-admin/analytics/");
  // Settings

export const getSettings = () =>
  API.get("super-admin/settings/");

export const updateSettings = (data) =>
  API.put(
    "super-admin/settings/",
    data
  );
  // ============================
// Admin Notifications
// ============================

export const getAdminNotifications = () =>
  API.get("admin-notifications/");

export const getUnreadNotificationCount = () =>
  API.get("admin-notifications/unread-count/");

export const markNotificationRead = (id) =>
  API.post(
    `admin-notifications/${id}/read/`
  );

export const markAllNotificationsRead = () =>
  API.post(
    "admin-notifications/read-all/"
  );