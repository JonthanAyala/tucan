import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import apiClient, { peticion } from "../../config/apiClient";

const EquipoDetalle = ({ id }) => {
  const [equipo, setEquipo] = useState(null);
  const [jugadores, setJugadores] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showJugadoresModal, setShowJugadoresModal] = useState(false);
  const [editableEquipo, setEditableEquipo] = useState({});
  const [deportes, setDeportes] = useState([]);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [eventos, setEventos] = useState([]);
  const currentUserId = localStorage.getItem("id");
  const [posiciones, setPosiciones] = useState([]);
  const [victorias, setVictorias] = useState(0);
  const [derrotas, setDerrotas] = useState(0);
  const [empates, setEmpates] = useState(0);
  const [efectividad, setEfectividad] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const resEquipo = await peticion(apiClient, `/equipos/api/${id}/`);

        const resDeportes = await peticion(apiClient, `/deportes/api/`);

        const deportes = resDeportes.data;

        const equipoActualizado = { ...resEquipo.data };
        const deporte = deportes.find((d) => Number(d.id) === Number(equipoActualizado.deporte));
        equipoActualizado.deporte_nombre = deporte ? deporte.nombre : "Desconocido";

        setEquipo(equipoActualizado);
        setDeportes(deportes);

        const resJugadores = await peticion(apiClient, `jugadores/jugadores/${id}/`);
        console.log("Datos de jugadores:", resJugadores.data.jugadores);
        const jugadores = resJugadores.data.jugadores;

        const resPosiciones = await peticion(apiClient, `/posicion/api/`);
        const posiciones = resPosiciones.data;

        const jugadoresConPosicion = jugadores.map((jugador) => {
          const posicion = posiciones.find((p) => p.id === jugador.posicion);
          return {
            ...jugador,
            posicion_nombre: posicion ? posicion.nombre : "Desconocida",
          };
        });

        setJugadores(jugadoresConPosicion);

        const resEventos = await peticion(apiClient, `/eventos/equipo/${id}/`);
        const eventos = resEventos.data.eventos;
        const estadisticas = resEventos.data.estadisticas;

        // Obtener nombres de los equipos para cada evento
        const eventosConNombres = await Promise.all(
          eventos.map(async (evento) => {
            const equipo1Res = await peticion(apiClient, `/equipos/api/${evento.equipo1}/`);
            const equipo2Res = await peticion(apiClient, `/equipos/api/${evento.equipo2}/`);
            return {
              ...evento,
              equipo1_nombre: equipo1Res.data.nombre,
              equipo2_nombre: equipo2Res.data.nombre,
            };
          })
        );

        setEventos(eventosConNombres);

        setVictorias(estadisticas.victorias);
        setDerrotas(estadisticas.derrotas);
        setEmpates(estadisticas.empates);
        setEfectividad(estadisticas.efectividad);
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

  const actualizarEventos = (equipoActualizado) => {
    const eventosActualizados = eventos.map((evento) => {
      if (evento.equipo1 === equipoActualizado.id) {
        return { ...evento, equipo1_nombre: equipoActualizado.nombre };
      } else if (evento.equipo2 === equipoActualizado.id) {
        return { ...evento, equipo2_nombre: equipoActualizado.nombre };
      }
      return evento;
    });
    setEventos(eventosActualizados);
  };

  const handleEdit = () => {
    setEditableEquipo(equipo);
    setShowModal(true);
  };
  const handleEditJugadores = () => {
    setShowJugadoresModal(true);
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableEquipo({ ...editableEquipo, [name]: value });
  };
  const handleSave = async () => {
    if (!editableEquipo.nombre || !editableEquipo.deporte) {
      Swal.fire(
        "Campos incompletos",
        "Por favor completa nombre y deporte.",
        "warning"
      );
      return;
    }

    try {
      const formData = new FormData();
      formData.append("nombre", editableEquipo.nombre);
      formData.append("descripcion", editableEquipo.descripcion || "");
      formData.append("ciudad", editableEquipo.ciudad || "");
      formData.append("deporte", editableEquipo.deporte);
      formData.append("entrenador", currentUserId);
      formData.append("num_titulares", editableEquipo.num_titulares || 0);
      formData.append("num_suplentes", editableEquipo.num_suplentes || 0);

      if (logoFile) {
        formData.append("logo", logoFile);
      }

      const headers = { "Content-Type": "multipart/form-data" };

      if (editableEquipo.id) {
        const res = await peticion(
          apiClient,
          `/equipos/api/${editableEquipo.id}/`,
          "put",
          formData,
          headers
        );

        const equipoActualizado = { ...res.data };
        const deporte = deportes.find(
          (d) => Number(d.id) === Number(equipoActualizado.deporte)
        );
        equipoActualizado.deporte_nombre = deporte ? deporte.nombre : "Desconocido";

        setEquipo(equipoActualizado);
        actualizarEventos(equipoActualizado);
        setShowModal(false);
        Swal.fire("Actualizado", "Equipo actualizado con éxito.", "success");
      }
    } catch (error) {
      console.error("Error al guardar el equipo:", error);
      Swal.fire(
        "Error",
        "Ocurrió un error al guardar el equipo. Por favor, inténtalo de nuevo.",
        "error"
      );
    }
  };

  if (!equipo) {
    return <div className="text-center py-4">Por favor selecciona un Equipo en la pestaña Equipos</div>;
  }

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 p-2 p-lg-3" >
      <div className="card p-2 p-lg-4 shadow-lg" style={{
        maxWidth: "1400px",
        maxHeight: "100vh",
        width: "100%",
        overflow: "auto"
      }}>
        <h1 className="text-center mb-2 mb-lg-4 fs-3 fs-lg-2">{equipo.nombre}</h1>
        <div className="card-body p-0 p-lg-2">
          <div className="container-fluid px-0">
            <div className="row g-2 g-lg-4">
              <div className="col-12">
                <div className="card p-2 p-lg-3 shadow-sm w-100 mb-4">
                  <div className="card-header bg-light py-2 py-lg-3">
                    <h4 className="text-center mb-0 fs-5 fs-lg-4">Estadísticas Generales</h4>
                  </div>
                  <div className="card-body d-flex flex-wrap justify-content-around align-items-center">
                    <div className="text-center m-2" style={{ minWidth: "120px" }}>
                      <h5 className="text-success mb-1">{victorias}</h5>
                      <p className="mb-0">Victorias</p>
                    </div>
                    <div className="text-center m-2" style={{ minWidth: "120px" }}>
                      <h5 className="text-danger mb-1">{derrotas}</h5>
                      <p className="mb-0">Derrotas</p>
                    </div>
                    <div className="text-center m-2" style={{ minWidth: "120px" }}>
                      <h5 className="text-primary mb-1">{empates}</h5>
                      <p className="mb-0">Empates</p>
                    </div>
                    <div className="text-center m-2" style={{ minWidth: "120px" }}>
                      <h5 className="text-purple mb-1">{efectividad}%</h5>
                      <p className="mb-0">Efectividad</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-4">
                <div className="card p-2 p-lg-3 shadow-sm w-100 d-flex flex-column" style={{
                  height: "500px"
                }}>
                  <div className="card-header bg-light py-2 py-lg-3">
                    <h4 className="text-center mb-0 fs-5 fs-lg-4">Jugadores</h4>
                  </div>
                  <div className="card-body p-1 p-lg-2" style={{
                    overflowY: "auto",
                    flex: "1 1 auto"
                  }}>
                    {jugadores.length === 0 ? (
                      <p className="text-muted text-center my-2 my-lg-3">No hay jugadores registrados</p>
                    ) : (
                      <ul className="list-group list-group-flush">
                        {jugadores.map((jugador) => (
                          <li key={jugador.id} className="list-group-item d-flex justify-content-between align-items-center py-2">
                            <div className="text-truncate">
                              <strong className="d-block text-truncate">{jugador.nombre}</strong>
                              <small className="text-muted text-truncate d-block">{jugador.posicion_nombre}</small>
                            </div>
                            <span className="badge bg-primary rounded-pill ms-2">
                              {jugador.es_titular ? "Titular" : "Suplente"}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="card-footer bg-transparent border-0 text-center pt-2 pb-1">
                    <button className="btn btn-success btn-sm btn-lg" onClick={handleEditJugadores}>
                      Editar Jugadores
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-4">
                <div className="card p-2 p-lg-3 shadow-sm w-100 d-flex flex-column" style={{
                  height: "500px"
                }}>
                  <div className="card-header bg-light py-2 py-lg-3">
                    <h4 className="text-center mb-0 fs-5 fs-lg-4">Partidos</h4>
                  </div>
                  <div className="card-body p-1 p-lg-2" style={{
                    overflowY: "auto",
                    flex: "1 1 auto"
                  }}>
                    {eventos.length === 0 ? (
                      <p className="text-muted text-center my-2 my-lg-3">No hay eventos registrados</p>
                    ) : (
                      <ul className="list-group list-group-flush">
                        {eventos.map((evento) => (
                          <li
                            key={evento.id}
                            className="list-group-item d-flex justify-content-between align-items-center py-2"
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              Swal.fire({
                                title: `${evento.nombre}`,
                                html: `<strong>${equipo.id === evento.equipo1 ? evento.equipo1_nombre : evento.equipo2_nombre} vs ${equipo.id === evento.equipo1 ? evento.equipo2_nombre : evento.equipo1_nombre}</strong><br/>Deporte: ${equipo.deporte_nombre}<br/>Fecha: ${new Date(evento.fecha).toLocaleDateString()}<br/>Resultado: ${evento.resultado_equipo || "Pendiente"}<br/>${evento.puntos_equipo1 != null && evento.puntos_equipo2 != null
                                  ? `Puntos: ${equipo.id === evento.equipo1
                                    ? `${evento.puntos_equipo1} - ${evento.puntos_equipo2}`
                                    : `${evento.puntos_equipo2} - ${evento.puntos_equipo1}`
                                  }<br/>`
                                  : ""
                                  }`,
                                icon: "info",
                                confirmButtonText: "Cerrar",
                              })
                            }
                          >
                            <div className="text-truncate">
                              <strong className="d-block text-truncate">
                                {equipo.id === evento.equipo1
                                  ? `${evento.equipo1_nombre} vs ${evento.equipo2_nombre}`
                                  : `${evento.equipo2_nombre} vs ${evento.equipo1_nombre}`}
                              </strong>
                              <small className="text-muted d-block">
                                {new Date(evento.fecha) > new Date()
                                  ? `Fecha: ${new Date(evento.fecha).toLocaleDateString()}`
                                  : evento.resultado_equipo || "pendnte"}
                              </small>
                            </div>
                            <span
                              className={`badge rounded-pill ms-2 ${new Date(evento.fecha) > new Date()
                                ? "bg-warning"
                                : evento.resultado
                                  ? "bg-secondary"
                                  : "bg-primary"
                                }`}
                            >
                              {new Date(evento.fecha) > new Date()
                                ? "Próximo"
                                : equipo.id === evento.equipo1
                                  ? `${evento.puntos_equipo1} - ${evento.puntos_equipo2}`
                                  : `${evento.puntos_equipo2} - ${evento.puntos_equipo1}` || "Pendiente"}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-4">
                <div className="card h-100 p-2 p-lg-3 shadow-sm w-100 d-flex flex-column">
                  <div className="card-header bg-light py-2 py-lg-3">
                    <h4 className="text-center mb-0 fs-5 fs-lg-4">Información General Del Equipo</h4>
                  </div>
                  <div className="card-body flex-grow-1 p-1 p-lg-3">
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item d-flex align-items-center py-2">
                        <strong className="me-2 flex-shrink-0">Nombre:</strong>
                        <span className="text-truncate">{equipo.nombre}</span>
                      </li>
                      <li className="list-group-item d-flex align-items-center py-2">
                        <strong className="me-2 flex-shrink-0">Ciudad:</strong>
                        <span>{equipo.ciudad}</span>
                      </li>
                      <li className="list-group-item d-flex align-items-center py-2">
                        <strong className="me-2 flex-shrink-0">Deporte:</strong>
                        <span>{equipo.deporte_nombre}</span>
                      </li>
                      <li className="list-group-item d-flex align-items-center py-2">
                        <strong className="me-2 flex-shrink-0">Jugadores:</strong>
                        <span>{equipo.num_titulares}</span>
                      </li>
                      <li className="list-group-item d-flex align-items-center py-2">
                        <strong className="me-2 flex-shrink-0">Suplentes:</strong>
                        <span>{equipo.num_suplentes}</span>
                      </li>
                    </ul>
                    <div className="text-center mt-3">
                      <button className="btn btn-success btn-sm btn-lg" onClick={handleEdit}>
                        Editar Información
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {showModal && (
              <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                  <div className="modal-content rounded-4">
                    <div className="modal-header">
                      <h5 className="modal-title">{editableEquipo.id ? "Editar Equipo" : "Crear Equipo"}</h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => {
                          setShowModal(false);
                          setEditableEquipo({});
                          setLogoFile(null);
                          setLogoPreview(null);
                        }}
                      ></button>
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
                          <label className="form-label">Logo (imagen)</label>
                          <input
                            type="file"
                            className="form-control"
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                        </div>
                        {/* Mostrar la imagen actual o la vista previa */}
                        {(logoPreview || editableEquipo.logo) && (
                          <div className="text-center my-2">
                            <img
                              src={logoPreview || editableEquipo.logo} // Mostrar la vista previa si existe, de lo contrario, el logo actual
                              alt="Vista previa"
                              style={{ maxHeight: "150px", objectFit: "contain" }}
                            />
                          </div>
                        )}
                        <div className="col-md-12">
                          <label className="form-label">Descripción</label>
                          <textarea
                            className="form-control"
                            name="descripcion"
                            value={editableEquipo.descripcion || ""}
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
                            disabled={jugadores.length > 0}
                          >
                            <option value="">Selecciona un deporte</option>
                            {deportes.map((deporte) => (
                              <option key={deporte.id} value={deporte.id}>
                                {deporte.nombre}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Número de Titulares</label>
                          <input
                            type="number"
                            className="form-control"
                            name="num_titulares"
                            value={editableEquipo.num_titulares || ""}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Número de Suplentes</label>
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
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleSave}
                      >
                        Guardar
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                          setShowModal(false);
                          setEditableEquipo({});
                          setLogoFile(null);
                          setLogoPreview(null);
                        }}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {showJugadoresModal && (
              <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1">
                <div className="modal-dialog modal-lg modal-dialog-centered">
                  <div className="modal-content rounded-4">
                    <div className="modal-header">
                      <h5 className="modal-title">Editar Jugadores</h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShowJugadoresModal(false)}
                      ></button>
                    </div>
                    <div className="modal-body">
                      <div className="mb-3 d-flex">
                        <input
                          type="text"
                          className="form-control me-2"
                          placeholder="Nombre"
                        />
                        <select className="form-select me-2">
                          <option value="">Posición</option>
                          {posiciones.map((posicion) => (
                            <option key={posicion.id} value={posicion.id}>
                              {posicion.nombre}
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          className="form-control me-2"
                          placeholder="Número"
                        />
                        <button className="btn btn-success">Agregar</button>
                      </div>
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>Nombre</th>
                            <th>Posición</th>
                            <th>Número</th>
                            <th>Suplente</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {jugadores.map((jugador) => (
                            <tr key={jugador.id}>
                              <td>{jugador.nombre}</td>
                              <td>{jugador.posicion_nombre}</td>
                              <td>{jugador.numero}</td>
                              <td>
                                <input
                                  type="checkbox"
                                  checked={jugador.es_suplente}
                                  readOnly
                                />
                              </td>
                              <td>
                                <button className="btn btn-sm btn-primary me-2">
                                  ✏️
                                </button>
                                <button className="btn btn-sm btn-danger">❌</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="modal-footer">
                      <button
                        className="btn btn-secondary"
                        onClick={() => setShowJugadoresModal(false)}
                      >
                        Cerrar
                      </button>
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
