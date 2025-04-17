import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import apiClient, { peticion } from "../../config/apiClient";

const EquipoDetalle = ({ id }) => {
  const [equipo, setEquipo] = useState(null);
  const [jugadores, setJugadores] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editableEquipo, setEditableEquipo] = useState({});
  const [deportes, setDeportes] = useState([]);
  const navigate = useNavigate();
  //lolo
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        console.log("Ejecutando cargarDatos...");

        // Carga los datos del equipo
        const resEquipo = await peticion(apiClient, `/equipos/api/${id}/`);
        console.log("Datos del equipo:", resEquipo.data);

        // Carga los datos de los deportes
        const resDeportes = await peticion(apiClient, `/deportes/api/`);
        console.log("Datos de deportes:", resDeportes.data);
        const deportes = resDeportes.data;

        // Asocia el nombre del deporte al equipo
        const equipoActualizado = { ...resEquipo.data };
        const deporte = deportes.find((d) => Number(d.id) === Number(equipoActualizado.deporte));
        equipoActualizado.deporte_nombre = deporte ? deporte.nombre : "Desconocido";

        setEquipo(equipoActualizado);
        setDeportes(deportes);

        // Carga los datos de los jugadores
        const resJugadores = await peticion(apiClient, `jugadores/jugadores/${id}/`);
        console.log("Datos de jugadores:", resJugadores.data.jugadores);
        const jugadores = resJugadores.data.jugadores;

        // Carga las posiciones
        const resPosiciones = await peticion(apiClient, `/posicion/api/`);
        console.log("Datos de posiciones:", resPosiciones.data);
        const posiciones = resPosiciones.data;

        // Asocia las posiciones a los jugadores
        const jugadoresConPosicion = jugadores.map((jugador) => {
          const posicion = posiciones.find((p) => p.id === jugador.posicion);
          return {
            ...jugador,
            posicion_nombre: posicion ? posicion.nombre : "Desconocida",
          };
        });

        console.log("Jugadores con posición:", jugadoresConPosicion);
        setJugadores(jugadoresConPosicion);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
        Swal.fire("Error", "No se pudo cargar la información del equipo", "error");
        navigate("/equipos");
      }
    };

    if (id) {
      cargarDatos();
    }
  }, [id, navigate]);

  const handleEdit = () => {
    setEditableEquipo(equipo);
    setShowModal(true);
  };
  const handleEditJugadores = () => {
    // Lógica para abrir un modal o redirigir a una página de edición de jugadores
    console.log("Editar jugadores");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableEquipo({ ...editableEquipo, [name]: value });
  };
  const handleSave = async () => {
    try {
      const res = await peticion(apiClient, `/equipos/api/${id}/`, "put", editableEquipo);
      setEquipo(res.data);
      setShowModal(false);
      Swal.fire("Actualizado", "Equipo actualizado con éxito.", "success");
    } catch (error) {
      console.error("Error al actualizar el equipo:", error);
      Swal.fire("Error", "Ocurrió un error al actualizar el equipo.", "error");
    }
  };

  if (!equipo) {
    return <div className="text-center py-4">Por favor selecciona un Equipo en la pestaña Equipos</div>;
  }

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4 shadow-lg w-75">
        <div className="card-body">
          <div className="container row gy-4">
            <div className="card col-4 p-5 shadow-sm mb-4 d-flex flex-column">
              <div className="card-header bg-light">
                <h4 className="text-center">Jugadores</h4>
              </div>
              <div className="card-body flex-grow-1">
                {jugadores.length === 0 ? (
                  <p className="text-muted text-center">No hay jugadores registrados en este equipo</p>
                ) : (
                  <ul className="list-group list-group-flush">
                    {jugadores.map((jugador) => (
                      <li key={jugador.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{jugador.nombre}</strong>
                          <div className="text-muted">{jugador.posicion_nombre}</div>
                        </div>
                        <span className="badge bg-primary rounded-pill">{jugador.es_titular ? "Titular" : "Suplente"}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="text-center mt-auto">
                <button className="btn btn-success" onClick={handleEditJugadores}>
                  Editar Jugadores
                </button>
              </div>
            </div>
            <div className="card col-3 p-5 shadow-sm  mb-4">
              <div className="card-header bg-light">
                <h4 className="text-center">Partidos</h4>
              </div>
              <div className="card-body">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <strong>Partido 1</strong>
                      <div className="text-muted">Fecha: 2025-04-17</div>
                    </div>
                    <span className="badge bg-primary rounded-pill">Activo</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <strong>Partido 2</strong>
                      <div className="text-muted">Fecha: 2025-04-18</div>
                    </div>
                    <span className="badge bg-secondary rounded-pill">Finalizado</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="card col-5 p-5 shadow-sm mb-4">
              <div className="card-header bg-light">
                <h4 className="text-center">Información General Del Equipo</h4>
              </div>
              <div className="card-body">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex align-items-center">
                    <strong>Nombre:</strong>
                    <span className="ms-2">{equipo.nombre}</span>
                  </li>
                  <li className="list-group-item d-flex align-items-center">
                    <strong>Ciudad:</strong>
                    <span className="ms-2">{equipo.ciudad}</span>
                  </li>
                  <li className="list-group-item d-flex align-items-center">
                    <strong>Deporte:</strong>
                    <span className="ms-2">{equipo.deporte_nombre}</span>
                  </li>
                  <li className="list-group-item d-flex align-items-center">
                    <strong>Jugadores:</strong>
                    <span className="ms-2">{equipo.num_titulares}</span>
                  </li>
                  <li className="list-group-item d-flex align-items-center">
                    <strong>Suplentes:</strong>
                    <span className="ms-2">{equipo.num_suplentes}</span>
                  </li>
                </ul>
                <div className="text-center mt-4">
                  <button className="btn btn-success" onClick={handleEdit}>
                    Editar Información y Logo
                  </button>
                </div>
              </div>
            </div>

            {showModal && (
        <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-4">
              <div className="modal-header">
                <h5 className="modal-title">Editar Equipo</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <form className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Nombre</label>
                    <input
                      type="text"
                      className="form-control"
                      name="nombre"
                      value={editableEquipo.nombre || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Ciudad</label>
                    <input
                      type="text"
                      className="form-control"
                      name="ciudad"
                      value={editableEquipo.ciudad || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Deporte</label>
                    <select
                      className="form-select"
                      name="deporte"
                      value={editableEquipo.deporte || ""}
                      onChange={handleInputChange}
                    >
                      <option value="">Seleccione un deporte</option>
                      {deportes.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Titulares</label>
                    <input
                      type="number"
                      className="form-control"
                      name="num_titulares"
                      value={editableEquipo.num_titulares || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Suplentes</label>
                    <input
                      type="number"
                      className="form-control"
                      name="num_suplentes"
                      value={editableEquipo.num_suplentes || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={handleSave}>Guardar</button>
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default EquipoDetalle;
/**/