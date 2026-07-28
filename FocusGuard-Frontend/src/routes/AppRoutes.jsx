import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login/Login";
import EmployeeRegister from "../pages/Register/EmployeeRegister";
import Dashboard from "../pages/Dashboard/Dashboard";
import Reminders from "../pages/Reminders/Reminders";
import Settings from "../pages/Settings/Settings";
import DashboardLayout from "../layouts/DashboardLayout";
import Reports from "../pages/Reports/Reports";
import AICoach from "../pages/AICoach/AICoach";
import Analytics from "../pages/Analytics/Analytics";
import ActivityLog from "../pages/ActivityLog/ActivityLog";
import Notifications from "../pages/Notifications/Notifications";
import FocusGoals from "../pages/focus/FocusGoals";


function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/" element={<Login />} />

        <Route path="/employee-register" element={<EmployeeRegister />} />

        {/* Dashboard Layout */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/ai-coach" element={<AICoach />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/activity" element={<ActivityLog />} />
          <Route path="/notifications" element={<Notifications />} />

          {/* Focus */}
          <Route path="/focus-goals" element={<FocusGoals />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
