import { useAuth } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const PrivateRoute = ({ role, requiredPermissions = [], children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Show loading state
  if (loading || isRedirecting) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Not authenticated → redirect to login with intended location
  if (!isAuthenticated) {
    setIsRedirecting(true);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Authenticated but user data missing (unexpected error)
  if (!user) {
    setIsRedirecting(true);
    return <Navigate to="/error" state={{ error: "User data not available" }} replace />;
  }

  // Role check
  if (role && user.role !== role) {
    setIsRedirecting(true);
    return <Navigate to="/unauthorized" replace />;
  }

  // Optional: Check for specific permissions if needed
  if (requiredPermissions.length > 0 && 
      !requiredPermissions.every(perm => user.permissions?.includes(perm))) {
    setIsRedirecting(true);
    return <Navigate to="/unauthorized" replace />;
  }

  // All checks passed → render the children
  return children;
};

export default PrivateRoute;