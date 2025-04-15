import React from 'react';
import { Link } from "react-router-dom";

const Error500 = () => {
  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-dark py-5">
      <div className="card border-0 shadow-lg" style={{ maxWidth: '800px', borderRadius: '20px', overflow: 'hidden' }}>
        <div className="row g-0">
          <div className="col-md-6 bg-danger d-flex align-items-center justify-content-center p-4">
            <img 
              src="https://cdn.dribbble.com/users/1078347/screenshots/2799566/media/6a8e7ce96f344ded947f962d9c8d9922.gif" 
              alt="500 Error Animation" 
              className="img-fluid rounded" 
              style={{ maxHeight: '300px' }}
            />
          </div>
          <div className="col-md-6">
            <div className="card-body text-center p-5">
              <h1 className="display-1 fw-bold text-danger mb-0">500</h1>
              <h2 className="fs-1 fw-bold text-primary mb-3">¡Oh no!</h2>
              <div className="alert alert-danger" role="alert">
                <i className="bi bi-exclamation-octagon-fill me-2"></i>
                Error del servidor
              </div>
              <p className="card-text fs-5 text-muted mb-4">
                Lo sentimos, ha ocurrido un error en nuestros servidores. 
                Estamos trabajando para solucionarlo.
              </p>
              <div className="d-grid gap-3">
                <Link 
                  to="/login" 
                  className="btn btn-primary btn-lg mt-3 shadow-sm"
                >
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Ir al Login
                </Link>
                <button 
                  onClick={() => window.location.reload()} 
                  className="btn btn-outline-secondary"
                >
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Intentar nuevamente
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="card-footer bg-light text-center p-3">
          <small className="text-muted">
            Si el problema persiste, por favor contacta a 
            <a href="mailto:soporte@tudominio.com" className="text-decoration-none ms-1">soporte técnico</a>.
          </small>
        </div>
      </div>
    </div>
  );
};

export default Error500;