import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import apiClient, { peticion } from "../../config/apiClient";

const Equipos = ({onNavigate}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const currentUserId = localStorage.getItem("id");
  const [deportes, setDeportes] = useState([]);
  const navi = useNavigate();
  const prefijo = "/equipos/api/";
  const handleViewDetails = (equipo) => {
    onNavigate('EquipoDetalle', { id: equipo.id });
  };

  const loadDeportes = async () => {
    try {
      const response = await peticion(apiClient, "/deportes/api/");
      setDeportes(response.data);
    } catch (error) {
      console.error("Error al cargar los deportes:", error);
    }
  };

  useEffect(() => {
    peticion(apiClient, prefijo)
      .then((res) => {
        setData(res.data);
        setLoading(false);
        loadDeportes();
      })
      .catch((error) => {
        console.error("Error al cargar los datos:", error);
        setLoading(false);
      });
  }, []);

  const handleEdit = (editar) => {
    setCurrentData(editar);
    setShowModal(true);
  };

  const handleCreate = () => {
    setCurrentData({});
    setShowModal(true);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el equipo.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        peticion(apiClient, `${prefijo}${id}/`, "delete")
          .then(() => {
            setData(data.filter((equipo) => equipo.id !== id));
            Swal.fire("Eliminado", "Equipo eliminado con éxito.", "success");
          })
          .catch((error) => {
            console.error("Error al eliminar el equipo:", error);
            Swal.fire(
              "Error",
              "Ocurrió un error al eliminar el equipo.",
              "error"
            );
          });
      }
    });
  };

  const handleSave = () => {
    if (!currentData.nombre || !currentData.deporte) {
      Swal.fire(
        "Campos incompletos",
        "Por favor completa nombre y deporte.",
        "warning"
      );
      return;
    }
    const dataToSave = { ...currentData, entrenador: currentUserId };

    if (currentData.id) {
      peticion(apiClient, `${prefijo}${currentData.id}/`, "put", dataToSave)
        .then((res) => {
          setData(
            data.map((equipo) =>
              equipo.id === currentData.id ? res.data : equipo
            )
          );
          setShowModal(false);
          Swal.fire("Actualizado", "Equipo actualizado con éxito.", "success");
        })
        .catch((error) => {
          console.error("Error al actualizar el equipo:", error);
          Swal.fire(
            "Error",
            "Ocurrió un error al actualizar el equipo.",
            "error"
          );
        });
    } else {
      peticion(apiClient, prefijo, "post", dataToSave)
        .then((res) => {
          setData([...data, res.data]);
          setShowModal(false);
          Swal.fire("Creado", "Equipo creado con éxito.", "success");
        })
        .catch((error) => {
          console.error("Error al crear el equipo:", error);
          Swal.fire("Error", "Ocurrió un error al crear el equipo.", "error");
        });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentData({ ...currentData, [name]: value });
  };

  return (
    <div>
      <h3>Tabla de equipos</h3>
      <button className="btn btn-success mb-3" onClick={handleCreate}>
        <i className="bi bi-plus"></i> Crear equipo
      </button>

      <div className="row">
        {data.map((equipo) => (
          <div className="col-md-4 mb-4" key={equipo.id}>
            <div className="card h-100 shadow-sm">
              <img
                src={equipo.imagen}
                className="card-img-top"
                alt={equipo.nombre}
              />
              <div className="card-body">
                <h5 className="card-title">{equipo.nombre}</h5>
                <div className="d-flex justify-content-between">
                  <div className="text-success text-center">
                    <h6 className="mb-0">{equipo.victorias}</h6>
                    <small>Victorias</small>
                  </div>
                  <div className="text-danger text-center">
                    <h6 className="mb-0">{equipo.derrotas}</h6>
                    <small>Derrotas</small>
                  </div>
                </div>
              </div>
              <div className="card-footer d-flex justify-content-between">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleViewDetails(equipo)}
                >
                  VER INFORMACIÖN
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(equipo.id)}
                >
                  ELIMINAR EQUIPO
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5>{currentData.id ? "Editar Equipo" : "Crear Equipo"}</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowModal(false)}
                >
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
                      value={currentData.nombre || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Logo (URL)</label>
                    <input
                      type="text"
                      className="form-control"
                      name="logo_url"
                      value={currentData.logo_url || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Descripción</label>
                    <textarea
                      className="form-control"
                      name="descripcion"
                      value={currentData.descripcion || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Ciudad</label>
                    <input
                      type="text"
                      className="form-control"
                      name="ciudad"
                      value={currentData.ciudad || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <input
                    type="hidden"
                    name="entrenador"
                    value={currentUserId || ""}
                    onChange={handleInputChange}
                  />
                  <div className="form-group">
                    <label>Deporte</label>
                    <select
                      className="form-control"
                      name="deporte"
                      value={currentData.deporte || ""}
                      onChange={handleInputChange}
                    >
                      <option value="">Selecciona un deporte</option>
                      {deportes.map((deporte) => (
                        <option key={deporte.id} value={deporte.id}>
                          {deporte.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Número de Titulares</label>
                    <input
                      type="number"
                      className="form-control"
                      name="num_titulares"
                      value={currentData.num_titulares || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Número de Suplentes</label>
                    <input
                      type="number"
                      className="form-control"
                      name="num_suplentes"
                      value={currentData.num_suplentes || ""}
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
                    setCurrentData(null);
                  }}
                >
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

export default Equipos;
