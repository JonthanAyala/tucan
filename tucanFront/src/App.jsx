import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { useEffect } from "react";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import Index from "./components/Index";
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";
import EntrenadorDashboard from "./components/EntrenadorDashboard";
import DuenoDashboard from "./components/DuenoDashboard";
import { logout } from "./services/authService";
import NavBar from "./components/NavBar";
import NotFound from "./pages/404";
import Error500 from "./pages/500";
import ServerError from "./pages/500";
import Register from "./components/Register";

const ProtectedRoute = ({ isLoggedIn, userRole, allowedRoles, children }) => {
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/acceso-denegado" replace />;
  }

  return children;
};

const Unauthorized = () => (
  <div style={{ padding: "50px", textAlign: "center" }}>
    <h1>403 - Acceso Denegado</h1>
    <p>No tienes los permisos necesarios para ver esta página.</p>
  </div>
);

const getRoleFromToken = () => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      if (decodedToken && decodedToken.rol) {
        return decodedToken.rol;
      } else {
        return null;
      }
    } catch (error) {
      void error;
      return null;
    }
  } else {
    return null;
  }
};
function LoginRedirect({ onLoginSuccess }) {
  useEffect(() => {
    onLoginSuccess();
  }, [onLoginSuccess]);
  return null;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("accessToken")
  );
  const [userRole, setUserRole] = useState(() => getRoleFromToken());
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      const loggedIn = !!localStorage.getItem("accessToken");
      setIsLoggedIn(loggedIn);
      setUserRole(getRoleFromToken());
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    const role = getRoleFromToken();
    setUserRole(role);
    switch (role) {
      case "admin":
        navigate("/Administracion");
        break;
      case "presidente":
        navigate("/Propietarios");
        break;
      case "entrenador":
        navigate("/Entrenadores");
        break;
      default:
        navigate("/acceso-denegado");
    }
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setUserRole(null);
  };

  return (
    <Routes>
      <Route path="/" element={<Index />} />

      <Route path="/acceso-denegado" element={<Unauthorized />} />
      <Route path="/error-500" element={<Error500 />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/500" element={<ServerError />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/login"
        element={
          isLoggedIn ? (
            <LoginRedirect onLoginSuccess={handleLoginSuccess} />
          ) : (
            <Login onLoginSuccess={handleLoginSuccess} />
          )
        }
      />

      {/* <Route path="/reset-password" element={<PasswordResetRequest />} />
        <Route path="/reset-password/:uidb64/:token" element={<PasswordResetConfirm />} />
         */}

      <Route
        path="/Administracion"
        element={
          <ProtectedRoute
            isLoggedIn={isLoggedIn}
            userRole={userRole}
            allowedRoles={["admin"]}
          >
            <div className="vh-100 d-flex flex-column">
              <NavBar handleLogout={handleLogout} />
              <AdminDashboard />
            </div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/Propietarios"
        element={
          <ProtectedRoute
            isLoggedIn={isLoggedIn}
            userRole={userRole}
            allowedRoles={["presidente"]}
          >
            <DuenoDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Entrenadores"
        element={
          <ProtectedRoute
            isLoggedIn={isLoggedIn}
            userRole={userRole}
            allowedRoles={["entrenador"]}
          >
            <div className="vh-100 d-flex flex-column">
              <NavBar handleLogout={handleLogout} />
              <EntrenadorDashboard />
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
