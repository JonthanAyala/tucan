import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import apiClient, { peticion } from "../../config/apiClient";

const EventosVista = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [equipos, setEquipos] = useState([]);
    const [deportes, setDeportes] = useState([]);
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

    const ajustarFechaLocal = (fechaUTC) => {
        const fecha = new Date(fechaUTC);
        return new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60000);
    };

    useEffect(() => {
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

        fetchData();
    }, []);

    const eventosProximos = data.filter(
        (evento) => evento.puntos_equipo1 === null && evento.puntos_equipo2 === null
    );

    const eventosFinalizados = data.filter(
        (evento) => evento.puntos_equipo1 !== null && evento.puntos_equipo2 !== null
    );

    return (
        <div className="container py-5" style={{ backgroundColor: "#e6f0ff" }}>
            <h1 className="text-center fw-bold mb-4">EVENTOS</h1>

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
        </div>
    );
};

export default EventosVista;