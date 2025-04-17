import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validarPasswordFuerte = (password) => {
    const regex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])[A-Za-z\d!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "Las contraseñas no coinciden",
        text: "Por favor asegúrate de que ambas contraseñas sean iguales.",
      });
      return;
    }

    if (!validarPasswordFuerte(password)) {
      Swal.fire({
        icon: "error",
        title: "Contraseña débil",
        html: `
          Tu contraseña debe tener al menos:
          <ul style="text-align: left; margin-top: 10px;">
            <li>8 caracteres</li>
            <li>1 letra mayúscula</li>
            <li>1 número</li>
            <li>1 carácter especial</li>
          </ul>
        `,
      });
      return;
    }

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
        title: "¡Contraseña restablecida!",
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
      className="d-flex justify-content-center align-items-center vh-100 bg-light"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
      exit={{ opacity: 0, y: -50, transition: { duration: 0.5 } }}
    >
      <div
        className="card shadow-lg p-5"
        style={{
          maxWidth: "500px",
          width: "100%",
          borderRadius: "20px",
        }}
      >
        <h3 className="text-center mb-4">🔐 Restablecer Contraseña</h3>
        <p className="text-center text-muted mb-5">
          Ingresa y confirma tu nueva contraseña
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label">Nueva contraseña</label>
            <input
              className="form-control form-control-lg"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-5">
            <label className="form-label">Confirmar contraseña</label>
            <input
              className="form-control form-control-lg"
              type="password"
              placeholder="********"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button className="btn btn-primary w-100 py-3" type="submit">
            Restablecer contraseña
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default ResetPassword;
