import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import apiClient, { peticion } from "../../config/apiClient"; // Asegurate de que el path sea correcto

const MySwal = withReactContent(Swal);

const Usuarios = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const currentUserId = localStorage.getItem("id");
  const navi = useNavigate();

  useEffect(() => {
    peticion(apiClient, "/usuarios/api/")
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al cargar los datos:", error);
        setLoading(false);
      });
  }, []);

  const handleEdit = (user) => {
    setCurrentUser(user);
    setShowModal(true);
  };

  const handleCreate = () => {
    setCurrentUser({});
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (id == currentUserId) {
      MySwal.fire("Oops", "No puedes eliminar tu propio usuario.", "warning");
      return;
    }

    const result = await MySwal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará al usuario permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      peticion(apiClient, `/usuarios/api/${id}/`, "delete")
        .then(() => {
          setData(data.filter((user) => user.id !== id));
          MySwal.fire("Eliminado", "Usuario eliminado con éxito.", "success");
        })
        .catch(() => {
          MySwal.fire("Error", "No se pudo eliminar el usuario.", "error");
        });
    }
  };

  const handleSave = () => {
    const esEdicion = !!currentUser.id;
    const ruta = esEdicion
      ? `/usuarios/api/${currentUser.id}/`
      : `/usuarios/api/`;
    const metodo = esEdicion ? "put" : "post";

    if (!currentUser.nombre || !currentUser.email) {
      MySwal.fire("Error", "Por favor completa los campos requeridos.", "error");
      return;
    }

    peticion(apiClient, ruta, metodo, currentUser)
      .then((res) => {
        if (esEdicion) {
          setData(data.map((u) => (u.id === res.data.id ? res.data : u)));
        } else {
          setData([...data, res.data]);
        }
        setShowModal(false);
        setCurrentUser(null);
        MySwal.fire(
          esEdicion ? "Actualizado" : "Creado",
          `Usuario ${esEdicion ? "actualizado" : "creado"} con éxito.`,
          "success"
        );
      })
      .catch(() => {
        MySwal.fire("Error", "Hubo un problema al guardar el usuario.", "error");
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser({ ...currentUser, [name]: value });
  };

  const columns = [
    {
      name: "Nombre",
      selector: (row) => row.nombre,
      sortable: true,
    },
    {
      name: "Usuario",
      selector: (row) => row.username,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Rol",
      selector: (row) => row.rol.charAt(0).toUpperCase() + row.rol.slice(1),
    },
    {
      name: "Acciones",
      cell: (row) => (
        <span>
          <button className="btn btn-warning me-2" onClick={() => handleEdit(row)}>
            <i className="bi bi-pencil"></i>
          </button>
          <button
            className="btn btn-danger"
            onClick={() => handleDelete(row.id)}
            disabled={row.id === currentUserId}
          >
            <i className="bi bi-trash"></i>
          </button>
        </span>
      ),
    },
  ];

  return (
    <div>
      <h3 className="mb-4">👤 Gestión de Usuarios</h3>
      <div className="card shadow-lg border-0 mb-4">
        <div className="card-body">
          <button className="btn btn-success mb-3" onClick={handleCreate}>
            <i className="bi bi-plus-lg"></i> Crear Usuario
          </button>
          <DataTable
            columns={columns}
            data={data}
            progressPending={loading}
            pagination
            highlightOnHover
            pointerOnHover
            noDataComponent="No hay usuarios disponibles."
          />
        </div>
      </div>

      {showModal && (
        <div className="modal d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content rounded-4 shadow">
              <div className="modal-header">
                <h5 className="modal-title">
                  {currentUser.id ? "Editar Usuario" : "Crear Usuario"}
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
                    <label>Nombre</label>
                    <input
                      type="text"
                      className="form-control"
                      name="nombre"
                      value={currentUser.nombre || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label>Apellidos</label>
                    <input
                      type="text"
                      className="form-control"
                      name="apellidos"
                      value={currentUser.apellidos || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label>Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={currentUser.email || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label>Detalles</label>
                    <textarea
                      className="form-control"
                      name="detalles"
                      value={currentUser.detalles || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label>Activo</label>
                    <select
                      className="form-control"
                      name="is_active"
                      value={currentUser.is_active ? "true" : "false"}
                      onChange={(e) =>
                        handleInputChange({
                          target: {
                            name: "is_active",
                            value: e.target.value === "true",
                          },
                        })
                      }
                    >
                      <option value="true">Sí</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                  {!currentUser.id && (
                    <>
                      <div className="form-group mb-3">
                        <label>Nueva Contraseña</label>
                        <input
                          type="password"
                          className="form-control"
                          name="password"
                          value={currentUser.password || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group mb-3">
                        <label>Confirmar Contraseña</label>
                        <input
                          type="password"
                          className="form-control"
                          name="confirmPassword"
                          value={currentUser.confirmPassword || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                    </>
                  )}
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
                    setCurrentUser(null);
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

export default Usuarios;
