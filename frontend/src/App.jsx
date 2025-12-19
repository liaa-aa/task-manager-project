import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import HomePublic from "./pages/HomePublic.jsx";
import HomePrivate from "./pages/HomePrivate.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import RequireAuth from "./components/RequireAuth.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-base">
      <Navbar />

      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePublic />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Private */}
        <Route
          path="/home"
          element={
            <RequireAuth>
              <HomePrivate />
            </RequireAuth>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
