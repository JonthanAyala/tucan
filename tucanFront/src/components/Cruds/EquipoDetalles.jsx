import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import apiClient, { peticion } from "../../config/apiClient";

const EquipoDetalle = ({ id }) => {
  const [equipo, setEquipo] = useState(null);
  const [jugadores, setJugadores] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showJugadoresModal, setShowJugadoresModal] = useState(false);
  const [editableEquipo, setEditableEquipo] = useState({});
  const [deportes, setDeportes] = useState([]);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [eventos, setEventos] = useState([]);
  const currentUserId = localStorage.getItem("id");
  const [posiciones, setPosiciones] = useState([]);
  const [victorias, setVictorias] = useState(0);
  const [derrotas, setDerrotas] = useState(0);
  const [empates, setEmpates] = useState(0);
  const [invalid, setInvalid] = useState({});
  const [efectividad, setEfectividad] = useState(0);
  const [nuevoJugador, setNuevoJugador] = useState({
    id: null,
    nombre: "",
    fecha_nacimiento: "",
    posicion: "",
    es_titular: false,
  });
  const [editarJugador, setEditarJugador] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const resEquipo = await peticion(apiClient, `/equipos/api/${id}/`);

        const resDeportes = await peticion(apiClient, `/deportes/api/`);

        const deportes = resDeportes.data.map((deporte) => ({
          ...deporte,
          max_titulares: deporte.max_titulares || 0,
          max_suplentes: deporte.max_suplentes || 0,
        }));

        const equipoActualizado = { ...resEquipo.data };
        const deporte = deportes.find(
          (d) => Number(d.id) === Number(equipoActualizado.deporte)
        );
        equipoActualizado.deporte_nombre = deporte
          ? deporte.nombre
          : "Desconocido";

        const resEntrenador = await peticion(apiClient, `/usuarios/api/${equipoActualizado.entrenador}/`);
        equipoActualizado.entrenador_nombre = resEntrenador.data.nombre;

        setEquipo(equipoActualizado);
        setDeportes(deportes);

        const resJugadores = await peticion(
          apiClient,
          `jugadores/jugadores/${id}/`
        );
        console.log(resJugadores.data.jugadores);
        setJugadores(resJugadores.data.jugadores || []);


        if (equipoActualizado.deporte) {
          const resPosiciones = await peticion(apiClient, `/posicion/equipo/${equipoActualizado.deporte}/`);
          console.log("Posiciones cargadas:", resPosiciones.data);
          setPosiciones(resPosiciones.data || []);
        } else {
          console.log("El equipo no tiene un deporte asociado.");
          setPosiciones([]);
        }

        const resEventos = await peticion(apiClient, `/eventos/equipo/${id}/`);
        const eventos = resEventos.data.eventos;
        const estadisticas = resEventos.data.estadisticas;

        // Obtener nombres de los equipos para cada evento
        const eventosConNombres = await Promise.all(
          eventos.map(async (evento) => {
            const equipo1Res = await peticion(
              apiClient,
              `/equipos/api/${evento.equipo1}/`
            );
            const equipo2Res = await peticion(
              apiClient,
              `/equipos/api/${evento.equipo2}/`
            );
            return {
              ...evento,
              equipo1_nombre: equipo1Res.data.nombre,
              equipo2_nombre: equipo2Res.data.nombre,
            };
          })
        );

        setEventos(eventosConNombres);

        setVictorias(estadisticas.victorias);
        setDerrotas(estadisticas.derrotas);
        setEmpates(estadisticas.empates);
        setEfectividad(estadisticas.efectividad);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
        Swal.fire(
          "Error",
          "No se pudo cargar la información del equipo",
          "error"
        );
        navigate("/equipos");
      }
    };

    if (id) {
      cargarDatos();
    }
  }, [id, navigate]);

  const actualizarEventos = (equipoActualizado) => {
    const eventosActualizados = eventos.map((evento) => {
      if (evento.equipo1 === equipoActualizado.id) {
        return { ...evento, equipo1_nombre: equipoActualizado.nombre };
      } else if (evento.equipo2 === equipoActualizado.id) {
        return { ...evento, equipo2_nombre: equipoActualizado.nombre };
      }
      return evento;
    });
    setEventos(eventosActualizados);
  };

  const handleEdit = () => {
    if (!equipo.activo) {
      Swal.fire(
        "Acción no permitida",
        "No se puede editar la información de un equipo inactivo.",
        "warning"
      );
      return;
    }
    setEditableEquipo(equipo);
    setShowModal(true);
  };
  const handleEditJugadores = () => {
    if (!equipo.activo) {
      Swal.fire(
        "Acción no permitida",
        "No se pueden editar los jugadores de un equipo inactivo.",
        "warning"
      );
      return;
    }
    setShowJugadoresModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "deporte") {
      const selectedDeporte = deportes.find((deporte) => deporte.id === parseInt(value));
      if (selectedDeporte) {
        setEditableEquipo({
          ...editableEquipo,
          [name]: value,
          num_titulares: selectedDeporte.max_titulares || 0,
          num_suplentes: selectedDeporte.max_suplentes || 0,
        });
      } else {
        setEditableEquipo({ ...editableEquipo, [name]: value });
      }
    } else {
      setEditableEquipo({ ...editableEquipo, [name]: value });
    }
  };

  const handleSave = async () => {

    if (!editableEquipo.nombre || !editableEquipo.deporte) {
        Swal.fire(
            "Campos incompletos",
            "Por favor completa los campos obligatorios: Nombre y Deporte.",
            "warning"
        );
        return;
    }

  
    if (!/^[a-zA-Z0-9\s]+$/.test(editableEquipo.nombre)) {
        Swal.fire(
            "Nombre inválido",
            "El nombre solo puede contener letras, números y espacios.",
            "error"
        );
        return;
    }

    if (
        editableEquipo.descripcion &&
        !/^[a-zA-Z0-9\s.,]+$/.test(editableEquipo.descripcion)
    ) {
        Swal.fire(
            "Descripción inválida",
            "La descripción solo puede contener letras, números, espacios, puntos y comas.",
            "error"
        );
        return;
    }


    if (editableEquipo.ciudad && !/^[a-zA-Z\s]+$/.test(editableEquipo.ciudad)) {
        Swal.fire(
            "Ciudad inválida",
            "La ciudad solo puede contener letras y espacios.",
            "error"
        );
        return;
    }

    try {
        const formData = new FormData();
        formData.append("nombre", editableEquipo.nombre);
        formData.append("descripcion", editableEquipo.descripcion || "");
        formData.append("ciudad", editableEquipo.ciudad || "");
        formData.append("deporte", editableEquipo.deporte);
        formData.append("entrenador", currentUserId);
        formData.append("num_titulares", editableEquipo.num_titulares || 0);
        formData.append("num_suplentes", editableEquipo.num_suplentes || 0);

        if (logoFile) {
            formData.append("logo", logoFile);
        }

        const headers = { "Content-Type": "multipart/form-data" };

        if (editableEquipo.id) {

            const res = await peticion(
                apiClient,
                `/equipos/api/${editableEquipo.id}/`,
                "put",
                formData,
                headers
            );

            const equipoActualizado = { ...res.data };
            const deporte = deportes.find(
                (d) => Number(d.id) === Number(equipoActualizado.deporte)
            );
            equipoActualizado.deporte_nombre = deporte
                ? deporte.nombre
                : "Desconocido";

            setEquipo(equipoActualizado);
            actualizarEventos(equipoActualizado);
            setShowModal(false);
            Swal.fire("Éxito", "Equipo actualizado con éxito.", "success");
        } else {

            const res = await peticion(
                apiClient,
                "/equipos/api/",
                "post",
                formData,
                headers
            );

            const equipoCreado = { ...res.data };
            const deporte = deportes.find(
                (d) => Number(d.id) === Number(equipoCreado.deporte)
            );
            equipoCreado.deporte_nombre = deporte
                ? deporte.nombre
                : "Desconocido";

            setEquipo(equipoCreado);
            setShowModal(false);
            Swal.fire("Éxito", "Equipo creado con éxito.", "success");
        }
    } catch (error) {
        console.error("Error al guardar el equipo:", error);

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

            Swal.fire("Error", mensajeError || "No se pudo guardar el equipo.", "error");
        } else {
            Swal.fire(
                "Error",
                "Ocurrió un error al guardar el equipo. Por favor, inténtalo de nuevo.",
                "error"
            );
        }
    }
};

  const handleSaveJugador = async () => {

    if (!nuevoJugador.nombre || !nuevoJugador.fecha_nacimiento || !nuevoJugador.posicion) {
      Swal.fire("Error", "Por favor completa todos los campos", "error");
      return;
    }


    if (!/^[a-zA-Z\s]+$/.test(nuevoJugador.nombre)) {
      Swal.fire(
        "Nombre inválido",
        "El nombre solo puede contener letras y espacios.",
        "error"
      );
      return;
    }


    const fechaNacimiento = new Date(nuevoJugador.fecha_nacimiento);
    if (fechaNacimiento > new Date()) {
      Swal.fire(
        "Fecha de nacimiento inválida",
        "La fecha de nacimiento no puede ser en el futuro.",
        "error"
      );
      return;
    }


    const edadMinima = 15;
    const fechaLimite = new Date();
    fechaLimite.setFullYear(fechaLimite.getFullYear() - edadMinima);
    if (fechaNacimiento > fechaLimite) {
      Swal.fire(
        "Edad inválida",
        `El jugador debe tener al menos ${edadMinima} años.`,
        "error"
      );
      return;
    }


    const posicionSeleccionada = posiciones.find(
      (posicion) => posicion.id === Number(nuevoJugador.posicion)
    );
    if (posicionSeleccionada && posicionSeleccionada.deporte !== equipo.deporte) {
      Swal.fire(
        "Posición inválida",
        "La posición no corresponde al deporte del equipo.",
        "error"
      );
      return;
    }

    const titularesActuales = jugadores.filter((jugador) => jugador.es_titular).length;
    const suplentesActuales = jugadores.filter((jugador) => !jugador.es_titular).length;

    if (
      nuevoJugador.es_titular &&
      titularesActuales >= equipo.num_titulares
    ) {
      Swal.fire(
        "Límite de titulares alcanzado",
        `El equipo ya tiene el máximo de ${equipo.num_titulares} jugadores titulares.`,
        "error"
      );
      return;
    }

    if (
      !nuevoJugador.es_titular &&
      suplentesActuales >= equipo.num_suplentes
    ) {
      Swal.fire(
        "Límite de suplentes alcanzado",
        `El equipo ya tiene el máximo de ${equipo.num_suplentes} jugadores suplentes.`,
        "error"
      );
      return;
    }

    try {
      const edad = new Date().getFullYear() - fechaNacimiento.getFullYear();
      const jugadorData = {
        ...nuevoJugador,
        edad,
        equipo: equipo.id,
      };

      if (nuevoJugador.id) {

        const res = await peticion(apiClient, `/jugadores/api/${nuevoJugador.id}/`, "put", jugadorData);
        setJugadores(
          jugadores.map((jugador) =>
            jugador.id === nuevoJugador.id
              ? { ...res.data, posicion_nombre: posiciones.find(p => p.id === Number(nuevoJugador.posicion)).nombre }
              : jugador
          )
        );
        Swal.fire("Éxito", "Jugador actualizado correctamente", "success");
      } else {
 
        const res = await peticion(apiClient, "/jugadores/api/", "post", jugadorData);
        setJugadores([
          ...jugadores,
          { ...res.data, posicion_nombre: posiciones.find(p => p.id === Number(nuevoJugador.posicion)).nombre },
        ]);
        Swal.fire("Éxito", "Jugador agregado correctamente", "success");
      }


      setNuevoJugador({ id: null, nombre: "", fecha_nacimiento: "", posicion: "", es_titular: false });
    } catch (error) {
      console.error("Error al guardar el jugador:", error);
      Swal.fire("Error", "No se pudo guardar el jugador", "error");
    }
    setEditarJugador(false);
  };

  const handleEditJugador = (jugador) => {
    setNuevoJugador({
      id: jugador.id,
      nombre: jugador.nombre,
      fecha_nacimiento: jugador.fecha_nacimiento,
      posicion: jugador.posicion,
      es_titular: jugador.es_titular,
    });
    setEditarJugador(true);
  };
  const handleDeleteJugador = async (id) => {
    try {
      await peticion(apiClient, `/jugadores/api/${id}/`, "delete");
      setJugadores(jugadores.filter((jugador) => jugador.id !== id));
      Swal.fire("Éxito", "Jugador eliminado correctamente", "success");
    } catch (error) {
      console.error("Error al eliminar el jugador:", error);
      Swal.fire("Error", "No se pudo eliminar el jugador", "error");
    }
  };

  if (!equipo) {
    return (
      <div className="text-center mt-4 text-muted">
      <i className="bi bi-exclamation-circle fs-1 d-block mb-2"></i>
      <h5>Por favor selecciona un equipo para ver sus detelles</h5>
    </div>
    );
  }

  const eventosFiltrados = eventos.map((evento) => {
    if (evento.puntos_equipo1 === null || evento.puntos_equipo2 === null) {
      return {
        ...evento,
        puntos_equipo1: "0",
        puntos_equipo2: "0",
      };
    }
    return evento;
  });

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 p-2 p-lg-3" >
      <div className="card p-2 p-lg-4 shadow-lg" style={{
        maxWidth: "1400px",
        maxHeight: "100vh",
        width: "100%",
        overflow: "auto"
      }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="text-center fs-3 fs-lg-2">{equipo.nombre}</h1>
          <h5 className="text-muted">Entrenador: {equipo.entrenador_nombre}</h5>
        </div>
        <div className="card-body p-0 p-lg-2">
          <div className="container-fluid px-0">
            <div className="row g-2 g-lg-4">
              <div className="col-12">
                <div className="card p-2 p-lg-3 shadow-sm w-100 mb-4">
                  <div className="card-header bg-light py-2 py-lg-3">
                    <h4 className="text-center mb-0 fs-5 fs-lg-4">
                      Estadísticas Generales
                    </h4>
                  </div>
                  <div className="card-body d-flex flex-wrap justify-content-around align-items-center">
                    <div
                      className="text-center m-2"
                      style={{ minWidth: "120px" }}
                    >
                      <h5 className="text-success mb-1">{victorias}</h5>
                      <p className="mb-0">Victorias</p>
                    </div>
                    <div
                      className="text-center m-2"
                      style={{ minWidth: "120px" }}
                    >
                      <h5 className="text-danger mb-1">{derrotas}</h5>
                      <p className="mb-0">Derrotas</p>
                    </div>
                    <div
                      className="text-center m-2"
                      style={{ minWidth: "120px" }}
                    >
                      <h5 className="text-primary mb-1">{empates}</h5>
                      <p className="mb-0">Empates</p>
                    </div>
                    <div
                      className="text-center m-2"
                      style={{ minWidth: "120px" }}
                    >
                      <h5 className="text-purple mb-1">{efectividad}%</h5>
                      <p className="mb-0">Efectividad</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-4">
                <div
                  className="card p-2 p-lg-3 shadow-sm w-100 d-flex flex-column"
                  style={{
                    height: "500px",
                  }}
                >
                  <div className="card-header bg-light py-2 py-lg-3">
                    <h4 className="text-center mb-0 fs-5 fs-lg-4">Jugadores</h4>
                  </div>
                  <div
                    className="card-body p-1 p-lg-2"
                    style={{
                      overflowY: "auto",
                      flex: "1 1 auto",
                    }}
                  >
                    {jugadores.length === 0 ? (
                      <p className="text-muted text-center my-2 my-lg-3">
                        No hay jugadores registrados
                      </p>
                    ) : (
                      <ul className="list-group list-group-flush">
                        {jugadores.map((jugador) => (
                          <li
                            key={jugador.id}
                            className="list-group-item d-flex justify-content-between align-items-center py-2"
                          >
                            <div className="text-truncate">
                              <strong className="d-block text-truncate">
                                {jugador.nombre}
                              </strong>
                              <small className="text-muted text-truncate d-block">
                                {jugador.posicion_nombre}
                              </small>
                            </div>
                            <span className="badge bg-primary rounded-pill ms-2">
                              {jugador.es_titular ? "Titular" : "Suplente"}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="card-footer bg-transparent border-0 text-center pt-2 pb-1">
                    <button
                      className={`btn btn-sm btn-lg ${equipo.activo ? "btn-success" : "btn-secondary"}`}
                      onClick={handleEditJugadores}
                    >
                      Editar Jugadores
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-4">
                <div
                  className="card p-2 p-lg-3 shadow-sm w-100 d-flex flex-column"
                  style={{
                    height: "500px",
                  }}
                >
                  <div className="card-header bg-light py-2 py-lg-3">
                    <h4 className="text-center mb-0 fs-5 fs-lg-4">Partidos</h4>
                  </div>
                  <div
                    className="card-body p-1 p-lg-2"
                    style={{
                      overflowY: "auto",
                      flex: "1 1 auto",
                    }}
                  >
                    {eventosFiltrados.length === 0 ? (
                      <p className="text-muted text-center my-2 my-lg-3">
                        No hay eventos registrados
                      </p>
                    ) : (
                      <ul className="list-group list-group-flush">
                        {eventosFiltrados.map((evento) => (
                          <li
                            key={evento.id}
                            className="list-group-item d-flex justify-content-between align-items-center py-2"
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              Swal.fire({
                                title: `${evento.nombre}`,
                                html: `<strong>${equipo.id === evento.equipo1
                                  ? evento.equipo1_nombre
                                  : evento.equipo2_nombre
                                  } vs ${equipo.id === evento.equipo1
                                    ? evento.equipo2_nombre
                                    : evento.equipo1_nombre
                                  }</strong><br/>Deporte: ${equipo.deporte_nombre
                                  }<br/>Fecha: ${new Date(
                                    evento.fecha
                                  ).toLocaleDateString()}<br/>Resultado: ${evento.resultado_equipo || "Pendiente"
                                  }<br/>${evento.puntos_equipo1 != null &&
                                    evento.puntos_equipo2 != null
                                    ? `Puntos: ${equipo.id === evento.equipo1
                                      ? `${evento.puntos_equipo1} - ${evento.puntos_equipo2}`
                                      : `${evento.puntos_equipo2} - ${evento.puntos_equipo1}`
                                    }<br/>`
                                    : ""
                                  }`,
                                icon: "info",
                                confirmButtonText: "Cerrar",
                              })
                            }
                          >
                            <div className="text-truncate">
                              <strong className="d-block text-truncate">
                                {equipo.id === evento.equipo1
                                  ? `${evento.equipo1_nombre} vs ${evento.equipo2_nombre}`
                                  : `${evento.equipo2_nombre} vs ${evento.equipo1_nombre}`}
                              </strong>
                              <small className="text-muted d-block">
                                {new Date(evento.fecha) > new Date()
                                  ? `Fecha: ${new Date(
                                    evento.fecha
                                  ).toLocaleDateString()}`
                                  : evento.resultado_equipo || "pendnte"}
                              </small>
                            </div>
                            <span
                              className={`badge rounded-pill ms-2 ${new Date(evento.fecha) > new Date()
                                ? "bg-warning"
                                : evento.resultado
                                  ? "bg-secondary"
                                  : "bg-primary"
                                }`}
                            >
                              {new Date(evento.fecha) > new Date()
                                ? "Próximo"
                                : equipo.id === evento.equipo1
                                  ? `${evento.puntos_equipo1} - ${evento.puntos_equipo2}`
                                  : `${evento.puntos_equipo2} - ${evento.puntos_equipo1}` ||
                                  "Pendiente"}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-4">
                <div className="card h-100 p-2 p-lg-3 shadow-sm w-100 d-flex flex-column">
                  <div className="card-header bg-light py-2 py-lg-3">
                    <h4 className="text-center mb-0 fs-5 fs-lg-4">
                      Información General Del Equipo
                    </h4>
                  </div>
                  <div className="card-body flex-grow-1 p-1 p-lg-3">
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item d-flex align-items-center py-2">
                        <strong className="me-2 flex-shrink-0">Nombre:</strong>
                        <span className="text-truncate">{equipo.nombre}</span>
                      </li>
                      <li className="list-group-item d-flex align-items-center py-2">
                        <strong className="me-2 flex-shrink-0">Ciudad:</strong>
                        <span>{equipo.ciudad}</span>
                      </li>
                      <li className="list-group-item d-flex align-items-center py-2">
                        <strong className="me-2 flex-shrink-0">Deporte:</strong>
                        <span>{equipo.deporte_nombre}</span>
                      </li>
                      <li className="list-group-item d-flex align-items-center py-2">
                        <strong className="me-2 flex-shrink-0">
                          Jugadores:
                        </strong>
                        <span>{equipo.num_titulares}</span>
                      </li>
                      <li className="list-group-item d-flex align-items-center py-2">
                        <strong className="me-2 flex-shrink-0">
                          Suplentes:
                        </strong>
                        <span>{equipo.num_suplentes}</span>
                      </li>
                    </ul>
                    <div className="text-center mt-3">
                      <button
                        className={`btn btn-sm btn-lg ${equipo.activo ? "btn-success" : "btn-secondary"}`}
                        onClick={handleEdit}
                      >
                        Editar Información
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {showModal && (
              <div
                className="modal d-block bg-dark bg-opacity-50"
                tabIndex="-1"
                role="dialog"
              >
                <div
                  className="modal-dialog modal-lg modal-dialog-centered"
                  role="document"
                >
                  <div className="modal-content rounded-4">
                    <div className="modal-header">
                      <h5 className="modal-title">
                        {editableEquipo.id ? "Editar Equipo" : "Crear Equipo"}
                      </h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => {
                          setShowModal(false);
                          setEditableEquipo({});
                          setLogoFile(null);
                          setLogoPreview(null);
                        }}
                      ></button>
                    </div>
                    <div className="modal-body">
                      <form className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Nombre </label>
                          <input
                            type="text"
                            className={`form-control ${invalid?.nombre ? "is-invalid" : ""}`}
                            name="nombre"
                            value={editableEquipo.nombre || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^[a-zA-ZÀ-ÿñÑ\s]*$/.test(value) || value === "") {
                                setInvalid({ ...invalid, nombre: false });
                                handleInputChange(e);
                              } else {
                                setInvalid({ ...invalid, nombre: true });
                              }
                            }}
                            required
                          />
                          {invalid?.nombre && (
                            <div className="invalid-feedback">
                              El nombre solo puede contener letras, espacios, la ñ y acentos.
                            </div>
                          )}
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
                        {(logoPreview || editableEquipo.logo) && (
                          <div className="text-center my-2">
                            <img
                              src={logoPreview || editableEquipo.logo}
                              alt="Vista previa"
                              style={{
                                maxHeight: "150px",
                                objectFit: "contain",
                              }}
                            />
                          </div>
                        )}
                        <div className="col-md-12">
                          <label className="form-label">Descripción</label>
                          <textarea
                            className={`form-control ${invalid?.descripcion ? "is-invalid" : ""}`}
                            name="descripcion"
                            value={editableEquipo.descripcion || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^[a-zA-ZÀ-ÿñÑ\s.,]*$/.test(value) || value === "") {
                                setInvalid({ ...invalid, descripcion: false });
                                handleInputChange(e);
                              } else {
                                setInvalid({ ...invalid, descripcion: true });
                              }
                            }}
                          ></textarea>
                          {invalid?.descripcion && (
                            <div className="invalid-feedback">
                              La descripción solo puede contener letras, espacios, puntos, comas, la ñ y acentos.
                            </div>
                          )}
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Ciudad</label>
                          <input
                            type="text"
                            className={`form-control ${invalid?.ciudad ? "is-invalid" : ""}`}
                            name="ciudad"
                            value={editableEquipo.ciudad || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^[a-zA-ZÀ-ÿñÑ\s]*$/.test(value) || value === "") {
                                setInvalid({ ...invalid, ciudad: false }); 
                                handleInputChange(e);
                              } else {
                                setInvalid({ ...invalid, ciudad: true }); 
                              }
                            }}
                          />
                          {invalid?.ciudad && (
                            <div className="invalid-feedback">
                              La ciudad solo puede contener letras, espacios, la ñ y acentos.
                            </div>
                          )}
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Deporte</label>
                          <select
                            className="form-select"
                            name="deporte"
                            value={editableEquipo.deporte || ""}
                            onChange={handleInputChange}
                            disabled={jugadores.length > 0}
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
                          <label className="form-label">
                            Número de Titulares
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            name="num_titulares"
                            value={editableEquipo.num_titulares || ""}
                            onChange={handleInputChange}
                            disabled
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">
                            Número de Suplentes
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            name="num_suplentes"
                            value={editableEquipo.num_suplentes || ""}
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
                          setEditableEquipo({});
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

            {showJugadoresModal && (
              <div
                className="modal d-block bg-dark bg-opacity-50"
                tabIndex="-1"
              >
                <div className="modal-dialog modal-lg modal-dialog-centered">
                  <div className="modal-content rounded-4">
                    <div className="modal-header">
                      <h5 className="modal-title">Editar Jugadores</h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShowJugadoresModal(false)}
                      ></button>
                    </div>
                    <div className="modal-body">
                      <div className="mb-3 d-flex">
                        <form className="row g-3">
                          <div className="col-md-6">
                            <label className="form-label">Nombre <span className="text-danger">*</span></label>
                            <input
                              type="text"
                              className={`form-control ${invalid?.nombre ? "is-invalid" : ""}`}
                              name="nombre"
                              value={nuevoJugador.nombre || ""}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (/^[a-zA-ZÀ-ÿñÑ\s]*$/.test(value) || value === "") {
                                  setInvalid({ ...invalid, nombre: false }); 
                                  setNuevoJugador({ ...nuevoJugador, nombre: value });
                                } else {
                                  setInvalid({ ...invalid, nombre: true });
                                }
                              }}
                              required
                            />
                            {invalid?.nombre && (
                              <div className="invalid-feedback">
                                El nombre solo puede contener letras, espacios, la ñ y acentos.
                              </div>
                            )}
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Fecha de Nacimiento <span className="text-danger">*</span></label>
                            <input
                              type="date"
                              className={`form-control ${invalid?.fecha_nacimiento ? "is-invalid" : ""}`}
                              name="fecha_nacimiento"
                              value={nuevoJugador.fecha_nacimiento || ""}
                              onChange={(e) => {
                                const value = e.target.value;
                                const fechaNacimiento = new Date(value);
                                const hoy = new Date();
                                const edadMinima = 15;
                                const fechaLimite = new Date();
                                fechaLimite.setFullYear(hoy.getFullYear() - edadMinima);

                                if (fechaNacimiento <= hoy && fechaNacimiento <= fechaLimite) {
                                  setInvalid({ ...invalid, fecha_nacimiento: false }); 
                                  setNuevoJugador({ ...nuevoJugador, fecha_nacimiento: value });
                                } else {
                                  setInvalid({ ...invalid, fecha_nacimiento: true }); 
                                }
                              }}
                              required
                            />
                            {invalid?.fecha_nacimiento && (
                              <div className="invalid-feedback">
                                La fecha de nacimiento debe ser válida y el jugador debe tener al menos 15 años.
                              </div>
                            )}
                          </div>

                          <div className="col-md-6">
                            <label className="form-label">Posición <span className="text-danger">*</span></label>
                            <select
                              className={`form-select ${invalid?.posicion ? "is-invalid" : ""}`}
                              name="posicion"
                              value={nuevoJugador.posicion || ""}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value) {
                                  setInvalid({ ...invalid, posicion: false });
                                  setNuevoJugador({ ...nuevoJugador, posicion: value });
                                } else {
                                  setInvalid({ ...invalid, posicion: true }); 
                                }
                              }}
                              required
                            >
                              <option value="">Selecciona una posición</option>
                              {posiciones.map((posicion) => (
                                <option key={posicion.id} value={posicion.id}>
                                  {posicion.nombre}
                                </option>
                              ))}
                            </select>
                            {invalid?.posicion && (
                              <div className="invalid-feedback">
                                Por favor selecciona una posición válida.
                              </div>
                            )}
                          </div>

                          <div className="col-md-6 d-flex align-items-center">
                            <label className="form-label me-3">¿Es Titular?</label>
                            <div className="form-check form-switch me-3">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="esTitularSwitch"
                                checked={nuevoJugador.es_titular || false}
                                onChange={(e) =>
                                  setNuevoJugador({ ...nuevoJugador, es_titular: e.target.checked })
                                }
                              />
                              <label className="form-check-label" htmlFor="esTitularSwitch">
                                {nuevoJugador.es_titular ? "Sí" : "No"}
                              </label>
                            </div>
                            <button
                              className="btn btn-success ms-5"
                              onClick={handleSaveJugador}
                            >
                              {editarJugador ? "Actualizar" : "Agregar"}
                            </button>
                          </div>

                        </form>

                      </div>

                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>Nombre</th>
                            <th>Fecha de Nacimiento</th>
                            <th>Edad</th>
                            <th>Posición</th>
                            <th>Es Titular</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {jugadores.map((jugador) => (
                            <tr key={jugador.id}>
                              <td>{jugador.nombre}</td>
                              <td>{jugador.fecha_nacimiento}</td>
                              <td>{jugador.edad}</td>
                              <td>{jugador.posicion}</td>
                              <td>{jugador.es_titular ? "Sí" : "No"}</td>
                              <td>
                                <button
                                  className="btn btn-sm btn-primary me-2"
                                  onClick={() => handleEditJugador(jugador)}
                                >
                                  ✏️
                                </button>
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() =>
                                    handleDeleteJugador(jugador.id)
                                  }
                                >
                                  ❌
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="modal-footer">
                    
                      <button
                        className="btn btn-secondary"
                        onClick={() => setShowJugadoresModal(false)}
                      >
                        Cerrar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipoDetalle;
