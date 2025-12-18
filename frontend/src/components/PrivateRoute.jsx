import { Navigate, useLocation } from "react-router-dom";
import { getSession } from "../services/auth.service.js";

export default function PrivateRoute({ children }) {
  const location = useLocation();
  const session = getSession();
  if (!session?.token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}
