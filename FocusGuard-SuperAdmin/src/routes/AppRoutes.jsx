import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";

import Dashboard from "../pages/Dashboard/Dashboard";
import Organizations from "../pages/Organizations/Organizations";
import OrganizationDetails from "../pages/Organizations/OrganizationDetails";
import Invitations from "../pages/Invitations/Invitations";
import Requests from "../pages/Requests/Requests";
import Analytics from "../pages/Analytics/Analytics";
import Settings from "../pages/Settings/Settings";

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

    </Routes>
  );
}

export default AppRoutes;