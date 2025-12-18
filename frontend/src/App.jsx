import { Route, Navigate, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute.jsx";
import DashboardLayout from "./components/DashboardLayout.jsx";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Tasks from "./pages/Tasks.jsx";
import Categories from "./pages/Categories.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

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
      </Route>

      <Route path="*" element={<div style={{ padding: 24 }}>404</div>} />
    </Routes>
  );
}
