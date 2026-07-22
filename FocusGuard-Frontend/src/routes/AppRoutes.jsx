import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Notifications from "../pages/Notifications/Notifications"; // ✅ Add this
import Settings from "../pages/Settings/Settings";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/notifications" element={<Notifications />} /> {/* ✅ Add this */}
        <Route path="/settings" element={<Settings />} /> {/* ✅ Add this */}
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;