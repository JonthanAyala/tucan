import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import logoutIcon from '../assets/logout.svg';

function NavBar({ handleLogout }) {
  return (
    <nav className="navbar navbar-expand-lg" style={{
      background: 'linear-gradient(180deg, #1a3a8f 0%, #0d2259 100%)',
      padding: '0.5rem 1rem',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
      position: 'sticky',
      top: 0,
      zIndex: 900,
      minHeight: '70px'
    }}>
      <div className="container-fluid">
        {/* Logo y marca - alineado con el sidebar */}
        <div className="d-flex align-items-center" style={{ marginLeft: '88px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start',marginTop:'-10px', width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(180deg, #1a3a8f 0%, #0d2259 100%)', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', overflow: 'hidden' }}>
            <img
              src="/src/assets/toucan.gif"
              alt="Toucan Logo"
              style={{ maxWidth: '100%', maxHeight: '100%' }}
            />
          </div>
          <span className="navbar-brand mb-0 d-none d-sm-block" style={{
            fontWeight: '600',
            fontSize: '1.25rem',
            color: 'white',
            textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
          }}>
            TucanApp
          </span>
          <span className="navbar-brand mb-0 d-block d-sm-none" style={{
            fontWeight: '600',
            fontSize: '1rem',
            color: 'white',
            textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
          }}>
            TucanApp
          </span>
        </div>

        {/* Botón de cerrar sesión */}
        <div className="d-flex align-items-center">
          <button 
            className="btn d-flex align-items-center"
            onClick={handleLogout}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              color: 'white',
              padding: '0.5rem 1rem',
              transition: 'all 0.3s ease',
              height: '40px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <img 
              src={logoutIcon} 
              alt="Logout" 
              width="20" 
              height="20" 
              className="me-2" 
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            <span className="d-none d-sm-inline">Cerrar sesión</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;