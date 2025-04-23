import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import apiClient, { peticion } from "../../config/apiClient";


const MySwal = withReactContent(Swal);

const Deportes = ({ onNavigate }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentData, setCurrentData] = useState({ deporte: {} });
  const [invalid, setInvalid] = useState({});
  const [countErrrors, setCountErrors] = useState(0);
  const navi = useNavigate();
  const prefijo = "/config_deporte/api/";

  const handleViewDetails = (deporte) => {
    onNavigate("Posiciones", { id: deporte.deporte.id });
  };

  const fetchData = async () => {
    try {
      const res = await peticion(apiClient, prefijo);
      setData(res.data);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      MySwal.fire("Error", "No se pudieron cargar los deportes.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = () => {
    setInvalid({});
    setCountErrors(0);
    setCurrentData({ deporte: {}, max_titulares: "", max_suplentes: "" });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const result = await MySwal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await peticion(apiClient, `${prefijo}${id}/`, "delete");
        setData(data.filter((d) => d.deporte.id !== id));
        MySwal.fire("Eliminado", "El deporte ha sido eliminado.", "success");
      } catch (error) {
        console.error("Error al eliminar el equipo:", error);
        MySwal.fire(
          "Error",
          "Ocurrió un error al eliminar el deporte.",
          "error"
        );
      }
    }
  };

  const handleSave = async () => {
    setCountErrors(0);

    const errorCount = Object.keys(invalid).reduce(
      (count, key) => (invalid[key] === true ? count + 1 : count),
      0
    );
  
    setCountErrors(errorCount); // Actualizar el estado (opcional, si necesitas mostrarlo en otro lugar)
  
    if (errorCount > 0) {
      MySwal.fire(
        "Error",
        "Por favor, corrige los errores antes de guardar.",
        "error"
      );
      return;
    }

    const payload = {
      ...currentData,
      deporte: {
        ...currentData.deporte,
      },
    };

    const isEdit = !!currentData.deporte?.id;

    try {
      const res = isEdit
        ? await peticion(
          apiClient,
          `${prefijo}${currentData.deporte.id}/`,
          "put",
          payload
        )
        : await peticion(apiClient, prefijo, "post", payload);

      setData((prevData) =>
        isEdit
          ? prevData.map((d) =>
            d.deporte.id === res.data.deporte.id ? res.data : d
          )
          : [...prevData, res.data]
      );

      MySwal.fire(
        "Éxito",
        isEdit ? "Deporte actualizado." : "Deporte creado.",
        "success"
      );
      setShowModal(false);
      setCountErrors(0);
      setInvalid({});
    } catch (error) {
      console.error("Error al guardar:", error);

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

        MySwal.fire("Error", mensajeError || "Ocurrió un error al guardar.", "error");
      } else {
        MySwal.fire(
          "Error",
          "Ocurrió un error al guardar. Por favor, inténtalo de nuevo.",
          "error"
        );
      }
    }
  };

  return (
    <div>
     <h2 className="fw-bold mb-4">Tabla de equipos</h2>
      <button className="btn btn-success mb-4 rounded-pill px-4 py-2 shadow-sm d-flex align-items-center gap-2" onClick={handleCreate}>
        <i className="bi bi-plus-lg"></i> Crear equipo
      </button>

      {loading ? (
        <p>Cargando deportes...</p>
      ) : (
        <div className="row">
          {data.map((config) => (
            <div className="col-md-4 mb-4" key={config.deporte.id}>
              <div className="card h-100 shadow-sm border-2 rounded-4 overflow-hidden">
                <div className="card-body">
                  <h5 className="card-title fw-bold">{config.deporte.nombre}</h5>
                  <p>
                    <strong>Máx. Titulares:</strong> {config.max_titulares}
                  </p>
                  <p>
                    <strong>Máx. Suplentes:</strong> {config.max_suplentes}
                  </p>
                </div>
                <div className="card-footer d-flex justify-content-between border-0 bg-light">
                  <button
                    className="btn btn-sm rounded-pill px-3 btn-outline-primary"
                    onClick={() => handleViewDetails(config)}
                  >
                    VER INFORMACIÖN
                  </button>
                  <button
                    className="btn btn-sm rounded-pill px-3 btn-outline-danger"
                    onClick={() => handleDelete(config.deporte.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content shadow">
              <div className="modal-header">
                <h5>
                  {currentData.deporte.id
                    ? "Editar Configuración"
                    : "Crear Configuración"}
                </h5>
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
                  {/* Validación del nombre del deporte */}
                  <div className="form-group">
                    <label>Nombre del Deporte <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className={`form-control ${
                        invalid.nombre ? "is-invalid" : ""
                      }`}
                      placeholder="Nombre del Deporte"
                      autoFocus
                      required
                      maxLength={45}
                      value={currentData.deporte?.nombre || ""}
                      onChange={(e) =>{
                        const value = e.target.value;
                        setCurrentData({
                          ...currentData,
                          deporte: {
                            ...currentData.deporte,
                            nombre: e.target.value,
                          },
                        });
                        setTimeout(() => {
                          if (
                            /^[A-Za-z0-9_ ]+$/.test(
                              value
                            ) ||
                            value === ""
                          ) {
                            setInvalid({ ...invalid, nombre: false });
                          } else {
                            setInvalid({ ...invalid, nombre: true });
                          }
                        }, 500);
                      }}
                      
                    />
                    {invalid.nombre && (
                      <div className="text-danger">
                        El nombre solo puede contener letras y números.
                      </div>
                    )}
                  </div>

                  {/* Validación del número máximo de titulares */}
                  <div className="form-group">
                    <label>Máx. Titulares <span className="text-danger">*</span></label>
                    <input
                      type="number"
                      min="0"
                      max="99"
                      className={`form-control ${invalid.max_titulares ? "is-invalid" : ""}`}
                      value={currentData.max_titulares || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setCurrentData({
                          ...currentData,
                          max_titulares: e.target.value,
                        });
                        setTimeout(() => {
                          const numericValue = Number(value);
                          if ((/^[0-9]+$/.test(value) && numericValue >= 0) || value === "") {
                            setInvalid({ ...invalid, max_titulares: false });
                          } else {
                            setInvalid({ ...invalid, max_titulares: true });
                          }
                        }, 10);
                      }}
                    />
                    {invalid.max_titulares && (
                      <div className="text-danger">
                        El número de titulares solo puede contener números positivos.
                      </div>
                    )}
                  </div>

                  {/* Validación del número máximo de suplentes */}
                  <div className="form-group">
                    <label>Máx. Suplentes <span className="text-danger">*</span></label>
                    <input
                      type="number"
                      className={`form-control ${invalid.max_suplentes ? "is-invalid" : ""}`}
                      value={currentData.max_suplentes || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setCurrentData({
                          ...currentData,
                          max_suplentes: e.target.value,
                        });
                        setTimeout(() => {
                          const numericValue = Number(value); // Convertir a número
                          if ((/^[0-9]+$/.test(value) && numericValue >= 0) || value === "") {
                            setInvalid({ ...invalid, max_suplentes: false });
                          } else {
                            setInvalid({ ...invalid, max_suplentes: true });
                          }
                        }, 1000);
                      }}
                    />
                    {invalid.max_suplentes && (
                      <div className="text-danger">
                        El número de suplentes solo puede contener números positivos.
                      </div>
                    )}
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={handleSave}>
                  Guardar
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowModal(false);
                    setCountErrors(0);
                    setInvalid({});
                  }
                }
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

export default Deportes;
