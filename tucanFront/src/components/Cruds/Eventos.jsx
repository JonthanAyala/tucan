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

    const getEquipoNombre = (id) => {
        const equipo = equipos.find((e) => e.id === id);
        return equipo ? equipo.nombre : "Desconocido";
    };

    const getDeporteNombre = (id) => {
        const deporte = deportes.find((d) => parseInt(d.id, 10) === parseInt(id, 10));
        return deporte ? deporte.nombre : "Desconocido";
    };

    useEffect(() => {
        fetchData();
    }, []);

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

            // Mostrar alerta de error con SweetAlert
            Swal.fire({
                title: "Error al cargar los datos",
                text: error.response?.data?.error || "Ocurrió un error inesperado.",
                icon: "error",
                confirmButtonText: "Aceptar",
            });

            setLoading(false);
        }
    };

    const ajustarFechaLocal = (fechaUTC) => {
        const fecha = new Date(fechaUTC);
        return new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60000);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEdit = (editar) => {
        setCurrentData({
            ...editar,
            fecha: new Date(editar.fecha).toISOString().slice(0, 16),
            puntos_equipo1: editar.puntos_equipo1 ?? null,
            puntos_equipo2: editar.puntos_equipo2 ?? null,
        });
        setDeporteSeleccionado(String(editar.deporte));
        setShowModal(true);
    };

    const handleCreate = () => {
        setCurrentData({
            nombre: "",
            fecha: "",
            equipo1: "",
            equipo2: "",
            puntos_equipo1: null,
            puntos_equipo2: null,
        });
        setDeporteSeleccionado("");
        setShowModal(true);
    };

    const handleSave = () => {
        if (!currentData.nombre || !currentData.fecha || !deporteSeleccionado) {
            Swal.fire("Campos incompletos", "Por favor completa todos los campos obligatorios.", "warning");
            return;
        }

        if (currentData.equipo1 === currentData.equipo2) {
            Swal.fire("Error", "Un equipo no puede jugar contra sí mismo.", "error");
            return;
        }

        const equipo1 = equipos.find((e) => e.id === parseInt(currentData.equipo1, 10));
        const equipo2 = equipos.find((e) => e.id === parseInt(currentData.equipo2, 10));
        if (equipo1?.deporte !== equipo2?.deporte) {
            Swal.fire("Error", "Los equipos deben pertenecer al mismo deporte.", "error");
            return;
        }

        // Validación de la fecha del evento
        const fechaEvento = new Date(currentData.fecha);
        const fechaLimite = new Date();
        fechaLimite.setDate(fechaLimite.getDate() - 6);

        if (fechaEvento < fechaLimite) {
            Swal.fire(
                "Fecha inválida",
                "No se puede guardar un evento con una fecha anterior a 6 días.",
                "error"
            );
            return;
        }

        // Validación de puntos negativos
        if (currentData.puntos_equipo1 < 0 || currentData.puntos_equipo2 < 0) {
            Swal.fire(
                "Puntos inválidos",
                "No se pueden ingresar puntos negativos.",
                "error"
            );
            return;
        }

        let resultado = null;
        if (currentData.puntos_equipo1 === currentData.puntos_equipo2) {
            resultado = "Empate";
        } else if (currentData.puntos_equipo1 > currentData.puntos_equipo2) {
            resultado = `Ganador: ${getEquipoNombre(currentData.equipo1)}`;
        } else if (currentData.puntos_equipo1 < currentData.puntos_equipo2) {
            resultado = `Ganador: ${getEquipoNombre(currentData.equipo2)}`;
        }

        const datosAEnviar = {
            ...currentData,
            deporte: deporteSeleccionado ? parseInt(deporteSeleccionado, 10) : null,
            equipo1: currentData.equipo1 ? parseInt(currentData.equipo1, 10) : null,
            equipo2: currentData.equipo2 ? parseInt(currentData.equipo2, 10) : null,
            puntos_equipo1: currentData.puntos_equipo1,
            puntos_equipo2: currentData.puntos_equipo2,
            resultado,
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

                    Swal.fire({
                        title: "Error al actualizar el evento",
                        text: error.response?.data?.error || "Ocurrió un error inesperado.",
                        icon: "error",
                        confirmButtonText: "Aceptar",
                    });
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

                    Swal.fire({
                        title: "Error al crear el evento",
                        text: error.response?.data?.error || "Ocurrió un error inesperado.",
                        icon: "error",
                        confirmButtonText: "Aceptar",
                    });
                });
        }
    };

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentData({ ...currentData, [name]: value });
    };

    const handleDeporteChange = (e) => {
        setDeporteSeleccionado(e.target.value);
        console.log("Deporte seleccionado:", e.target.value);
    };

    const equiposFiltrados = equipos.filter(
        (equipo) => equipo.activo && parseInt(equipo.deporte, 10) === parseInt(deporteSeleccionado, 10)
    );

    const eventosProximos = data.filter(
        (evento) => evento.puntos_equipo1 === null && evento.puntos_equipo2 === null
    );

    const eventosFinalizados = data.filter(
        (evento) => evento.puntos_equipo1 !== null && evento.puntos_equipo2 !== null
    );

    return (
        <div>
            <h3 className="text-center fw-bold mb-4">Eventos</h3>

            <button className="btn btn-success mb-3" onClick={handleCreate}>
                <i className="bi bi-plus"></i> Crear Evento
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
                                    <div className="col-md-4 mb-4" key={i}>
                                        <div className="card shadow-sm border-0 rounded-4 h-100">
                                            <div className="card-header text-center bg-primary text-white fw-bold">
                                                {evento.nombre}
                                            </div>
                                            <div className="card-body text-center">
                                                <h5 className="fw-semibold mb-3">
                                                    {getEquipoNombre(evento.equipo1)}
                                                    <span className="text-muted mx-2">vs</span>
                                                    {getEquipoNombre(evento.equipo2)}
                                                </h5>
                                                <p className="fw-medium text-muted">Deporte: {evento.deporte_nombre || "Desconocido"}</p>
                                                <p className="mb-1 text-primary fw-semibold">
                                                    🕖 {ajustarFechaLocal(evento.fecha).toLocaleTimeString()}
                                                </p>
                                                <p className="fw-medium">
                                                    📅 {ajustarFechaLocal(evento.fecha).toLocaleDateString()}
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
                                eventosFinalizados.map((evento, i) => {
                                    const fechaEvento = new Date(evento.fecha);
                                    const fechaLimiteEdicion = new Date(fechaEvento);
                                    fechaLimiteEdicion.setDate(fechaEvento.getDate() + 6);

                                    const puedeEditar = new Date() <= fechaLimiteEdicion;

                                    // Determinar el color del encabezado según el resultado
                                    const headerClass =
                                        evento.resultado === "Empate"
                                            ? "bg-secondary text-white"
                                            : "bg-success text-white";

                                    return (
                                        <div className="col-md-4 mb-4" key={i}>
                                            <div className="card shadow-sm border-0 rounded-4 h-100">
                                                <div className={`card-header text-center fw-bold ${headerClass}`}>
                                                    {evento.resultado || "Resultado no disponible"}
                                                </div>
                                                <div className="card-body text-center">
                                                    <h5 className="fw-bold mb-3">{evento.nombre}</h5>
                                                    <h6 className="fw-semibold mb-3">
                                                        <span
                                                            className={`${evento.puntos_equipo1 > evento.puntos_equipo2
                                                                    ? "text-success"
                                                                    : evento.puntos_equipo1 < evento.puntos_equipo2
                                                                        ? "text-danger"
                                                                        : "text-secondary"
                                                                }`}
                                                        >
                                                            {getEquipoNombre(evento.equipo1)}
                                                        </span>
                                                        <span className="text-muted mx-2">vs</span>
                                                        <span
                                                            className={`${evento.puntos_equipo2 > evento.puntos_equipo1
                                                                    ? "text-success"
                                                                    : evento.puntos_equipo2 < evento.puntos_equipo1
                                                                        ? "text-danger"
                                                                        : "text-secondary"
                                                                }`}
                                                        >
                                                            {getEquipoNombre(evento.equipo2)}
                                                        </span>
                                                    </h6>
                                                    <p className="fw-medium text-muted">Deporte: {getDeporteNombre(evento.deporte)}</p>
                                                    <p className="text-muted mb-0">📅 Fecha del partido:</p>
                                                    <p className="fw-medium">{new Date(evento.fecha).toLocaleDateString()}</p>
                                                    <p className="fw-medium">Puntos {getEquipoNombre(evento.equipo1)}: {evento.puntos_equipo1}</p>
                                                    <p className="fw-medium">Puntos {getEquipoNombre(evento.equipo2)}: {evento.puntos_equipo2}</p>
                                                </div>
                                                <div className="card-footer d-flex justify-content-between">
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => handleDelete(evento.id)}
                                                    >
                                                        🗑️
                                                    </button>
                                                    {puedeEditar && (
                                                        <button
                                                            className="btn btn-dark btn-sm"
                                                            onClick={() => handleEdit(evento)}
                                                        >
                                                            ✏️
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-center text-muted">No hay eventos finalizados</p>
                            )}
                        </div>
                    </section>
                </>
            )}

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
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (/^[a-zA-Z0-9\s]*$/.test(value)) {
                                                    handleInputChange(e); // Actualiza el estado si el valor es válido
                                                } else {
                                                    Swal.fire(
                                                        "Nombre inválido",
                                                        "El nombre del evento solo puede contener letras, números y espacios.",
                                                        "error"
                                                    );
                                                }
                                            }}
                                            required
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label>Deporte <span className="text-danger">*</span></label>
                                        <select
                                            className="form-control"
                                            value={deporteSeleccionado}
                                            onChange={handleDeporteChange}
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
                                            disabled={currentData?.id && currentData.puntos_equipo1 !== null && currentData.puntos_equipo2 !== null}
                                        />
                                    </div>
                                    {currentData?.id && new Date() > new Date(currentData.fecha) && (
                                        <>
                                            <div className="form-group mb-3">
                                                <label>Puntos Equipo 1</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name="puntos_equipo1"
                                                    value={currentData?.puntos_equipo1 ?? ""}
                                                    onChange={(e) =>
                                                        setCurrentData({
                                                            ...currentData,
                                                            puntos_equipo1: e.target.value === "" ? null : parseInt(e.target.value, 10),
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
                                                    value={currentData?.puntos_equipo2 ?? ""}
                                                    onChange={(e) =>
                                                        setCurrentData({
                                                            ...currentData,
                                                            puntos_equipo2: e.target.value === "" ? null : parseInt(e.target.value, 10),
                                                        })
                                                    }
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