import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import OrganizationRegister from "../pages/OrganizationRegister";

import Dashboard from "../pages/Dashboard";
import Activities from "../pages/Activities";
import Employees from "../pages/Employees";
import InviteEmployee from "../pages/InviteEmployee";
import Analytics from "../pages/Analytics";
import Notifications from "../pages/Notifications";
import Requests from "../pages/Requests";
import Settings from "../pages/Settings";
import AIAssistant from "../pages/AIAssistant";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
    return (
        <Routes>

            <Route
                path="/"
                element={<Navigate to="/login" replace />}
            />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/organization-register"
                element={<OrganizationRegister />}
            />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/employees"
                element={
                    <ProtectedRoute>
                        <Employees />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/activities"
                element={
                    <ProtectedRoute>
                        <Activities />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/invite"
                element={
                    <ProtectedRoute>
                        <InviteEmployee />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/analytics"
                element={
                    <ProtectedRoute>
                        <Analytics />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/notifications"
                element={
                    <ProtectedRoute>
                        <Notifications />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/requests"
                element={
                    <ProtectedRoute>
                        <Requests />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/settings"
                element={
                    <ProtectedRoute>
                        <Settings />
                    </ProtectedRoute>
                }
            />
            <Route
           path="/ai-assistant"
          element={
          <ProtectedRoute>
            <AIAssistant />
         </ProtectedRoute>
    }
/>

        </Routes>
    );
}

export default AppRoutes;
