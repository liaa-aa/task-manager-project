import { Navigate } from "react-router-dom";
import { useApp } from "../data/AppProvider.jsx";

export default function RequireAuth({ children }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
