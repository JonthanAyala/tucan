import { useState } from 'react';
import NavBar from "./NavBar";
import Sidebar from "./Sidebar";
import Equipos from "./Cruds/Equipos";
import EquipoDetalle from "./Cruds/EquipoDetalles";

function Prueba() {
  const [activeComponent, setActiveComponent] = useState({ name: null , params: null });

  const renderComponent = () => {
    switch (activeComponent.name) {
      case 'Equipos':
        return (
          <Equipos
            onNavigate={(component, params) => setActiveComponent({ name: component, params })}
          />
        );
      case 'EquipoDetalle':
        return <EquipoDetalle id={activeComponent.params?.id} />;
      default:
        return  <div className="text-center mt-4 text-muted">
        <i className="bi bi-exclamation-circle fs-1 d-block mb-2"></i>
        <h5>Selecciona una opción del Menú</h5>
      </div>
    }
  };

  const menuItems = [
    { name: 'Equipos', component: 'Equipos', icon: 'bi bi-people-fill' },
    { name: 'EquipoDetalle', component: 'EquipoDetalle', icon: 'bi bi-info-circle-fill' },
  ];

  return (
    <div className="d-flex flex-grow-1 overflow-hidden">
      <Sidebar
        onSelectComponent={(component) => setActiveComponent({ name: component, params: null })}
        activeComponent={activeComponent.name}
        menuItems={menuItems}
      />
      <div className="flex-grow-1 p-3 overflow-auto">
        {renderComponent()}
      </div>
    </div>
  );
}

export default Prueba;