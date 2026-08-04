import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";

import Dashboard from "../pages/dashboard/Dashboard";
import Organizations from "../pages/organizations/Organizations";
import OrganizationDetails from "../pages/organizations/OrganizationDetails";
import Invitations from "../pages/invitations/Invitations";
import Requests from "../pages/requests/Requests";
import Analytics from "../pages/analytics/Analytics";
import Settings from "../pages/settings/Settings";
import NormalUsers from "../pages/normal-users/NormalUsers";

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
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/organizations"
        element={
          <ProtectedRoute>
            <Organizations />
          </ProtectedRoute>
        }
      />

      <Route
        path="/organizations/:id"
        element={
          <ProtectedRoute>
            <OrganizationDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/invitations"
        element={
          <ProtectedRoute>
            <Invitations />
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
        path="/analytics"
        element={
          <ProtectedRoute>
            <Analytics />
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
        path="/normal-users"
        element={
          <ProtectedRoute>
            <NormalUsers />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default AppRoutes;
