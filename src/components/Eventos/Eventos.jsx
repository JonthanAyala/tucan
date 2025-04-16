import React from "react";

const Eventos = ({ proximosEventos = [], eventosFinalizados = [] }) => {
  return (
    <div className="container py-5" style={{ backgroundColor: "#e6f0ff" }}>
      <h1 className="text-center fw-bold mb-4">EVENTOS</h1>

      {/* Próximos eventos */}
  <section className="mb-5">
    <h4 className="text-center mb-3">Próximos Eventos</h4>
    <hr className="mb-4" />
    <div className="row justify-content-center">
      {proximosEventos.length > 0 ? (
        proximosEventos.map((evento, i) => (
          <div className="col-md-3 mb-4" key={i}>
            <div className="card shadow-sm border-0 rounded-4 h-100">
              <div className="card-body text-center">
                <h5 className="fw-semibold mb-2">
                  {evento.equipoLocal} <span className="text-muted">vs</span>{" "}
                  {evento.equipoVisitante}
                </h5>
                <p className="mb-1 text-primary fw-semibold">
                  🕖 {evento.hora}
                </p>
                <p className="text-muted mb-0">📅 Fecha del partido:</p>
                <p className="fw-medium">{evento.fecha}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-muted">No hay próximos eventos</p>
      )}
    </div>
  </section>

  {/* Eventos finalizados */}
  <section>
    <h4 className="text-center mb-3">Eventos finalizados</h4>
    <hr className="mb-4" />
    <div className="row justify-content-center">
      {eventosFinalizados.length > 0 ? (
        eventosFinalizados.map((evento, i) => (
          <div className="col-md-3 mb-4" key={i}>
            <div className="card shadow-sm border-0 rounded-4 h-100">
              <div className="card-body text-center">
                <h5 className="fw-semibold mb-3">
                  {evento.equipoLocal} <span className="text-muted">vs</span>{" "}
                  {evento.equipoVisitante}
                </h5>
                <div className="d-flex justify-content-around">
                  <span
                    className={`fw-bold ${
                      evento.resultadoLocal === "Victoria"
                        ? "text-success"
                        : "text-danger"
                    }`}
                  >
                    {evento.resultadoLocal}
                  </span>
                  <span
                    className={`fw-bold ${
                      evento.resultadoVisitante === "Victoria"
                        ? "text-success"
                        : "text-danger"
                    }`}
                  >
                    {evento.resultadoVisitante}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-muted">No hay eventos finalizados</p>
      )}
    </div>
  </section>
</div>
  );
};

export default Eventos;
