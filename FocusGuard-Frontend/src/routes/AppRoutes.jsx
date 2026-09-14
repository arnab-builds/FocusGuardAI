import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Landing from "../pages/Landing/Landing";
import PublicLanguageDefault from "../components/PublicLanguageDefault";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import EmployeeRegister from "../pages/Register/EmployeeRegister";
import DashboardLayout from "../layouts/DashboardLayout";
import RoleProtectedRoute from "./RoleProtectedRoute";
import OrganizationDashboardLayout from "../organization-admin/layouts/DashboardLayout";
import AdminLayout from "../super-admin/components/layout/AdminLayout";

const Dashboard = lazy(() => import("../pages/Dashboard/Dashboard"));
const Reminders = lazy(() => import("../pages/Reminders/Reminders"));
const Settings = lazy(() => import("../pages/Settings/Settings"));
const Reports = lazy(() => import("../pages/Reports/Reports"));
const AICoach = lazy(() => import("../pages/AICoach/AICoach"));
const Analytics = lazy(() => import("../pages/Analytics/Analytics"));
const ActivityLog = lazy(() => import("../pages/ActivityLog/ActivityLog"));
const Notifications = lazy(() => import("../pages/Notifications/Notifications"));
const FocusGoals = lazy(() => import("../pages/focus/FocusGoals"));
const OrgDashboard = lazy(() => import("../organization-admin/pages/Dashboard"));
const OrgEmployees = lazy(() => import("../organization-admin/pages/Employees"));
const OrgActivities = lazy(() => import("../organization-admin/pages/Activities"));
const OrgInviteEmployee = lazy(() => import("../organization-admin/pages/InviteEmployee"));
const OrgAnalytics = lazy(() => import("../organization-admin/pages/Analytics"));
const OrgNotifications = lazy(() => import("../organization-admin/pages/Notifications"));
const OrgRequests = lazy(() => import("../organization-admin/pages/Requests"));
const OrgSettings = lazy(() => import("../organization-admin/pages/Settings"));
const OrgAIAssistant = lazy(() => import("../organization-admin/pages/AIAssistant"));
const SuperDashboard = lazy(() => import("../super-admin/pages/dashboard/Dashboard"));
const Organizations = lazy(() => import("../super-admin/pages/organizations/Organizations"));
const OrganizationDetails = lazy(() => import("../super-admin/pages/organizations/OrganizationDetails"));
const Invitations = lazy(() => import("../super-admin/pages/invitations/Invitations"));
const SuperRequests = lazy(() => import("../super-admin/pages/requests/Requests"));
const SuperAnalytics = lazy(() => import("../super-admin/pages/analytics/Analytics"));
const SuperSettings = lazy(() => import("../super-admin/pages/settings/Settings"));
const NormalUsers = lazy(() => import("../super-admin/pages/normal-users/NormalUsers"));

function RouteLoading() {
  return (
    <div
      className="flex min-h-screen items-center justify-center text-slate-500"
      aria-busy="true"
    >
      Loading...
    </div>
  );
}

function ExtensionSessionBridge({ children }) {
  const [sessionReady] = useState(() => {
    const session = new URLSearchParams(window.location.hash.slice(1)).get("extension-session");
    if (!session) return true;

    try {
      const { access, refresh, user } = JSON.parse(decodeURIComponent(session));
      if (!access || !user) return true;
      localStorage.setItem("access", access);
      if (refresh) localStorage.setItem("refresh", refresh);
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      console.error("Unable to restore extension session.", error);
    }
    return true;
  });

  useEffect(() => {
    if (window.location.hash.includes("extension-session=")) {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }
  }, []);

  return sessionReady ? children : null;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <ExtensionSessionBridge>
        <Suspense fallback={<RouteLoading />}>
          <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/login"
          element={<PublicLanguageDefault><Login /></PublicLanguageDefault>}
        />
        <Route
          path="/register"
          element={<PublicLanguageDefault><Register /></PublicLanguageDefault>}
        />
        <Route
          path="/employee-register"
          element={<PublicLanguageDefault><EmployeeRegister /></PublicLanguageDefault>}
        />
        <Route
          element={<RoleProtectedRoute roles={["EMPLOYEE", "NORMAL_USER", "USER"]} />}
        >
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reminders" element={<Reminders />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/ai-coach" element={<AICoach />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/activity" element={<ActivityLog />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/focus-goals" element={<FocusGoals />} />
      </Route>
        </Route>
        <Route element={<RoleProtectedRoute roles={["SUB_ADMIN"]} />}>
          <Route element={<OrganizationDashboardLayout />}>
            <Route path="/organization-admin/dashboard" element={<OrgDashboard />} />
            <Route path="/organization-admin/employees" element={<OrgEmployees />} />
            <Route path="/organization-admin/activities" element={<OrgActivities />} />
            <Route path="/organization-admin/invite" element={<OrgInviteEmployee />} />
            <Route path="/organization-admin/analytics" element={<OrgAnalytics />} />
            <Route path="/organization-admin/notifications" element={<OrgNotifications />} />
            <Route path="/organization-admin/requests" element={<OrgRequests />} />
            <Route path="/organization-admin/settings" element={<OrgSettings />} />
            <Route path="/organization-admin/ai-assistant" element={<OrgAIAssistant />} />
          </Route>
        </Route>
        <Route element={<RoleProtectedRoute roles={["SUPER_ADMIN"]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/super-admin/dashboard" element={<SuperDashboard />} />
            <Route path="/super-admin/organizations" element={<Organizations />} />
            <Route path="/super-admin/organizations/:id" element={<OrganizationDetails />} />
            <Route path="/super-admin/invitations" element={<Invitations />} />
            <Route path="/super-admin/requests" element={<SuperRequests />} />
            <Route path="/super-admin/analytics" element={<SuperAnalytics />} />
            <Route path="/super-admin/settings" element={<SuperSettings />} />
            <Route path="/super-admin/normal-users" element={<NormalUsers />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </ExtensionSessionBridge>
    </BrowserRouter>
  );
}

export default AppRoutes;
