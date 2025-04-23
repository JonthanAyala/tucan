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
    Object.keys(invalid).forEach((key) => {
      if(invalid[key] === true) {
        setCountErrors((prevCount) => prevCount + 1);
      }
    });
    
    if (countErrrors > 0) {
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
      <h3 className="mb-3">Configuración de Deportes</h3>
      <button className="btn btn-success mb-3" onClick={handleCreate}>
        <i className="bi bi-plus"></i> Crear configuración
      </button>

      {loading ? (
        <p>Cargando deportes...</p>
      ) : (
        <div className="row">
          {data.map((config) => (
            <div className="col-md-4 mb-4" key={config.deporte.id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{config.deporte.nombre}</h5>
                  <p>
                    <strong>Máx. Titulares:</strong> {config.max_titulares}
                  </p>
                  <p>
                    <strong>Máx. Suplentes:</strong> {config.max_suplentes}
                  </p>
                </div>
                <div className="card-footer d-flex justify-content-between">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleViewDetails(config)}
                  >
                    VER INFORMACIÖN
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
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
                  <div className="form-group">
                    <label>Nombre del Deporte</label>
                    <input
                      type="text"
                      className={`form-control ${
                        invalid.nombre ? "is-invalid" : ""
                      }`}
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
                            /^[a-zA-Z0-9\s]+$/.test(
                              value
                            ) ||
                            value === ""
                          ) {
                            setInvalid({ ...invalid, nombre: false });
                            setCurrentData({
                              ...currentData,
                              deporte: {
                                ...currentData.deporte,
                                nombre: e.target.value,
                              },
                            });
                          } else {
                            setInvalid({ ...invalid, nombre: true });
                          }
                        }, 1000);
                      }}
                    />
                    {invalid.nombre && (
                      <div className="text-danger">
                        El nombre solo puede contener letras y números.
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Máx. Titulares</label>
                    <input
                      type="number"
                      className={`form-control ${invalid.max_titulares ? "is-invalid" : ""}`}
                      value={currentData.max_titulares || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setCurrentData({
                          ...currentData,
                          max_titulares: e.target.value,
                        });
                        setTimeout(() => {
                          if (
                            /^[0-9]+$/.test(
                              value
                            ) && value < 0 ||
                            value === ""
                          ) {
                            setInvalid({ ...invalid, max_titulares: false });
                            setCurrentData({
                              ...currentData,
                              max_titulares: e.target.value,
                            });
                          } else {
                            setInvalid({ ...invalid, max_titulares: true });
                          }
                        }, 1000);
                      }}
                    />
                    {invalid.max_titulares && (
                      <div className="text-danger">
                        El número de titulares solo puede contener números positivos.
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Máx. Suplentes</label>
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
                          if (
                            /^[0-9]+$/.test(
                              value
                            ) && value < 0 ||
                            value === ""
                          ) {
                            setInvalid({ ...invalid, max_suplentes: false });
                            setCurrentData({
                              ...currentData,
                              max_suplentes: e.target.value,
                            });
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
                  onClick={() => setShowModal(false)}
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
