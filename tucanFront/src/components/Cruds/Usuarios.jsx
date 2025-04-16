import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import apiClient, { peticion } from "../../config/apiClient"; // Asegurate de que el path sea correcto

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

  const handleDelete = (id) => {
    if (id == currentUserId) {
      alert("No puedes eliminar tu propio usuario.");
      return;
    }
    if (!window.confirm("¿Estás seguro de que deseas eliminar este usuario?"))
      return;

    peticion(apiClient, `/usuarios/api/${id}/`, "delete")
      .then(() => {
        setData(data.filter((user) => user.id !== id));
        alert("Usuario eliminado con éxito.");
      })
      .catch((error) => {
        console.error("Error al eliminar el usuario:", error);
        alert("Ocurrió un error al eliminar el usuario.");
      });
  };

  const handleSave = () => {
    if (currentUser.id) {
      // Actualización de usuario existente
      peticion(
        apiClient,
        `/usuarios/api/${currentUser.id}/`,
        "put",
        currentUser
      )
        .then((res) => {
          setData(
            data.map((user) => (user.id === currentUser.id ? res.data : user))
          );
          setShowModal(false);
          alert("Usuario actualizado con éxito.");
        })
        .catch((error) => {
          console.error("Error al actualizar el usuario:", error);
          alert("Ocurrió un error al actualizar el usuario.");
        });
    } else {
      // Creación de un nuevo usuario
      peticion(apiClient, `/usuarios/api/`, "post", currentUser)
        .then((res) => {
          setData([...data, res.data]);
          setShowModal(false);
          alert("Usuario creado con éxito.");
        })
        .catch((error) => {
          console.error("Error al crear el usuario:", error);
          alert("Ocurrió un error al crear el usuario.");
        });
    }
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
          <button
            className="btn btn-warning me-4"
            onClick={() => handleEdit(row)}
          >
            <i className="bi bi-pencil"></i>
          </button>
          <button
            className="btn btn-danger me-4"
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
      <h3>Tabla de usuarios</h3>
      <button className="btn btn-success mb-3" onClick={handleCreate}>
        <i className="bi bi-plus"></i> Crear Usuario
      </button>
      <DataTable
        columns={columns}
        data={data}
        progressPending={loading}
        pagination
        highlightOnHover
        pointerOnHover
      />
      {showModal && (
        <div className="modal d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                {currentUser.id ? "Editar Usuario" : "Crear Usuario"}
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
                      value={currentUser.nombre || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Apellidos</label>
                    <input
                      type="text"
                      className="form-control"
                      name="apellidos"
                      value={currentUser.apellidos || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={currentUser.email || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Detalles</label>
                    <textarea
                      className="form-control"
                      name="detalles"
                      value={currentUser.detalles || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
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
                  {currentUser.id ? (
                    null
                  ) :<>
                  <div className="form-group">
                    <label>Nueva Contraseña</label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={currentUser.password || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Confirmar Contraseña</label>
                    <input
                      type="password"
                      className="form-control"
                      name="confirmPassword"
                      value={currentUser.confirmPassword || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </>}
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
