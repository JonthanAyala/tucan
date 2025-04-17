import { Routes, Route, useLocation, Navigate, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import Index from "./components/Index";
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";
import EntrenadorDashboard from "./components/EntrenadorDashboard";
import DuenoDashboard from "./components/DuenoDashboard";
import NavBar from "./components/NavBar";
import NotFound from "./pages/404";
import Error500 from "./pages/500";
import ServerError from "./pages/500";
import Register from "./components/Register";
import Recuperar from "./components/Recuperar";
import ResetPassword from "./components/ResetPassword";
import { AnimatePresence } from "framer-motion";
import { logout } from "./services/authService";

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
      return decodedToken.rol || null;
    } catch (error) {
      return null;
    }
  }
  return null;
};

const LoginRedirect = ({ onLoginSuccess }) => {
  useEffect(() => {
    onLoginSuccess();
  }, [onLoginSuccess]);

  return null;
};

const AnimatedRoutes = ({ isLoggedIn, userRole, handleLoginSuccess, handleLogout }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/acceso-denegado" element={<Unauthorized />} />
        <Route path="/error-500" element={<Error500 />} />
        <Route path="/500" element={<ServerError />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recuperar" element={<Recuperar />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

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
    </AnimatePresence>
  );
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("accessToken")
  );
  const [userRole, setUserRole] = useState(() => getRoleFromToken());
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("accessToken"));
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
    <AnimatedRoutes
      isLoggedIn={isLoggedIn}
      userRole={userRole}
      handleLoginSuccess={handleLoginSuccess}
      handleLogout={handleLogout}
    />
  );
}

export default App;
