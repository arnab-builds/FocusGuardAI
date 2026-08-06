import { Navigate, Outlet } from "react-router-dom";

const dashboardByRole = {
  SUPER_ADMIN: "/super-admin/dashboard",
  SUB_ADMIN: "/organization-admin/dashboard",
  EMPLOYEE: "/dashboard",
  NORMAL_USER: "/dashboard",
  USER: "/dashboard",
};

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

export function getRoleDashboard(role) {
  return dashboardByRole[role] || "/login";
}

export default function RoleProtectedRoute({ roles }) {
  const access = localStorage.getItem("access");
  const user = getStoredUser();

  if (!access || !user?.role) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(user.role)) {
    return <Navigate to={getRoleDashboard(user.role)} replace />;
  }

  return <Outlet />;
}
