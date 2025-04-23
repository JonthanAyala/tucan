import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import apiClient, { peticion } from "../../config/apiClient";

const DeporteDetalles = ({ id }) => {
  const [deporte, setDeporte] = useState(null);
  const [posiciones, setPosiciones] = useState([]);
  const [editableDeporte, setEditableDeporte] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showPosicionesModal, setShowPosicionesModal] = useState(false);
  const [editablePosicion, setEditablePosicion] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resDeporte = await peticion(
          apiClient,
          `/config_deporte/api/${id}/`
        );
        console.log(resDeporte.data);

        setDeporte(resDeporte.data);

        const resPosiciones = await peticion(apiClient, `/posicion/api/`);
        const posicionesFiltradas = resPosiciones.data.filter(
          (posicion) => posicion.deporte === id
        );
        setPosiciones(posicionesFiltradas);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
        Swal.fire(
          "Error",
          "No se pudo cargar la información del deporte",
          "error"
        );
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleEditDeporte = () => {
    setEditableDeporte(deporte);
    setShowModal(true);
  };

  const handleDeleteDeporte = async () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el deporte y todas sus posiciones asociadas.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await peticion(apiClient, `/config_deporte/api/${id}/`, "delete");
          Swal.fire("Eliminado", "Deporte eliminado con éxito.", "success");
          setDeporte(null);
          setPosiciones([]);
        } catch (error) {
          console.error("Error al eliminar el deporte:", error);
          Swal.fire(
            "Error",
            "Ocurrió un error al eliminar el deporte.",
            "error"
          );
        }
      }
    });
  };

  const handleSaveDeporte = async () => {
    // Validar que el nombre del deporte no esté vacío
    if (!editableDeporte.deporte?.nombre) {
      Swal.fire(
        "Campos incompletos",
        "Por favor ingresa el nombre del deporte.",
        "warning"
      );
      return;
    }

    // Validar que el nombre solo contenga letras, números y espacios
    if (!/^[a-zA-Z0-9\s]+$/.test(editableDeporte.deporte.nombre)) {
      Swal.fire(
        "Nombre inválido",
        "El nombre solo puede contener letras, números y espacios.",
        "error"
      );
      return;
    }

    // Validar que el número máximo de titulares no sea negativo
    if (editableDeporte.max_titulares < 0) {
      Swal.fire(
        "Valor inválido",
        "El número máximo de titulares no puede ser negativo.",
        "error"
      );
      return;
    }

    // Validar que el número máximo de suplentes no sea negativo
    if (editableDeporte.max_suplentes < 0) {
      Swal.fire(
        "Valor inválido",
        "El número máximo de suplentes no puede ser negativo.",
        "error"
      );
      return;
    }

    try {
      const res = await peticion(
        apiClient,
        `/config_deporte/api/${id}/`,
        "put",
        editableDeporte
      );
      setDeporte(res.data);
      setShowModal(false);
      Swal.fire("Actualizado", "Deporte actualizado con éxito.", "success");
    } catch (error) {
      console.error("Error al actualizar el deporte:", error);

      if (error.response && error.response.data) {
        const errores = error.response.data;
        let mensajeError = "";

        for (const campo in errores) {
          if (Array.isArray(errores[campo])) {
            mensajeError += `${campo}: ${errores[campo].join(", ")}\n`;
          } else {
            mensajeError += `${campo}: ${errores[campo]}\n`;
          }
        }

        Swal.fire("Error", mensajeError || "Ocurrió un error al guardar.", "error");
      } else {
        Swal.fire(
          "Error",
          "Ocurrió un error al guardar. Por favor, inténtalo de nuevo.",
          "error"
        );
      }
    }
  };

  const handleEditPosicion = (posicion) => {
    setEditablePosicion(posicion);
    setShowPosicionesModal(true);
  };

  const handleSavePosicion = async () => {
    // Validar que el nombre de la posición no esté vacío
    if (!editablePosicion?.nombre) {
      Swal.fire(
        "Campos incompletos",
        "Por favor ingresa el nombre de la posición.",
        "warning"
      );
      return;
    }

    // Validar que el nombre solo contenga letras y espacios
    if (!/^[a-zA-Z\s]+$/.test(editablePosicion.nombre)) {
      Swal.fire(
        "Nombre inválido",
        "El nombre solo puede contener letras y espacios.",
        "error"
      );
      return;
    }

    try {
      if (editablePosicion.id === undefined) {
        editablePosicion.deporte = deporte.deporte.id;
        const res = await peticion(
          apiClient,
          `/posicion/api/`,
          "post",
          editablePosicion
        );
        setPosiciones([...posiciones, res.data]);
        setShowPosicionesModal(false);
        Swal.fire("Creado", "Posición creada con éxito.", "success");
      } else {
        const res = await peticion(
          apiClient,
          `/posicion/api/${editablePosicion.id}/`,
          "put",
          editablePosicion
        );
        setPosiciones(
          posiciones.map((pos) =>
            pos.id === editablePosicion.id ? res.data : pos
          )
        );
        setShowPosicionesModal(false);
        Swal.fire("Actualizado", "Posición actualizada con éxito.", "success");
      }
    } catch (error) {
      console.error("Error al guardar la posición:", error);

      if (error.response && error.response.data) {
        const errores = error.response.data;
        let mensajeError = "";

        for (const campo in errores) {
          if (Array.isArray(errores[campo])) {
            mensajeError += `${campo}: ${errores[campo].join(", ")}\n`;
          } else {
            mensajeError += `${campo}: ${errores[campo]}\n`;
          }
        }

        Swal.fire("Error", mensajeError || "Ocurrió un error al guardar.", "error");
      } else {
        Swal.fire(
          "Error",
          "Ocurrió un error al guardar. Por favor, inténtalo de nuevo.",
          "error"
        );
      }
    }
  };

  const handleDeletePosicion = async (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la posición.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await peticion(apiClient, `/posicion/api/${id}/`, "delete");
          setPosiciones(posiciones.filter((pos) => pos.id !== id));
          Swal.fire("Eliminado", "Posición eliminada con éxito.", "success");
        } catch (error) {
          console.error("Error al eliminar la posición:", error);
          Swal.fire(
            "Error",
            "Ocurrió un error al eliminar la posición.",
            "error"
          );
        }
      }
    });
  };

  if (!deporte) {
    return (
      <div className="text-center py-4">Por favor selecciona un Deporte</div>
    );
  }

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100%", overflow: "hidden" }}
    >
      <div
        className="card p-4 shadow-lg w-80"
        style={{ height: "100%", width: "80%" }}
      >
        <h1 className="text-center">{deporte.deporte.nombre}</h1>
        <div className="card-body">
          <div className="container row gy-4" style={{ height: "100%" }}>
            <div
              className="card col-6 p-5 shadow-sm mb-4"
              style={{ maxHeight: "90%", minHeight: "80%" }}
            >
              <div className="card-header bg-light">
                <h4 className="text-center">Información General</h4>
              </div>
              <div className="card-body">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex align-items-center">
                    <strong>Nombre:</strong>
                    <span className="ms-2">{deporte.deporte.nombre}</span>
                  </li>
                  <li className="list-group-item d-flex align-items-center">
                    <strong>Jugadores Titulares maximos:</strong>
                    <span className="ms-2">{deporte.max_titulares}</span>
                  </li>
                  <li className="list-group-item d-flex align-items-center">
                    <strong>Jugadores Suplentes maximos:</strong>
                    <span className="ms-2">{deporte.max_suplentes}</span>
                  </li>
                </ul>
                <div className="text-center mt-4">
                  <button
                    className="btn btn-success me-2"
                    onClick={handleEditDeporte}
                  >
                    Editar Información
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={handleDeleteDeporte}
                  >
                    Eliminar Deporte
                  </button>
                </div>
              </div>
            </div>
            <div
              className="card col-6 p-5 shadow-sm mb-4"
              style={{ maxHeight: "90%", overflowY: "auto", minHeight: "80%" }}
            >
              <div className="card-header bg-light">
                <h4 className="text-center">Posiciones</h4>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-end mb-3">
                  <button
                    className="btn btn-primary"
                    onClick={() => handleEditPosicion({})}
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Crear Posición
                  </button>
                </div>
                {posiciones.length === 0 ? (
                  <p className="text-muted text-center">
                    No hay posiciones registradas
                  </p>
                ) : (
                  <ul className="list-group list-group-flush">
                    {posiciones.map((posicion) => (
                      <li
                        key={posicion.id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <span>{posicion.nombre}</span>
                        <div className="d-flex justify-content-end">
                          <button
                            className="btn btn-primary btn-sm me-2"
                            onClick={() => handleEditPosicion(posicion)}
                          >
                            Editar
                          </button>
                          <button
                            className="btn btn-danger btn-sm me-2"
                            onClick={() => handleDeletePosicion(posicion.id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-4">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editableDeporte.deporte.id
                    ? "Editar Configuración"
                    : "Crear Configuración"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-group mb-3">
                    <label>Nombre del Deporte <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      value={editableDeporte.deporte?.nombre || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^[a-zA-Z\s]*$/.test(value)) {
                          setEditableDeporte({
                            ...editableDeporte,
                            deporte: {
                              ...editableDeporte.deporte,
                              nombre: value,
                            },
                          });
                        } else {
                          Swal.fire(
                            "Nombre inválido",
                            "El nombre solo puede contener letras y espacios.",
                            "error"
                          );
                        }
                      }}
                      required
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label>Máx. Titulares <span className="text-danger">*</span></label>
                    <input
                      type="number"
                      className="form-control"
                      value={editableDeporte.max_titulares || ""}
                      onChange={(e) => {
                        const value = parseInt(e.target.value, 10);
                        if (value >= 0) {
                          setEditableDeporte({
                            ...editableDeporte,
                            max_titulares: value,
                          });
                        } else {
                          Swal.fire(
                            "Valor inválido",
                            "El número máximo de titulares no puede ser negativo.",
                            "error"
                          );
                        }
                      }}
                      required
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label>Máx. Suplentes <span className="text-danger">*</span></label>
                    <input
                      type="number"
                      className="form-control"
                      value={editableDeporte.max_suplentes || ""}
                      onChange={(e) => {
                        const value = parseInt(e.target.value, 10);
                        if (value >= 0) {
                          setEditableDeporte({
                            ...editableDeporte,
                            max_suplentes: value,
                          });
                        } else {
                          Swal.fire(
                            "Valor inválido",
                            "El número máximo de suplentes no puede ser negativo.",
                            "error"
                          );
                        }
                      }}
                      required
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={handleSaveDeporte}>
                  Guardar
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPosicionesModal && (
        <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-4">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editablePosicion?.id
                    ? "Editar Configuración"
                    : "Crear Configuración"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowPosicionesModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-group mb-3">
                    <input
                      type="number"
                      value={editablePosicion?.id || ""}
                      hidden
                      onChange={(e) =>
                        setEditablePosicion({
                          ...editablePosicion,
                          id: e.target.value,
                        })
                      }
                    />
                    <label>Nombre de la Posición <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      value={editablePosicion?.nombre || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^[a-zA-Z\s]*$/.test(value)) {
                          setEditablePosicion({
                            ...editablePosicion,
                            nombre: value,
                          });
                        } else {
                          Swal.fire(
                            "Nombre inválido",
                            "El nombre solo puede contener letras y espacios.",
                            "error"
                          );
                        }
                      }}
                      required
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-primary"
                  onClick={handleSavePosicion}
                >
                  Guardar
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowPosicionesModal(false)}
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

export default DeporteDetalles;
