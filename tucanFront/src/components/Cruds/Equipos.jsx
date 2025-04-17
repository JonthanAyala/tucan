import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import apiClient, { peticion } from "../../config/apiClient";

const Equipos = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentData, setCurrentData] = useState({});
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [deportes, setDeportes] = useState([]);
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
        setDeportes(deportesRes.data);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
    if (!currentData.nombre || !currentData.deporte) {
      Swal.fire(
        "Campos incompletos",
        "Por favor completa nombre y deporte.",
        "warning"
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
          Swal.fire(
            "Error",
            "Ocurrió un error al actualizar el equipo.",
            "error"
          );
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
          Swal.fire("Error", "Ocurrió un error al crear el equipo.", "error");
        });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentData({ ...currentData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
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
                  className="btn btn-success btn-sm"
                  onClick={() => handleEdit(equipo)}
                >
                  EDITAR EQUIPO
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
                    <label>Logo (imagen)</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>

                  {logoPreview && (
                    <div className="text-center my-2">
                      <img
                        src={logoPreview}
                        alt="Vista previa"
                        style={{ maxHeight: "150px", objectFit: "contain" }}
                      />
                    </div>
                  )}

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
