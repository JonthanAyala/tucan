import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import 'sweetalert2/dist/sweetalert2.min.css';

const Recuperar = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/usuarios/send-reset-email/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: '¡Correo enviado!',
          text: data.message,
          confirmButtonColor: '#3085d6',
        }).then(() => navigate("/login"));
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: data.error || "Algo salió mal",
          confirmButtonColor: '#d33',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error del servidor',
        text: 'No se pudo enviar el correo. Intenta más tarde.',
        confirmButtonColor: '#d33',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="spinner-border text-primary" style={{ width: "5rem", height: "5rem" }} role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
      exit={{ opacity: 0, y: -50, transition: { duration: 0.5 } }}
      className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light"
    >
      <div className="p-5 bg-white rounded shadow" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="mb-3 text-center">🔐 Recuperar Contraseña</h2>
        <p className="text-muted text-center mb-4">Ingresa el correo de tu cuenta y te enviaremos un enlace</p>
        <form onSubmit={handleSubmit}>
          <input
            className="form-control mb-3"
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className="btn btn-primary w-100" type="submit">Enviar</button>
        </form>
      </div>
    </motion.div>
  );
};

export default Recuperar;
