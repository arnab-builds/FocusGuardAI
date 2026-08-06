import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Landing from "../pages/Landing/Landing";
import PublicLanguageDefault from "../components/PublicLanguageDefault";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import EmployeeRegister from "../pages/Register/EmployeeRegister";
import Dashboard from "../pages/Dashboard/Dashboard";
import Reminders from "../pages/Reminders/Reminders";
import Settings from "../pages/Settings/Settings";
import Reports from "../pages/Reports/Reports";
import AICoach from "../pages/AICoach/AICoach";
import Analytics from "../pages/Analytics/Analytics";
import ActivityLog from "../pages/ActivityLog/ActivityLog";
import Notifications from "../pages/Notifications/Notifications";
import FocusGoals from "../pages/focus/FocusGoals";
import DashboardLayout from "../layouts/DashboardLayout";
import RoleProtectedRoute from "./RoleProtectedRoute";
import OrgDashboard from "../organization-admin/pages/Dashboard";
import OrgEmployees from "../organization-admin/pages/Employees";
import OrgActivities from "../organization-admin/pages/Activities";
import OrgInviteEmployee from "../organization-admin/pages/InviteEmployee";
import OrgAnalytics from "../organization-admin/pages/Analytics";
import OrgNotifications from "../organization-admin/pages/Notifications";
import OrgRequests from "../organization-admin/pages/Requests";
import OrgSettings from "../organization-admin/pages/Settings";
import OrgAIAssistant from "../organization-admin/pages/AIAssistant";
import SuperDashboard from "../super-admin/pages/dashboard/Dashboard";
import Organizations from "../super-admin/pages/organizations/Organizations";
import OrganizationDetails from "../super-admin/pages/organizations/OrganizationDetails";
import Invitations from "../super-admin/pages/invitations/Invitations";
import SuperRequests from "../super-admin/pages/requests/Requests";
import SuperAnalytics from "../super-admin/pages/analytics/Analytics";
import SuperSettings from "../super-admin/pages/settings/Settings";
import NormalUsers from "../super-admin/pages/normal-users/NormalUsers";

function AppRoutes() {
  return (
    <BrowserRouter>
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
        <Route element={<RoleProtectedRoute roles={["SUPER_ADMIN"]} />}>
          <Route path="/super-admin/dashboard" element={<SuperDashboard />} />
          <Route path="/super-admin/organizations" element={<Organizations />} />
          <Route path="/super-admin/organizations/:id" element={<OrganizationDetails />} />
          <Route path="/super-admin/invitations" element={<Invitations />} />
          <Route path="/super-admin/requests" element={<SuperRequests />} />
          <Route path="/super-admin/analytics" element={<SuperAnalytics />} />
          <Route path="/super-admin/settings" element={<SuperSettings />} />
          <Route path="/super-admin/normal-users" element={<NormalUsers />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
