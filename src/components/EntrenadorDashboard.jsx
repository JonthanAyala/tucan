import { useState } from 'react';
import NavBar from "./NavBar";
import Sidebar from "./Sidebar";
import Equipos from "./Cruds/Equipos";

function Prueba() {
  const [activeComponent, setActiveComponent] = useState('');

  const renderComponent = () => {
    switch(activeComponent) {
      case 'Equipos': return <Equipos />;
      default: return <div className="text-center"><h2>Selecciona una opción del menú</h2></div>;
    }
  };

  const menuItems = [
    // { name: 'Usuarios', component: 'Usuarios', icon: null },
    { name: 'Equipos', component: 'Equipos', icon: null },
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

export default Prueba;