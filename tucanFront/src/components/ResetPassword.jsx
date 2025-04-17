import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const response = await fetch("http://127.0.0.1:8000/usuarios/reset-password/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ token, password }),
    });

    const data = await response.json();
    setLoading(false);

    if (response.ok) {
      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: data.message,
        confirmButtonColor: "#3085d6",
      });
      setTimeout(() => navigate("/login"), 2000);
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: data.error || "Algo salió mal. Intenta de nuevo.",
      });
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" style={{ width: "4rem", height: "4rem" }} role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="d-flex justify-content-center align-items-center vh-100"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
      exit={{ opacity: 0, y: -50, transition: { duration: 0.5 } }}
    >
      <div className="card shadow p-4" style={{ maxWidth: "450px", width: "100%", borderRadius: "20px" }}>
        <h3 className="text-center mb-3">🔐 Restablecer Contraseña</h3>
        <p className="text-center text-muted">Ingresa tu nueva contraseña</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              className="form-control"
              type="password"
              placeholder="Nueva contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="btn btn-primary w-100 mb-2" type="submit">
            Restablecer contraseña
          </button>
        </form>
        <Link
          to="/login"
          className="btn btn-outline-secondary w-100"
          style={{ borderRadius: '30px', fontWeight: '500' }}
        >
          <i className="bi bi-arrow-left me-2"></i> Volver al Login
        </Link>
      </div>
    </motion.div>
  );
};

export default ResetPassword;
