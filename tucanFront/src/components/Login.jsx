import React, { useState } from "react";
import { Link } from "react-router-dom";
import { login } from "../services/authService";
import { useEffect } from "react";
 // Asegúrate de que la ruta sea correcta

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Orbitron:wght@500;800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      onLoginSuccess();
    } catch (err) {
      setError("Credenciales incorrectas");
    }
  };

  return (
    <div
      className="vh-100 vw-100 d-flex align-items-center justify-content-center"
      style={{
        background: "#0f0f0f",
        fontFamily: '"Orbitron", sans-serif',
        color: "#f1f1f1",
        padding: "1rem",
      }}
    >
      <div className="container d-flex justify-content-center align-items-center h-100">
        <div className="row w-100">
          <div className="col-md-6 d-flex align-items-center justify-content-center text-center">
            <div>
              <h1 className="fw-bold display-5" style={{ textShadow: "0 0 10px #00ffe0" }}>
                ¡Inicia sesión <br /> como un <span style={{ color: "#00ffe0" }}>Entrenador</span>!
              </h1>
              <p className="lead mt-3" style={{ opacity: 0.8 }}>
                Tu equipo te espera ⚡
              </p>
            </div>
          </div>

          <div className="col-md-6 d-flex justify-content-center align-items-center">
            <div
              className="p-4 rounded shadow"
              style={{
                background: "#1a1a1a",
                borderRadius: "16px",
                border: "1px solid #333",
                width: "100%",
                maxWidth: "400px",
              }}
            >
              <div className="text-center mb-4">
                <img
                  src="https://media.tenor.com/5J5q14EBJeIAAAAm/toucan.webp"
                  alt="tucán"
                  style={{ width: "70px", filter: "drop-shadow(0 0 5px #00ffe0)" }}
                />
              </div>

              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-semibold">
                    Correo
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="form-control bg-dark text-white border-secondary"
                    placeholder="ejemplo@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ borderRadius: "8px" }}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label fw-semibold">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="form-control bg-dark text-white border-secondary"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ borderRadius: "8px" }}
                  />
                </div>

                {error && (
                  <div className="alert alert-danger text-center py-2">
                    {error}
                  </div>
                )}

                <div className="d-grid mb-3">
                  <button
                    type="submit"
                    className="btn"
                    style={{
                      backgroundColor: "#00ffe0",
                      color: "#000",
                      fontWeight: "bold",
                      borderRadius: "25px",
                      padding: "0.75rem",
                      transition: "0.3s",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "#00e0d0";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "#00ffe0";
                    }}
                  >
                    Ingresar
                  </button>
                </div>

                <p className="text-center">
                  ¿No tienes una cuenta?{" "}
                  <Link to="/register" className="text-decoration-none" style={{ color: "#00ffe0" }}>
                    Regístrate
                  </Link>
                  ¿Olvidaste tu contraseña?{" "}
                  <Link to="/reset-password" className="forgot-password-link">
                    Recuperar contraseña
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
