import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import apiClient, { peticion } from "../../config/apiClient";

const Posiciones = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const [deportes, setDeportes] = useState([]);
  const prefijo = "/posicion/api/";
  const prefijoDeportes = "/config_deporte/api/";

  const fetchData = async () => {
    try {
      const respDeportes = await peticion(apiClient, prefijoDeportes);
      const deportesFormateados = respDeportes.data.map(config => ({
        id: config.deporte.id,
        nombre: config.deporte.nombre
      }));
      setDeportes(deportesFormateados);

      const respPosiciones = await peticion(apiClient, prefijo);
      setData(respPosiciones.data);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      Swal.fire("Error", "No se pudieron cargar los datos", "error");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (editar) => {
    setCurrentData(editar);
    setShowModal(true);
  };

  const handleCreate = () => {
    setCurrentData({
      nombre: "",
      deporte: ""
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la posición.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        peticion(apiClient, `${prefijo}${id}/`, "delete")
          .then(() => {
            setData(data.filter((posicion) => posicion.id !== id));
            Swal.fire("Eliminado", "Posición eliminada con éxito.", "success");
          })
          .catch((error) => {
            console.error("Error al eliminar la posición:", error);
            Swal.fire("Error", "Ocurrió un error al eliminar la posición.", "error");
          });
      }
    });
  };

  const handleSave = () => {
    if (!currentData.nombre || !currentData.deporte) {
      Swal.fire("Campos incompletos", "Por favor completa todos los campos obligatorios.", "warning");
      return;
    }

    const datosAEnviar = {
      ...currentData,
      deporte: parseInt(currentData.deporte, 10)
    };

    if (currentData.id) {
      peticion(apiClient, `${prefijo}${currentData.id}/`, "put", datosAEnviar)
        .then((res) => {
          setData(
            data.map((posicion) =>
              posicion.id === currentData.id ? res.data : posicion
            )
          );
          setShowModal(false);
          Swal.fire("Éxito", "Posición actualizada con éxito.", "success");
        })
        .catch((error) => {
          console.error("Error al actualizar la posición:", error);
          Swal.fire("Error", "Ocurrió un error al actualizar la posición.", "error");
        });
    } else {
      peticion(apiClient, prefijo, "post", datosAEnviar)
        .then((res) => {
          setData([...data, res.data]);
          setShowModal(false);
          Swal.fire("Éxito", "Posición creada con éxito.", "success");
        })
        .catch((error) => {
          console.error("Error al crear la posición:", error);
          Swal.fire("Error", "Ocurrió un error al crear la posición.", "error");
        });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentData({ ...currentData, [name]: value });
  };

  return (
    <div>
      <h3>Tabla de posiciones</h3>
      <button className="btn btn-success mb-3" onClick={handleCreate}>
        <i className="bi bi-plus"></i> Crear posición
      </button>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Cargando...</span>
          </div>
        </div>
      ) : (
        <>
          {deportes.length > 0 ? (
            <>
              {deportes.map((deporte) => {
                const posicionesDeporte = data.filter(
                  (posicion) => posicion.deporte === deporte.id || 
                               (typeof posicion.deporte === 'object' && posicion.deporte?.id === deporte.id)
                );
                
                return posicionesDeporte.length > 0 ? (
                  <div key={deporte.id} className="mb-4">
                    <h4>{deporte.nombre}</h4>
                    <div className="row">
                      {posicionesDeporte.map((posicion) => (
                        <div className="col-md-4 mb-3" key={posicion.id}>
                          <div className="card h-100 shadow-sm">
                            <div className="card-body">
                              <h5 className="card-title">{posicion.nombre}</h5>
                              <p className="card-text">
                                Deporte: {deporte.nombre}
                              </p>
                            </div>
                            <div className="card-footer d-flex justify-content-between">
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() => handleEdit(posicion)}
                              >
                                EDITAR POSICIÓN
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDelete(posicion.id)}
                              >
                                ELIMINAR POSICIÓN
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null;
              })}
              
              {/* Si no hay posiciones para ningún deporte, mostramos mensaje */}
              {data.length === 0 && (
                <div className="alert alert-info">
                  No hay posiciones registradas. ¡Crea la primera!
                </div>
              )}
            </>
          ) : (
            <div className="alert alert-warning">
              No hay deportes configurados. Por favor, crea primero un deporte en la sección de Deportes.
            </div>
          )}
          
          {/* Si hay posiciones sin deporte asociado o con deportes que ya no existen */}
          {data.filter(
            (posicion) => !deportes.some((d) => d.id === posicion.deporte || 
                                             (typeof posicion.deporte === 'object' && d.id === posicion.deporte?.id))
          ).length > 0 && (
            <div className="mb-4">
              <h4>Otras posiciones</h4>
              <div className="row">
                {data
                  .filter(
                    (posicion) => !deportes.some((d) => d.id === posicion.deporte || 
                                                   (typeof posicion.deporte === 'object' && d.id === posicion.deporte?.id))
                  )
                  .map((posicion) => (
                    <div className="col-md-4 mb-3" key={posicion.id}>
                      <div className="card h-100 shadow-sm">
                        <div className="card-body">
                          <h5 className="card-title">{posicion.nombre}</h5>
                          <p className="card-text text-danger">
                            Deporte no encontrado (ID: {typeof posicion.deporte === 'object' ? posicion.deporte?.id : posicion.deporte})
                          </p>
                        </div>
                        <div className="card-footer d-flex justify-content-between">
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleEdit(posicion)}
                          >
                            EDITAR POSICIÓN
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(posicion.id)}
                          >
                            ELIMINAR POSICIÓN
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </>
      )}

      {showModal && (
        <div className="modal d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5>{currentData.id ? "Editar Posición" : "Crear Posición"}</h5>
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
                  <div className="form-group mb-3">
                    <label>Nombre <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      name="nombre"
                      value={currentData?.nombre || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label>Deporte <span className="text-danger">*</span></label>
                    <select
                      className="form-control"
                      name="deporte"
                      value={currentData?.deporte || ""}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Selecciona un deporte</option>
                      {deportes.map((deporte) => (
                        <option key={deporte.id} value={deporte.id}>
                          {deporte.nombre}
                        </option>
                      ))}
                    </select>
                    <small className="form-text text-muted">
                      El nombre de la posición debe ser único para cada deporte.
                    </small>
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

export default Posiciones;