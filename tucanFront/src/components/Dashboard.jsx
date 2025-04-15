import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";

const mockEquipos = [
  {
    id: 1,
    nombre: "Tigres FC",
    deporte: "Fútbol",
    victorias: 12,
    derrotas: 8,
    imagen: "https://img.freepik.com/foto-gratis/jugador-futbol-patea-balones-estadio-generado-ia_188544-41074.jpg",
  },
  {
    id: 2,
    nombre: "Halcones Basketball",
    deporte: "Baloncesto",
    victorias: 15,
    derrotas: 5,
    imagen: "https://img.freepik.com/foto-gratis/jugador-baloncesto-haciendo-una-volcada-generado-ia_188544-19668.jpg",
  },
  {
    id: 3,
    nombre: "Águilas",
    deporte: "Fútbol",
    victorias: 9,
    derrotas: 3,
    imagen: "https://img.freepik.com/foto-gratis/futbolista-controlando-balon-campo-juego-generado-ia_188544-19664.jpg",
  },
];

const Dashboard = () => {
  const [equipos, setEquipos] = useState([]);
  const [filtro, setFiltro] = useState("Todos");

  useEffect(() => {
    // Simula una llamada a la API
    setTimeout(() => {
      setEquipos(mockEquipos);
    }, 500);
  }, []);

  const equiposFiltrados = filtro === "Todos"
    ? equipos
    : equipos.filter((e) => e.deporte === filtro);

  return (
    <div className="d-flex vh-100">
      {/* Sidebar */}
      <div style={{ width: "220px", backgroundColor: "#0d3fe5" }} className="text-white p-3">
        <div className="fw-bold fs-4 mb-4">
          <i className="bi bi-award-fill me-2"></i>TucanApp
        </div>
        <ul className="nav flex-column">
          <li className="nav-item mb-3">
            <a className="nav-link text-white" href="#"><i className="bi bi-people-fill me-2"></i>Equipos</a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-white" href="#"><i className="bi bi-calendar-event me-2"></i>Calendario</a>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 bg-light">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom bg-white">
          <h5 className="mb-0">Equipos Registrados</h5>
          <div className="d-flex align-items-center">
            <i className="bi bi-bell me-3"></i>
            <span className="me-2">Renegul</span>
            <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="avatar" className="rounded-circle" width={30} height={30} />
          </div>
        </div>

        {/* Filtros */}
        <div className="d-flex gap-2 p-3">
          {["Todos", "Fútbol", "Baloncesto"].map((tipo) => (
            <Button
              key={tipo}
              variant={filtro === tipo ? "primary" : "outline-secondary"}
              onClick={() => setFiltro(tipo)}
            >
              {tipo === "Todos" && <i className="bi bi-trophy me-1"></i>}
              {tipo}
            </Button>
          ))}
        </div>

        {/* Cards */}
        <div className="d-flex gap-4 p-3 flex-wrap">
          {equiposFiltrados.map((equipo) => (
            <Card key={equipo.id} style={{ width: "280px", borderRadius: "16px" }}>
              <Card.Img
                variant="top"
                src={equipo.imagen}
                style={{ height: "160px", objectFit: "cover" }}
              />
              <Card.Body>
                <small className="text-muted">
                  <i className="bi bi-shield-fill me-1"></i>{equipo.deporte}
                </small>
                <Card.Title className="fw-bold mt-1">{equipo.nombre}</Card.Title>
                <div className="d-flex justify-content-between mt-3">
                  <div className="text-success fw-bold text-center">
                    {equipo.victorias}<br />
                    <small className="fw-normal text-muted">Victorias</small>
                  </div>
                  <div className="text-danger fw-bold text-center">
                    {equipo.derrotas}<br />
                    <small className="fw-normal text-muted">Derrotas</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
