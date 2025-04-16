import { useState } from 'react';
import Sidebar from "./Sidebar";
import Usuarios from "./Cruds/Usuarios";
// import Eventos from "./Cruds/Eventos";


function AdminDashboard() {
  const [activeComponent, setActiveComponent] = useState('Usuarios');

  const renderComponent = () => {
    switch(activeComponent) {
      case 'Usuarios': return <Usuarios />;
      // case 'Eventos' : return <Eventos />;
    }
  };
  const menuItems = [
    { name: 'Usuarios', component: 'Usuarios', icon: null },
    // { name: 'Equipos', component: 'Equipos', icon: null },
    // { name: 'Entrenadores', component: 'Entrenadores', icon: null },
    // { name: 'Jugadores', component: 'Jugadores', icon: null },
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