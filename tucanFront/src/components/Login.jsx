import React, { useState } from "react";

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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
        backgroundImage:
          'url("https://upload.wikimedia.org/wikipedia/commons/e/e1/Football%2C_Basketball%2C_Tennis_Ball%2C_Soccer_Ball%2C_Baseball.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container d-flex justify-content-center align-items-center h-100">
        <div className="row w-100">
          <div className="col-md-6 d-flex align-items-center justify-content-center text-white bg-dark bg-opacity-50 rounded-3 p-4">
            <h1 className="text-center fw-bold">
              ¡Inicia sesión <br /> como un <br /> Entrenador!
            </h1>
          </div>

          <div className="col-md-6 d-flex justify-content-center align-items-center">
            <div
              className="bg-white p-4 rounded shadow w-100"
              style={{ maxWidth: "400px" }}
            >
              <div className="text-center mb-3">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Cartoon_bird_1.svg/512px-Cartoon_bird_1.svg.png"
                  alt="tucán"
                  style={{ width: "80px" }}
                />
              </div>

              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label
                    className="form-label"
                    type="text"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  >
                    Correo
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Ingresa tu correo"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Contraseña
                  </label>
                  <input
                    className="form-control"
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ingresa tu contraseña"
                  />
                </div>

                <div className="d-grid mb-3">
                  <button type="submit" className="btn btn-dark">
                    Ingresar
                  </button>
                </div>

                <p className="text-center">
                  ¿No tienes una cuenta? <a href="#">Regístrate</a>
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
