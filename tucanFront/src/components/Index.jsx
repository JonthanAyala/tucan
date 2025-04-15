import React from 'react';

const Index = () => {
  return (
    <div className="container text-center mt-5">
      <h1>Bienvenido</h1>
      <p>Haz clic en el botón para iniciar sesión</p>
      <a href="/login" className="btn btn-primary">
        Login
      </a>
    </div>
  );
};

export default Index;