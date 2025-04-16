import { useState } from 'react';
import NavBar from "./NavBar";
import Sidebar from "./Sidebar";


function Prueba() {
  const [activeComponent, setActiveComponent] = useState('');

  const renderComponent = () => {
    switch(activeComponent) {
    //   case 'Clientes': return <Clientes />;
    //   case 'Contratos': return <Contratos />;
    //   case 'Paquetes': return <Paquetes />;
    //   case 'Categorias': return <Categorias />;
    //   case 'Canales': return <Canales />;
    //   default: return <Clientes />;
    }
  };

  return (
    <div className="vh-100 d-flex flex-column">
      <NavBar />

      <div className="d-flex flex-grow-1 overflow-hidden">
        <Sidebar 
          onSelectComponent={setActiveComponent} 
          activeComponent={activeComponent}
        />
        
        <div className="flex-grow-1 p-3 overflow-auto">
          {renderComponent()}
        </div>
      </div>
    </div>
  );
}

export default Prueba;