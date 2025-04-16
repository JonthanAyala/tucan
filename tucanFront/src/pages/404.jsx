import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@600;800&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  return (
    <div
      className="vh-100 vw-100 d-flex flex-column align-items-center justify-content-center text-white"
      style={{
        background: 'linear-gradient(145deg, #0f0c29, #302b63, #24243e)',
        fontFamily: '"Orbitron", sans-serif',
        overflow: 'hidden',
        textAlign: 'center',
        padding: '2rem',
        position: 'relative',
      }}
    >
      <img
        src="https://media.tenor.com/4Fc9Q9DS1XgAAAAM/yoru-valorant-valorant.gif"
        alt="404"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.1,
          zIndex: 0,
        }}
      />

      <div style={{ zIndex: 1 }}>
        <h1
          className="display-1 fw-bold mb-2"
          style={{ color: '#00f0ff', textShadow: '0 0 15px #0ff' }}
        >
          404
        </h1>

        <h2
          className="fw-bold mb-3"
          style={{ color: '#fff', textShadow: '0 0 5px #fff' }}
        >
          Zona no encontrada
        </h2>

        <p className="fs-5 text-light mb-4 px-3">
          Parece que te fuiste fuera del mapa... <br /> Pero aún puedes regresar a la base.
        </p>

        <Link
          to="/login"
          className="btn btn-lg mt-3"
          style={{
            background: 'linear-gradient(135deg, #00f0ff, #007bff)',
            color: '#000',
            padding: '0.75rem 2rem',
            borderRadius: '40px',
            fontWeight: '900',
            fontSize: '1.2rem',
            boxShadow: '0 0 15px #00f0ff',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            textDecoration: 'none',
            display: 'inline-block',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.boxShadow = '0 0 25px #00f0ff';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.boxShadow = '0 0 15px #00f0ff';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <i className="bi bi-box-arrow-in-right me-2"></i> Volver al Login
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
