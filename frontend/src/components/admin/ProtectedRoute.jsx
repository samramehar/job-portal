import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    // if user is not logged in, redirect to home
    if (!user) {
      navigate("/");
      return;
    }

    // if allowedRoles is provided and user's role is not in it, redirect
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      navigate("/");
      return;
    }
  }, [user, allowedRoles, navigate]);

  return <>{children}</>;
};

export default ProtectedRoute;
