import { useState } from 'react';
import Sidebar from "./Sidebar";
import Usuarios from "./Cruds/Usuarios";
import Deportes from "./Cruds/Deportes";
import Posiciones from './Cruds/Posiciones';
import Eventos from './Cruds/Eventos';
// import Eventos from "./Cruds/Eventos";


function AdminDashboard() {
  const [activeComponent, setActiveComponent] = useState('Usuarios');

  const renderComponent = () => {
    switch(activeComponent) {
      case 'Usuarios': return <Usuarios />;
      case 'Deportes': return <Deportes />;
      case 'Posiciones': return <Posiciones />;
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
          onSelectComponent={setActiveComponent} 
          activeComponent={activeComponent}
          menuItems={menuItems}
        />
        
        <div className="flex-grow-1 p-3 overflow-auto">
          {renderComponent()}
        </div>
      </div>
  );
}

export default AdminDashboard;