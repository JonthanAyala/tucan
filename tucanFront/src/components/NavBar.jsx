import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import logoutIcon from '../assets/logout.svg';
import returnIcon from '../assets/return.svg';

function NavBar({ handleLogout }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-3">
      <div className="container-fluid">
        <div className="d-lg-block">
          <button className="btn  me-2" onClick={() => window.history.back()}>
            <img src={returnIcon} alt="Return" width="20" height="20" className="me-2" />
            Regresar
          </button>
        </div>

        <div className="mx-auto d-flex align-items-center">
          <img
            src="/ruta-del-logo.png"
            alt="Logo"
            width="40"
            height="40"
            className="me-2"
          />
          <span className="navbar-brand mb-0 h1">Sistema SaludVital</span>
        </div>

        <div className="d-lg-block">
          <button className="btn  ms-2" onClick={handleLogout}>
            <img src={logoutIcon} alt="Logout" width="20" height="20" className="me-2" />
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
