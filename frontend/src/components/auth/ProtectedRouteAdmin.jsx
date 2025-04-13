import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRouteAdmin = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const isAdmin = user.role === "admin";

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!isAdmin) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRouteAdmin;
