import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import apiClient, { peticion } from "../../config/apiClient";

const Eventos = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentData, setCurrentData] = useState(null);
    const [equipos, setEquipos] = useState([]);
    const [deportes, setDeportes] = useState([]);
    const [deporteSeleccionado, setDeporteSeleccionado] = useState("");
    const prefijo = "/eventos/api/";
    const prefijoEquipos = "/equipos/api/";
    const prefijoDeportes = "/deportes/api/";

    // Obtener el nombre del equipo por su ID
    const getEquipoNombre = (id) => {
        const equipo = equipos.find((e) => e.id === id);
        return equipo ? equipo.nombre : "Desconocido";
    };

    // Obtener el nombre del deporte por su ID
    const getDeporteNombre = (id) => {
        const deporte = deportes.find((d) => d.id === id);
        return deporte ? deporte.nombre : "Desconocido";
    };

    // Cargar datos de deportes, equipos y eventos
    const fetchData = async () => {
        try {
            const respDeportes = await peticion(apiClient, prefijoDeportes);
            setDeportes(respDeportes.data);

            const respEquipos = await peticion(apiClient, prefijoEquipos);
            setEquipos(respEquipos.data);

            const respEventos = await peticion(apiClient, prefijo);
            setData(respEventos.data);
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
        console.log("Deporte del evento a editar:", editar.deporte); // Verifica el valor del deporte
        setCurrentData({
            ...editar,
            fecha: new Date(editar.fecha).toISOString().slice(0, 16), // Mantén la fecha y hora exactas
        });
        setDeporteSeleccionado(String(editar.deporte)); // Asegúrate de que el valor sea una cadena si los IDs son cadenas
        console.log("Deporte seleccionado al editar:", String(editar.deporte)); // Verifica el valor que se asigna
        setShowModal(true);
    };

    const handleCreate = () => {
        setCurrentData({
            nombre: "",
            fecha: "",
            equipo1: "",
            equipo2: "",
            puntos_equipo1: 0,
            puntos_equipo2: 0,
        });
        setDeporteSeleccionado("");
        setShowModal(true);
    };

    // Guardar un evento (crear o actualizar)
    const handleSave = () => {
        if (!currentData.nombre || !currentData.fecha || !deporteSeleccionado) {
            Swal.fire("Campos incompletos", "Por favor completa todos los campos obligatorios.", "warning");
            return;
        }

        const datosAEnviar = {
            ...currentData,
            deporte: deporteSeleccionado,
            equipo1: currentData.equipo1 ? parseInt(currentData.equipo1, 10) : null,
            equipo2: currentData.equipo2 ? parseInt(currentData.equipo2, 10) : null,
            puntos_equipo1: parseInt(currentData.puntos_equipo1, 10),
            puntos_equipo2: parseInt(currentData.puntos_equipo2, 10),
        };

        if (currentData.id) {
            peticion(apiClient, `${prefijo}${currentData.id}/`, "put", datosAEnviar)
                .then((res) => {
                    setData(
                        data.map((evento) =>
                            evento.id === currentData.id ? res.data : evento
                        )
                    );
                    setShowModal(false);
                    Swal.fire("Éxito", "Evento actualizado con éxito.", "success");
                })
                .catch((error) => {
                    console.error("Error al actualizar el evento:", error);
                    Swal.fire("Error", "Ocurrió un error al actualizar el evento.", "error");
                });
        } else {
            peticion(apiClient, prefijo, "post", datosAEnviar)
                .then((res) => {
                    setData([...data, res.data]);
                    setShowModal(false);
                    Swal.fire("Éxito", "Evento creado con éxito.", "success");
                })
                .catch((error) => {
                    console.error("Error al crear el evento:", error);
                    Swal.fire("Error", "Ocurrió un error al crear el evento.", "error");
                });
        }
    };

    // Manejar la eliminación de un evento
    const handleDelete = (id) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "No podrás revertir esta acción.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
        }).then((result) => {
            if (result.isConfirmed) {
                peticion(apiClient, `${prefijo}${id}/`, "delete")
                    .then(() => {
                        setData(data.filter((evento) => evento.id !== id));
                        Swal.fire("Eliminado", "El evento ha sido eliminado.", "success");
                    })
                    .catch((error) => {
                        console.error("Error al eliminar el evento:", error);
                        Swal.fire("Error", "No se pudo eliminar el evento.", "error");
                    });
            }
        });
    };

    // Manejar cambios en los campos del formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentData({ ...currentData, [name]: value });
    };

    // Manejar cambios en el selector de deportes
    const handleDeporteChange = (e) => {
        setDeporteSeleccionado(e.target.value);
    };

    // Filtrar equipos según el deporte seleccionado
    const equiposFiltrados = equipos.filter((equipo) => parseInt(equipo.deporte, 10) === parseInt(deporteSeleccionado, 10));

    // Separar eventos en "Próximos" y "Finalizados"
    const eventosProximos = data.filter((evento) => !evento.puntos_equipo1 && !evento.puntos_equipo2);
    const eventosFinalizados = data.filter((evento) => evento.puntos_equipo1 || evento.puntos_equipo2);

    return (
        <div className="container py-5" style={{ backgroundColor: "#e6f0ff" }}>
            <h1 className="text-center fw-bold mb-4">EVENTOS</h1>

            <button className="btn btn-primary mb-4" onClick={handleCreate}>
                + AGREGAR
            </button>

            {loading ? (
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Cargando...</span>
                    </div>
                </div>
            ) : (
                <>
                    {/* Próximos Eventos */}
                    <section className="mb-5">
                        <h4 className="text-center mb-3">Próximos Eventos</h4>
                        <hr className="mb-4" />
                        <div className="row justify-content-center">
                            {eventosProximos.length > 0 ? (
                                eventosProximos.map((evento, i) => (
                                    <div className="col-md-3 mb-4" key={i}>
                                        <div className="card shadow-sm border-0 rounded-4 h-100">
                                            <div className="card-body text-center">
                                                <h5 className="fw-semibold mb-3">{evento.nombre}</h5>
                                                <h5 className="fw-semibold mb-3">
                                                    {getEquipoNombre(evento.equipo1)} <span className="text-muted">vs</span>{" "}
                                                    {getEquipoNombre(evento.equipo2)}
                                                </h5>
                                                <p className="fw-medium text-muted">Deporte: {getDeporteNombre(evento.deporte)}</p>
                                                <p className="mb-1 text-primary fw-semibold">
                                                    🕖 {new Date(evento.fecha).toLocaleTimeString()}
                                                </p>
                                                <p className="fw-medium">
                                                    📅 {new Date(evento.fecha).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="card-footer d-flex justify-content-between">
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleDelete(evento.id)}
                                                >
                                                    🗑️
                                                </button>
                                                <button
                                                    className="btn btn-dark btn-sm"
                                                    onClick={() => handleEdit(evento)}
                                                >
                                                    ✏️
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-muted">No hay próximos eventos</p>
                            )}
                        </div>
                    </section>

                    {/* Eventos Finalizados */}
                    <section>
                        <h4 className="text-center mb-3">Eventos Finalizados</h4>
                        <hr className="mb-4" />
                        <div className="row justify-content-center">
                            {eventosFinalizados.length > 0 ? (
                                eventosFinalizados.map((evento, i) => (
                                    <div className="col-md-3 mb-4" key={i}>
                                        <div className="card shadow-sm border-0 rounded-4 h-100">
                                            <div className="card-body text-center">
                                                <h5 className="fw-semibold mb-3">{evento.nombre}</h5>
                                                <h5 className="fw-semibold mb-3">
                                                    <span
                                                        className={`${
                                                            evento.puntos_equipo1 > evento.puntos_equipo2
                                                                ? "text-success"
                                                                : evento.puntos_equipo1 < evento.puntos_equipo2
                                                                ? "text-danger"
                                                                : "text-secondary"
                                                        }`}
                                                    >
                                                        {getEquipoNombre(evento.equipo1)}
                                                    </span>{" "}
                                                    <span className="text-muted">vs</span>{" "}
                                                    <span
                                                        className={`${
                                                            evento.puntos_equipo2 > evento.puntos_equipo1
                                                                ? "text-success"
                                                                : evento.puntos_equipo2 < evento.puntos_equipo1
                                                                ? "text-danger"
                                                                : "text-secondary"
                                                        }`}
                                                    >
                                                        {getEquipoNombre(evento.equipo2)}
                                                    </span>
                                                </h5>
                                                <p className="fw-medium text-muted">Deporte: {getDeporteNombre(evento.deporte)}</p>
                                                <p className="text-muted mb-0">📅 Fecha del partido:</p>
                                                <p className="fw-medium">{new Date(evento.fecha).toLocaleDateString()}</p>
                                                <p className="fw-medium">Puntos {getEquipoNombre(evento.equipo1)}: {evento.puntos_equipo1}</p>
                                                <p className="fw-medium">Puntos {getEquipoNombre(evento.equipo2)}: {evento.puntos_equipo2}</p>
                                                <p className="fw-bold">
                                                    {evento.resultado ? `${evento.resultado}` : "Resultado no disponible"}
                                                </p>
                                            </div>
                                            <div className="card-footer d-flex justify-content-between">
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleDelete(evento.id)}
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-muted">No hay eventos finalizados</p>
                            )}
                        </div>
                    </section>
                </>
            )}

            {/* Modal */}
            {showModal && (
                <div className="modal d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5>{currentData.id ? "Editar Evento" : "Crear Evento"}</h5>
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
                                        <label>Nombre del Evento <span className="text-danger">*</span></label>
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
                                            value={deporteSeleccionado} // Vincula el estado al valor del select
                                            onChange={handleDeporteChange} // Actualiza el estado cuando el usuario cambia el deporte
                                            required
                                        >
                                            <option value="">Selecciona un deporte</option>
                                            {deportes.map((deporte) => (
                                                <option key={deporte.id} value={String(deporte.id)}>
                                                    {deporte.nombre}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group mb-3">
                                        <label>Equipo 1</label>
                                        <select
                                            className="form-control"
                                            name="equipo1"
                                            value={currentData?.equipo1 || ""}
                                            onChange={handleInputChange}
                                            disabled={!deporteSeleccionado}
                                        >
                                            <option value="">Selecciona un equipo</option>
                                            {equiposFiltrados.map((equipo) => (
                                                <option key={equipo.id} value={equipo.id}>
                                                    {equipo.nombre}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group mb-3">
                                        <label>Equipo 2</label>
                                        <select
                                            className="form-control"
                                            name="equipo2"
                                            value={currentData?.equipo2 || ""}
                                            onChange={handleInputChange}
                                            disabled={!deporteSeleccionado}
                                        >
                                            <option value="">Selecciona un equipo</option>
                                            {equiposFiltrados.map((equipo) => (
                                                <option key={equipo.id} value={equipo.id}>
                                                    {equipo.nombre}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group mb-3">
                                        <label>Fecha <span className="text-danger">*</span></label>
                                        <input
                                            type="datetime-local"
                                            className="form-control"
                                            name="fecha"
                                            value={currentData?.fecha || ""}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label>Puntos Equipo 1</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="puntos_equipo1"
                                            value={currentData?.puntos_equipo1 || ""}
                                            onChange={(e) =>
                                                setCurrentData({
                                                    ...currentData,
                                                    puntos_equipo1: e.target.value === "" ? 0 : parseInt(e.target.value, 10),
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label>Puntos Equipo 2</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="puntos_equipo2"
                                            value={currentData?.puntos_equipo2 || ""}
                                            onChange={(e) =>
                                                setCurrentData({
                                                    ...currentData,
                                                    puntos_equipo2: e.target.value === "" ? 0 : parseInt(e.target.value, 10),
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

export default Eventos;