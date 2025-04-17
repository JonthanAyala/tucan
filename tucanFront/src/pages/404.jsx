import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="vh-100 d-flex flex-column align-items-center justify-content-center bg-light text-center p-4">
      <div style={{ maxWidth: '600px', width: '100%' }}>
        <h1 className="display-1 fw-bold text-primary mb-3">404</h1>
        <h2 className="fw-semibold text-dark mb-3">Página no encontrada</h2>
        <p className="text-muted mb-4">
          Lo sentimos, la página que buscas no existe o fue movida. <br />
          Puedes volver al inicio de sesión para continuar navegando.
        </p>

        <Link
          to="/login"
          className="btn btn-outline-primary px-4 py-2"
          style={{ borderRadius: '30px', fontWeight: '500' }}
        >
          <i className="bi bi-arrow-left me-2"></i>Volver al Login
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
