import React, { useState } from 'react';

const Sidebar = ({ onSelectComponent, activeComponent, menuItems }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <div
      className={`d-flex flex-column ${collapsed ? 'p-2' : 'p-3'}`}
      style={{
        minHeight: '100vh',
        width: collapsed ? '80px' : '250px',
        transition: 'width 0.3s ease',
        background: 'linear-gradient(180deg, #1a3a8f 0%, #0d2259 100%)',
        color: 'white',
        boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        zIndex: '1000'
      }}
    >
      {/* Encabezado con logo y botón */}
      <div
        className={`d-flex align-items-center ${collapsed ? 'justify-content-center' : 'justify-content-between'} mb-4`}
        style={{ minHeight: '40px' }}
      >
        {!collapsed && (
          <h4 className="m-0 text-white fw-bold">
            <i className="fas fa-running me-2"></i>
            Menú
          </h4>
        )}
        {collapsed && (
          <i className="fas fa-running text-white fs-4"></i>
        )}
        <button 
          className={`bi ${collapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`}
          onClick={toggleSidebar}
          title={collapsed ? 'Expandir menú' : 'Contraer menú'}
          style={{
            color: '#1a3a8f',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}
        >
          <i className={`fas fa-${collapsed ? 'chevron-right' : 'chevron-left'}`}></i>
        </button>
      </div>

      {/* Elementos del menú */}
      <ul className="nav nav-pills flex-column w-100 gap-2">
        {menuItems.map(item => (
          <li className="nav-item" key={item.name}>
            <button
              className={`nav-link d-flex align-items-center gap-3 px-3 py-3 rounded 
                ${activeComponent === item.component ? 'active bg-white text-primary' : 'text-white hover-bg'}`}
              onClick={() => onSelectComponent(item.component)}
              title={collapsed ? item.name : undefined}
              style={{
                fontSize: '1rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                transition: 'all 0.2s',
                width: '100%',
                border: 'none',
                background: activeComponent === item.component ? 'white' : 'transparent',
                textAlign: 'left'
              }}
            >
              <i className={`${item.icon} fs-5 ${activeComponent === item.component ? 'text-primary' : 'text-white'}`}></i>
              {!collapsed && <span style={{fontWeight: '500'}}>{item.name}</span>}
            </button>
          </li>
        ))}
      </ul>

     
    </div>
  );
};

export default Sidebar;