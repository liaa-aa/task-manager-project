import { Navigate, useLocation } from "react-router-dom";
import { getSession } from "../lib/api.js";

export default function RequireAuth({ children }) {
  const location = useLocation();
  const session = getSession();
  const token = session?.token;

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
