import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import apiClient, { peticion } from "../../config/apiClient";

const Eventos = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentData, setCurrentData] = useState(null);
    const [equipos, setEquipos] = useState([]);
    const prefijo = "/eventos/api/";
    const prefijoEquipos = "/equipos/api/";

    const getEquipoNombre = (id) => {
        const equipo = equipos.find((e) => e.id === id);
        return equipo ? equipo.nombre : "Desconocido";
    };

    const ajustarFechaLocal = (fechaUTC) => {
        const fecha = new Date(fechaUTC);
        return new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60000);
    };

    const formatFecha = (fecha) => {
        const date = new Date(fecha);
        return date.toISOString().slice(0, 16); // Formato: YYYY-MM-DDTHH:mm
    };

    const fetchData = async () => {
        try {
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
        setCurrentData({
            ...editar,
            fecha: formatFecha(editar.fecha), // Asegura que la fecha esté en el formato correcto
        });
        setShowModal(true);
    };

    const handleCreate = () => {
        setCurrentData({
            nombre: "",
            fecha: "",
            equipo1: "",
            equipo2: "",
            resultado: "",
        });
        setShowModal(true);
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción eliminará el evento.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Sí, eliminar",
        }).then((result) => {
            if (result.isConfirmed) {
                peticion(apiClient, `${prefijo}${id}/`, "delete")
                    .then(() => {
                        setData(data.filter((evento) => evento.id !== id));
                        Swal.fire("Eliminado", "Evento eliminado con éxito.", "success");
                    })
                    .catch((error) => {
                        console.error("Error al eliminar el evento:", error);
                        Swal.fire("Error", "Ocurrió un error al eliminar el evento.", "error");
                    });
            }
        });
    };

    const handleSave = () => {
        if (!currentData.nombre || !currentData.fecha || !currentData.equipo1 || !currentData.equipo2) {
            Swal.fire("Campos incompletos", "Por favor completa todos los campos obligatorios.", "warning");
            return;
        }

        if (currentData.equipo1 === currentData.equipo2) {
            Swal.fire("Error", "Un equipo no puede enfrentarse a sí mismo.", "error");
            return;
        }

        const datosAEnviar = {
            ...currentData,
            equipo1: parseInt(currentData.equipo1, 10),
            equipo2: parseInt(currentData.equipo2, 10),
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentData({ ...currentData, [name]: value });
    };

    // Separar eventos en "Próximos" y "Finalizados"
    const now = new Date();
    const eventosProximos = data.filter((evento) => !evento.resultado);
    const eventosFinalizados = data.filter((evento) => evento.resultado);

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
                                                <h5 className="fw-semibold mb-3">
                                                    {getEquipoNombre(evento.equipo1)} <span className="text-muted">vs</span>{" "}
                                                    {getEquipoNombre(evento.equipo2)}
                                                </h5>
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
                                    eventosFinalizados.map((evento, i) => (
                                        <div className="col-md-3 mb-4" key={i}>
                                            <div className="card shadow-sm border-0 rounded-4 h-100">
                                                <div className="card-body text-center">
                                                    <h5 className="fw-semibold mb-3">
                                                        {getEquipoNombre(evento.equipo1)} <span className="text-muted">vs</span>{" "}
                                                        {getEquipoNombre(evento.equipo2)}
                                                    </h5>
                                                    <p className="text-muted mb-0">📅 Fecha del partido:</p>
                                                    <p className="fw-medium">{new Date(evento.fecha).toLocaleDateString()}</p>
                                                    <div className="d-flex justify-content-around">
                                                        <span
                                                            className={`fw-bold ${evento.resultado === "Victoria"
                                                                    ? "text-success"
                                                                    : evento.resultado === "Empate"
                                                                        ? "text-warning"
                                                                        : "text-danger"
                                                                }`}
                                                        >
                                                            {evento.resultado}
                                                        </span>
                                                    </div>
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
                                        <label>Nombre <span className="text-danger">*</span></label>
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
                                        <label>Equipo 1 <span className="text-danger">*</span></label>
                                        <select
                                            className="form-control"
                                            name="equipo1"
                                            value={currentData?.equipo1 || ""}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Selecciona un equipo</option>
                                            {equipos.map((equipo) => (
                                                <option key={equipo.id} value={equipo.id}>
                                                    {equipo.nombre}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group mb-3">
                                        <label>Equipo 2 <span className="text-danger">*</span></label>
                                        <select
                                            className="form-control"
                                            name="equipo2"
                                            value={currentData?.equipo2 || ""}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Selecciona un equipo</option>
                                            {equipos.map((equipo) => (
                                                <option key={equipo.id} value={equipo.id}>
                                                    {equipo.nombre}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {currentData.id && new Date(currentData.fecha) <= new Date() ? (
                                        <div className="form-group mb-3">
                                            <label>Resultado</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="resultado"
                                                value={currentData?.resultado || ""}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    ) : (
                                        <p className="text-danger">El resultado solo se puede ingresar después de la fecha y hora del evento.</p>
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