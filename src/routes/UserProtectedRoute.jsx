import { useUserStore } from "../store/userStore";
import { Navigate } from "react-router-dom";

const UserProtectedRoute = ({ children }) => {
  const isUser = useUserStore((state) => state.isUser);

  return isUser ? children : <Navigate to="/login" replace />;
};

export default UserProtectedRoute;
