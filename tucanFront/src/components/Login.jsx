import React, { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { login } from "../services/authService";
import { useEffect } from "react";


const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      Swal.fire({
        icon: "success",
        title: "¡Bienvenido!",
        text: "Has iniciado sesión correctamente.",
        showConfirmButton: false,
        timer: 1500,
      });
      onLoginSuccess();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Credenciales incorrectas. Inténtalo nuevamente.",
      });
    }
  };

  return (
    <div
      className="vh-100 vw-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundImage:
          'url("https://imgs.search.brave.com/bwlognXrY9PqYLl6czJP2pDcnJTNoa-L-wjT2VMGeiw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJzLWNsYW4u/Y29tL3dwLWNvbnRl/bnQvdXBsb2Fkcy8y/MDI1LzAxL2Rla3Ut/YW5kLXVyYXJha2Et/dmFsZW50aW5lcy1y/b21hbnRpYy1oZWFy/dHMtZGVza3RvcC13/YWxscGFwZXItY292/ZXIuanBn")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backdropFilter: "blur(4px)",
      }}
    >
      <div className="container d-flex justify-content-center align-items-center h-100">
        <div className="row w-100">
          <div className="col-md-6 d-flex align-items-center justify-content-center text-white bg-dark bg-opacity-50 rounded-4 p-4 shadow">
            <h1 className="text-center fw-bold display-6">
              ¡Inicia sesión <br /> como un Entrenador!
            </h1>
          </div>

          <div className="col-md-6 d-flex justify-content-center align-items-center">
            <div
              className="bg-white p-5 rounded-4 shadow-lg w-100 animate__animated animate__fadeIn"
              style={{ maxWidth: "400px" }}
            >
              <div className="text-center mb-4">
                <img
                  src="https://media.tenor.com/5J5q14EBJeIAAAAi/toucan.gif"
                  alt="tucán"
                  style={{ width: "80px" }}
                />
              </div>

              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-semibold">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ejemplo@email.com"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label fw-semibold">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="********"
                    required
                  />
                </div>

                <div className="d-grid mb-3">
                  <button
                    type="submit"
                    className="btn btn-dark btn-lg"
                    style={{
                      transition: "0.3s",
                    }}
                  >
                    Ingresar
                  </button>
                </div>
                <p className="text-center mb-0">
                  ¿Olvidaste tu contraseña?{" "}
                  <Link className="" to="/recuperar">
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
