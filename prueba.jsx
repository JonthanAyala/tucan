

import jwt_decode from "jwt-decode";

const token = localStorage.getItem("access_token");
if (token) {
  const decoded = jwt_decode(token);
  console.log("Rol del usuario:", decoded.rol);
}

import { Navigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const token = localStorage.getItem("access_token");

  if (!token) return <Navigate to="/login" />;

  try {
    const decoded = jwt_decode(token);
    const userRole = decoded.rol;
    const isExpired = decoded.exp * 1000 < Date.now();

    if (isExpired) {
      localStorage.removeItem("access_token");
      return <Navigate to="/login" />;
    }

    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/unauthorized" />;
    }

    return children;

  } catch (e) {
    console.error("Token inválido", e);
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;
