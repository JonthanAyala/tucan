import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import apiClient, { peticion } from "../../config/apiClient";

const EquipoDetalle = ({ id }) => {
  const [equipo, setEquipo] = useState(null);
  const [jugadores, setJugadores] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editableEquipo, setEditableEquipo] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const resEquipo = await peticion(apiClient, `/equipos/api/${id}/`);
        setEquipo(resEquipo.data);

        /*const resJugadores = await peticion(apiClient, `/jugadores/equipo/${id}/`);
        setJugadores(resJugadores.data);*/
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
    return <div className="text-center py-4">Cargando detalles del equipo...</div>;
  }

  return (
    <div className="container py-4">
      <div className="card shadow-sm mb-4">
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

      <div className="card shadow-sm">
        <div className="card-header bg-light">
          <h4 className="text-center">Jugadores</h4>
        </div>
        <div className="card-body">
          {jugadores.length === 0 ? (
            <p className="text-muted text-center">No hay jugadores registrados en este equipo</p>
          ) : (
            <ul className="list-group list-group-flush">
              {jugadores.map((jugador) => (
                <li key={jugador.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{jugador.nombre}</strong>
                    <div className="text-muted">{jugador.posicion__nombre}</div>
                  </div>
                  <span className="badge bg-primary rounded-pill">{jugador.es_titular ? "Titular" : "Suplente"}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Editar Equipo</h5>
                <button type="button" className="close" onClick={() => setShowModal(false)}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-group">
                    <label>Nombre</label>
                    <input
                      type="text"
                      className="form-control"
                      name="nombre"
                      value={editableEquipo.nombre || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Ciudad</label>
                    <input
                      type="text"
                      className="form-control"
                      name="ciudad"
                      value={editableEquipo.ciudad || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Deporte</label>
                    <input
                      type="text"
                      className="form-control"
                      name="deporte_nombre"
                      value={editableEquipo.deporte_nombre || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Número de Titulares</label>
                    <input
                      type="number"
                      className="form-control"
                      name="num_titulares"
                      value={editableEquipo.num_titulares || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Número de Suplentes</label>
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
                <button type="button" className="btn btn-primary" onClick={handleSave}>
                  Guardar
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipoDetalle;