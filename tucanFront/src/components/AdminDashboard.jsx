import { act, useEffect, useState } from 'react';
import Sidebar from "./Sidebar";
import Usuarios from "./Cruds/Usuarios";
import Deportes from "./Cruds/Deportes";;
import Eventos from './Cruds/Eventos';
import DeporteDetalles from './Cruds/DeporteDetalles';
// import Eventos from "./Cruds/Eventos";


function AdminDashboard() {
  const [activeComponent, setActiveComponent] = useState({ name: null , params: null });
  const renderComponent = () => {
    if (!activeComponent.name) {
      return   <div className="text-center mt-4 text-muted">
      <i className="bi bi-exclamation-circle fs-1 d-block mb-2"></i>
      <h5>Selecciona una opción del Menú</h5>
    </div>
    }
    switch(activeComponent.name) {
      case 'Usuarios': return <Usuarios />;
      case 'Deportes': return <Deportes onNavigate={(component, params) => setActiveComponent({ name: component, params })} />;
      case 'Posiciones': return<DeporteDetalles  id={activeComponent.params?.id} />;
      case 'Eventos': return <Eventos />;
      //case 'Equipos': return <Equipos />;
    }
  };
  const menuItems = [
    { name: 'Usuarios', component: 'Usuarios', icon: 'bi bi-people-fill' },
    { name: 'Deportes', component: 'Deportes', icon: 'bi bi-trophy-fill' },
    { name: 'Posiciones', component: 'Posiciones', icon: 'bi bi-list-ol' },
    { name: 'Eventos', component: 'Eventos', icon: 'bi bi-calendar-event-fill' },
    // { name: 'Equipos', component: 'Equipos', icon: 'bi bi-shield-fill' },
    // { name: 'Entrenadores', component: 'Entrenadores', icon: 'bi bi-person-badge-fill' },
    // { name: 'Jugadores', component: 'Jugadores', icon: 'bi bi-person-lines-fill' },
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

export default AdminDashboard;