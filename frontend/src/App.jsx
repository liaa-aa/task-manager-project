import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";

import HomePublic from "./pages/HomePublic.jsx";
import HomePrivate from "./pages/HomePrivate.jsx";
import AddTask from "./pages/AddTask.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import TaskDetail from "./pages/TaskDetail.jsx";

import RequireAuth from "./components/RequireAuth.jsx";

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* default landing */}
        <Route path="/" element={<HomePublic />} />

        {/* auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* private */}
        <Route
          path="/home"
          element={
            <RequireAuth>
              <HomePrivate />
            </RequireAuth>
          }
        />
        <Route
          path="/add"
          element={
            <RequireAuth>
              <AddTask />
            </RequireAuth>
          }
        />
        <Route
          path="/task/:id"
          element={
            <RequireAuth>
              <TaskDetail />
            </RequireAuth>
          }
        />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
