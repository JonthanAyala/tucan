import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient, { peticion } from "../../config/apiClient";

const Deportes = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const currentUserId = localStorage.getItem("id");
  const navi = useNavigate();
  const prefijo = "/config_deporte/api/";

  const fetchData = async () => {
    peticion(apiClient, prefijo)
    .then((res) => {
      setData(res.data);
      setLoading(false);
    })
    .catch((error) => {
      console.error("Error al cargar los datos:", error);
      setLoading(false);
    });
}

  useEffect(() => {
    fetchData();
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
    if (!window.confirm("¿Estás seguro de que deseas eliminar este equipo?"))
      return;

    peticion(apiClient, `${prefijo}${id}/`, "delete")
      .then(() => {
        setData(data.filter((datamap) => datamap.deporte.id !== id));
        alert("Equipo eliminado con éxito.");
      })
      .catch((error) => {
        console.error("Error al eliminar el equipo:", error);
        alert("Ocurrió un error al eliminar el equipo.");
      });
  };

  const handleSave = () => {
    console.log("currentData", currentData);
    if (currentData.deporte.id) {
      peticion(apiClient, `${prefijo}${currentData.deporte.id}/`, "put", currentData)
        .then((res) => {
          setData(
            data.map((datamap) =>
                datamap.deporte.id === currentData.deporte.id ? res.data : datamap
            )
          );
          setShowModal(false);
          alert("Equipo actualizado con éxito.");
        })
        .catch((error) => {
          console.error("Error al actualizar el equipo:", error);
          alert("Ocurrió un error al actualizar el equipo.");
        });
    } else {
      peticion(apiClient, prefijo, "post", currentData)
        .then((res) => {
          setData([...data, res.data]);
          setShowModal(false);
          alert("Equipo creado con éxito.");
        })
        .catch((error) => {
          console.error("Error al crear el equipo:", error);
          alert("Ocurrió un error al crear el equipo.");
        });
    }
  };

  return (
    <div>
      <h3>Tabla de deportes</h3>
      <button className="btn btn-success mb-3" onClick={handleCreate}>
        <i className="bi bi-plus"></i> Crear equipo
      </button>

      <div className="row">
        {data.map((config) => (
          <div className="col-md-4 mb-4" key={config.deporte.id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{config.deporte.nombre}</h5>
                <p className="mb-1">
                  <strong>Máx. Titulares:</strong> {config.max_titulares}
                </p>
                <p>
                  <strong>Máx. Suplentes:</strong> {config.max_suplentes}
                </p>
              </div>
              <div className="card-footer d-flex justify-content-between">
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => handleEdit(config)}
                >
                  EDITAR CONFIGURACIÓN
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(config.deporte.id)}
                >
                  ELIMINAR CONFIGURACIÓN
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
                <h5>
                  {currentData.id
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
                  {/* Datos del deporte */}
                  <div className="form-group">
                    <label>Nombre del Deporte</label>
                    <input
                      type="text"
                      className="form-control"
                      value={currentData.deporte?.nombre || ""}
                      onChange={(e) =>
                        setCurrentData({
                          ...currentData,
                          deporte: {
                            ...currentData.deporte,
                            nombre: e.target.value,
                          },
                        })
                      }
                      placeholder="Nombre del deporte"
                    />
                  </div>
                  <div className="form-group">
                    <label>Máx. Titulares</label>
                    <input
                      type="number"
                      className="form-control"
                      value={currentData.max_titulares || ""}
                      onChange={(e) =>
                        setCurrentData({
                          ...currentData,
                          max_titulares: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Máx. Suplentes</label>
                    <input
                      type="number"
                      className="form-control"
                      value={currentData.max_suplentes || ""}
                      onChange={(e) =>
                        setCurrentData({
                          ...currentData,
                          max_suplentes: e.target.value,
                        })
                      }
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

export default Deportes;
