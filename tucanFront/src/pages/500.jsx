import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Error500 = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center text-center vh-100"
      style={{
        backgroundColor: '#f8f9fa',
        fontFamily: '"Orbitron", sans-serif',
        padding: '2rem',
      }}
    >
      <h1
        style={{
          fontSize: '6rem',
          fontWeight: 'bold',
          color: '#dc3545', // rojo suave
          marginBottom: '1rem',
        }}
      >
        500
      </h1>
      <h2 style={{ fontSize: '2rem', color: '#212529', marginBottom: '1rem' }}>
        Error del servidor
      </h2>
      <p style={{ maxWidth: '500px', color: '#6c757d', marginBottom: '2rem' }}>
        Algo salió mal de nuestro lado. Por favor intenta más tarde o vuelve al inicio de sesión para continuar navegando.
      </p>
      <Link
        to="/login"
        className="btn btn-outline-danger"
        style={{
          padding: '0.6rem 1.5rem',
          borderRadius: '30px',
          fontWeight: '500',
        }}
      >
        <i className="bi bi-box-arrow-in-right me-2"></i>Volver al Login
      </Link>
    </div>
  );
};

export default Error500;
