import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

<p className="text-center">
  ¿Ya tienes cuenta?{" "}
  <Link to="/" className="text-decoration-none" style={{ color: "#00ffe0" }}>
    Inicia sesión
  </Link>
</p>

const Register = ({ onRegisterSuccess }) => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Orbitron:wght@500;800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmar) {
      return setError("Las contraseñas no coinciden");
    }

    try {
      // Simulación de registro
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess("¡Registro exitoso!");
      onRegisterSuccess?.();
    } catch (err) {
      setError("Ocurrió un error al registrar");
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
                ¡Regístrate <br /> como un <span style={{ color: "#00ffe0" }}>Entrenador</span>!
              </h1>
              <p className="lead mt-3" style={{ opacity: 0.8 }}>
                Tu aventura está por comenzar ✨
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
                  src="src/assets/toucan.gif"
                  alt="tucán"
                  style={{ width: "70px", filter: "drop-shadow(0 0 5px #00ffe0)" }}
                />
              </div>

              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label htmlFor="nombre" className="form-label fw-semibold">
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    className="form-control bg-dark text-white border-secondary"
                    placeholder="Ash Ketchum"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                    style={{ borderRadius: "8px" }}
                  />
                </div>

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
                <label htmlFor="telefono" className="form-label fw-semibold">
                    Teléfono
                </label>
                <input
                    type="tel"
                    id="telefono"
                    className="form-control bg-dark text-white border-secondary"
                    placeholder="7773678144"
                    value={telefono}
                    onChange={(e) => {
                    // Solo números: elimina letras y signos
                    const valor = e.target.value.replace(/\D/g, "");
                    setTelefono(valor);
                    }}
                    required
                    style={{ borderRadius: "8px" }}
                    pattern="[0-9]{10}" // opcional, si quieres validar por HTML5 10 dígitos
                    maxLength={10} // opcional, máximo 10 caracteres
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

                <div className="mb-3">
                  <label htmlFor="confirmar" className="form-label fw-semibold">
                    Confirmar contraseña
                  </label>
                  <input
                    type="password"
                    id="confirmar"
                    className="form-control bg-dark text-white border-secondary"
                    placeholder="********"
                    value={confirmar}
                    onChange={(e) => setConfirmar(e.target.value)}
                    required
                    style={{ borderRadius: "8px" }}
                  />
                </div>

                {error && (
                  <div className="alert alert-danger text-center py-2">{error}</div>
                )}

                {success && (
                  <div className="alert alert-success text-center py-2">{success}</div>
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
                    Registrarme
                  </button>
                </div>

                <p className="text-center">
                ¿Ya tienes cuenta?{" "}
                <Link to="/" className="text-decoration-none" style={{ color: "#00ffe0" }}>
                    Inicia sesión
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

export default Register;
