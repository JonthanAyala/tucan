import React, { useState } from 'react';

const Sidebar = ({ onSelectComponent, activeComponent, menuItems }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <div
      className={`border-end bg-light ${collapsed ? 'p-2' : 'p-3'} d-flex flex-column align-items-${collapsed ? 'center' : 'start'}`}
      style={{
        minHeight: '100vh',
        width: collapsed ? '60px' : '220px',
        transition: 'width 0.3s ease',
      }}
    >
      <button 
        className="btn btn-outline-secondary w-100 mb-3"
        onClick={toggleSidebar}
        title={collapsed ? 'Abrir menú' : 'Cerrar menú'}
      >
        ☰
      </button>

      <ul className="nav nav-pills flex-column w-100 gap-1">
        {menuItems.map(item => (
          <li className="nav-item" key={item.name}>
            <button
              className={`nav-link d-flex align-items-center gap-2 px-3 py-2 rounded 
                ${activeComponent === item.component ? 'active bg-primary text-white' : 'text-dark'}`}
              onClick={() => onSelectComponent(item.component)}
              title={collapsed ? item.name : undefined}
              style={{
                fontSize: '1rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                transition: 'background-color 0.2s',
              }}
            >
              <i className={`${item.icon} fs-5`}></i>
              {!collapsed && <span>{item.name}</span>}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
