import { Routes, Route, Navigate } from "react-router-dom";

// layout & route guard
import PrivateRoute from "./components/PrivateRoute.jsx";
import DashboardLayout from "./components/DashboardLayout.jsx";

// auth pages
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

// main pages
import Dashboard from "./pages/Dashboard.jsx";
import Tasks from "./pages/Tasks.jsx";
import Categories from "./pages/Categories.jsx";

// master data pages (UI only dulu)
import Statuses from "./pages/Statuses.jsx";
import Priorities from "./pages/Priorities.jsx";

export default function App() {
  return (
    <Routes>
      {/* redirect root */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* protected routes with layout */}
      <Route
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/categories" element={<Categories />} />

        {/* master data */}
        <Route path="/statuses" element={<Statuses />} />
        <Route path="/priorities" element={<Priorities />} />
      </Route>

      {/* fallback */}
      <Route path="*" element={<div style={{ padding: 24 }}>404 - Page Not Found</div>} />
    </Routes>
  );
}
