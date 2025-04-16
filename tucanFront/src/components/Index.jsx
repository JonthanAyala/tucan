import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Eventos from './Eventos/Eventos';
import apiClient, { peticion } from "../../src/config/apiClient";

const Index = () => {

  
    const [proximosEventos, setProximosEventos] = useState([]);
    const [eventosFinalizados, setEventosFinalizados] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      peticion(null, "/eventos/api/listar_eventos/", "get")
          .then((res) => {
              setProximosEventos(res.proximosEventos);
              setEventosFinalizados(res.eventosFinalizados);
              setLoading(false);
          })
          .catch((error) => {
              console.error("Error al cargar los datos:", error);
              setLoading(false);
          });
  }, []);

    if (loading) {
        return <p className="text-center">Cargando eventos...</p>;
    }

    return (
        <div className="container-fluid p-0">
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                <div className="container-fluid d-flex justify-content-between align-items-center">
                    <div style={{ width: '60px' }}></div>
                    <span className="navbar-brand mx-auto">TUCANAAP</span>
                    <a className="btn btn-light" href="/login">Login</a>
                </div>
            </nav>

            <div className="container mt-5">
                <Eventos
                    proximosEventos={proximosEventos}
                    eventosFinalizados={eventosFinalizados}
                />
            </div>
        </div>
    );
};

export default Index;