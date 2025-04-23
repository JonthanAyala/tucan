import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import apiClient, { peticion } from "../../config/apiClient";

const Equipos = ({ onNavigate }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentData, setCurrentData] = useState({});
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [deportes, setDeportes] = useState([]);
  const [mostrarActivos, setMostrarActivos] = useState(true);
  const currentUserId = localStorage.getItem("id");
  const navi = useNavigate();
  const prefijo = "/equipos/api/";
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [equiposRes, deportesRes] = await Promise.all([
          peticion(apiClient, prefijo),
          peticion(apiClient, "/deportes/api/")
        ]);

        setData(equiposRes.data);
  
        setDeportes(deportesRes.data.map((deporte) => ({
          ...deporte,
          max_titulares: deporte.max_titulares ,
          max_suplentes: deporte.max_suplentes,
        })));
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleViewDetails = (equipo) => {
    onNavigate('EquipoDetalle', { id: equipo.id });
  };



  const filtrarEquipos = () => {
    return data.filter(
      (equipo) =>
        equipo.entrenador === currentUserId && equipo.activo === mostrarActivos
    );
  };
  const handleEdit = (editar) => {
    setCurrentData(editar);
    setLogoPreview(editar.logo || null);
    setLogoFile(null);
    setShowModal(true);
  };

  const handleCreate = () => {
    setCurrentData({});
    setLogoPreview(null);
    setLogoFile(null);
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
    // Validar que todos los campos obligatorios estén completos
    if (!currentData.nombre || !currentData.deporte) {
        Swal.fire(
            "Campos incompletos",
            "Por favor completa los campos obligatorios: Nombre y Deporte.",
            "warning"
        );
        return;
    }

    // Validar que el nombre solo contenga letras, números y espacios
    if (!/^[a-zA-Z0-9\s]+$/.test(currentData.nombre)) {
        Swal.fire(
            "Nombre inválido",
            "El nombre solo puede contener letras, números y espacios.",
            "error"
        );
        return;
    }

    // Validar que la descripción solo contenga letras, números, espacios, puntos y comas
    if (
        currentData.descripcion &&
        !/^[a-zA-Z0-9\s.,]+$/.test(currentData.descripcion)
    ) {
        Swal.fire(
            "Descripción inválida",
            "La descripción solo puede contener letras, números, espacios, puntos y comas.",
            "error"
        );
        return;
    }

    // Validar que la ciudad solo contenga letras y espacios
    if (currentData.ciudad && !/^[a-zA-Z\s]+$/.test(currentData.ciudad)) {
        Swal.fire(
            "Ciudad inválida",
            "La ciudad solo puede contener letras y espacios.",
            "error"
        );
        return;
    }

    const formData = new FormData();
    formData.append("nombre", currentData.nombre);
    formData.append("descripcion", currentData.descripcion || "");
    formData.append("ciudad", currentData.ciudad || "");
    formData.append("deporte", currentData.deporte);
    formData.append("entrenador", currentUserId);
    formData.append("num_titulares", currentData.num_titulares || 0);
    formData.append("num_suplentes", currentData.num_suplentes || 0);

    if (logoFile) {
        formData.append("logo", logoFile);
    }

    // Solo enviar el campo "activo" si estás editando un equipo
    if (currentData.id) {
        formData.append("activo", currentData.activo);
    }

    const headers = { "Content-Type": "multipart/form-data" };

    if (currentData.id) {
        peticion(apiClient, `${prefijo}${currentData.id}/`, "put", formData, headers)
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

                    Swal.fire("Error", mensajeError || "No se pudo actualizar el equipo.", "error");
                } else {
                    Swal.fire(
                        "Error",
                        "Ocurrió un error al actualizar el equipo.",
                        "error"
                    );
                }
            });
    } else {
        peticion(apiClient, prefijo, "post", formData, headers)
            .then((res) => {
                setData([...data, res.data]);
                setShowModal(false);
                Swal.fire("Creado", "Equipo creado con éxito.", "success");
            })
            .catch((error) => {
                console.error("Error al crear el equipo:", error);
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

                    Swal.fire("Error", mensajeError || "No se pudo crear el equipo.", "error");
                } else {
                    Swal.fire(
                        "Error",
                        "Ocurrió un error al crear el equipo.",
                        "error"
                    );
                }
            });
    }
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    // Si el campo modificado es "deporte", actualizamos los titulares y suplentes automáticamente
    if (name === "deporte") {
      const selectedDeporte = deportes.find((deporte) => deporte.id === parseInt(value));
      if (selectedDeporte) {
        setCurrentData({
          ...currentData,
          [name]: value,
          num_titulares: selectedDeporte.max_titulares || 0,
          num_suplentes: selectedDeporte.max_suplentes || 0,
        });
      } else {
        setCurrentData({ ...currentData, [name]: value });
      }
    } else {
      setCurrentData({ ...currentData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleToggleEstado = (equipo) => {
    peticion(apiClient, `${prefijo}${equipo.id}/cambiar_estado/`, "post")
      .then(() => {
        setData(
          data.map((e) =>
            e.id === equipo.id ? { ...e, activo: !e.activo } : e
          )
        );
        Swal.fire(
          "Estado cambiado",
          `El equipo ahora está ${equipo.activo ? "inactivo" : "activo"}.`,
          "success"
        );
      })
      .catch((error) => {
        console.error("Error al cambiar el estado:", error);
        Swal.fire(
          "Error",
          "No se pudo cambiar el estado del equipo.",
          "error"
        );
      });
  };

  return (
    <div>
      <h3>Tabla de equipos</h3>
      <button className="btn btn-success mb-3" onClick={handleCreate}>
        <i className="bi bi-plus"></i> Crear equipo
      </button>

      <div className="mb-3">
        <button
          className={`btn ${mostrarActivos ? "btn-primary" : "btn-secondary"} me-2`}
          onClick={() => setMostrarActivos(true)}
        >
          Activos
        </button>
        <button
          className={`btn ${!mostrarActivos ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setMostrarActivos(false)}
        >
          Inactivos
        </button>
      </div>

      <div className="row">
  {filtrarEquipos().length > 0 ? (
    filtrarEquipos().map((equipo) => (
      <div className="col-md-4 mb-4" key={equipo.id}>
        <div className="card h-100 shadow-sm">
          {equipo.logo && (
            <img
              src={equipo.logo}
              className="card-img-top"
              alt={equipo.nombre}
              style={{ height: "200px", objectFit: "cover" }}
            />
          )}
          <div className="card-body">
            <h5 className="card-title">{equipo.nombre}</h5>
            <p className="text-muted">{equipo.ciudad}</p>
          </div>
          <div className="card-footer d-flex justify-content-between">
            <button
              className={`btn btn-sm ${equipo.activo ? "btn-primary" : "btn-secondary"}`}
              onClick={() => handleViewDetails(equipo)}
            >
              VER INFORMACIÓN
            </button>
            <button
              className={`btn btn-sm ${equipo.activo ? "btn-danger" : "btn-success"}`}
              onClick={() => handleToggleEstado(equipo)}
            >
              {equipo.activo ? "Desactivar" : "Activar"}
            </button>
          </div>
        </div>
      </div>
    ))
  ) : (
    <div className="text-center mt-4">
      <h5 className="text-muted">Aún no tienes un equipo</h5>
    </div>
  )}
</div>

      {showModal && (
        <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div className="modal-content rounded-4">
              <div className="modal-header">
                <h5 className="modal-title">
                  {currentData.id ? "Editar Equipo" : "Crear Equipo"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    setCurrentData({});
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
                      value={currentData.nombre || ""}
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
                  {(logoPreview || currentData.logo) && (
                    <div className="text-center my-2">
                      <img
                        src={logoPreview || currentData.logo}
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
                      rows="3"
                      value={currentData.descripcion || ""}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Ciudad</label>
                    <input
                      type="text"
                      className="form-control"
                      name="ciudad"
                      value={currentData.ciudad || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Deporte</label>
                    <select
                      className="form-select"
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
                  <div className="col-md-6">
                    <label className="form-label">Número de Titulares</label>
                    <input
                      type="number"
                      className="form-control"
                      name="num_titulares"
                      value={currentData.num_titulares || ""}
                      onChange={handleInputChange}
                      disabled
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Número de Suplentes</label>
                    <input
                      type="number"
                      className="form-control"
                      name="num_suplentes"
                      value={currentData.num_suplentes || ""}
                      onChange={handleInputChange}
                      disabled
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
                    setCurrentData({});
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
    </div>
  );
};

export default Equipos;
