import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import logoutIcon from '../assets/logout.svg';
import returnIcon from '../assets/return.svg';

function NavBar({ handleLogout }) {
  return (
    <nav className="navbar navbar-dark bg-primary px-2 px-lg-3">
  <div className="container-fluid flex-nowrap">
    {/* Espacio reservado para alineación (antes ocupado por el botón de regresar) */}
    <div className="d-none d-lg-block" style={{width: "88px"}}></div>

    {/* Logo y marca - centrado en móvil, alineado en desktop */}
    <div className="mx-auto mx-lg-0 text-center flex-grow-1 flex-lg-grow-0">
      <div className="d-flex align-items-center justify-content-center justify-content-lg-start">
        <img
          src="/ruta-del-logo.png"
          alt="Logo"
          width="40"
          height="40"
          className="me-2"
        />
        <span className="navbar-brand mb-0 h1 d-none d-sm-block">Sistema SaludVital</span>
        <span className="navbar-brand mb-0 h5 d-block d-sm-none">SaludVital</span>
      </div>
    </div>

    {/* Botón de cerrar sesión - siempre visible pero adaptado para móviles */}
    <div className="d-flex align-items-center">
      <button className="btn btn-link text-white text-decoration-none py-0 py-lg-1" onClick={handleLogout}>
        <img src={logoutIcon} alt="Logout" width="20" height="20" className="me-1 me-lg-2" />
        <span className="d-none d-sm-inline">Cerrar sesión</span>
      </button>
    </div>
  </div>
</nav>
  );
}

export default NavBar;
