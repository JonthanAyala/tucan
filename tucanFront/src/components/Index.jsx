import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import EventosVista from './Eventos/Eventos';

const Index = () => {
    // Estado para controlar el menú mobile
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Función para alternar el estado del menú
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="container-fluid p-0">
            <nav className="navbar navbar-expand-lg" style={{
                background: 'linear-gradient(180deg, #1a3a8f 0%, #0d2259 100%)',
                padding: '0.5rem 1rem',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                position: 'sticky',
                top: 0,
                zIndex: 900,
                minHeight: '70px'
            }}>
                <div className="container-fluid">
                    {/* Botón hamburguesa para móviles */}
                    <button 
                        className="navbar-toggler" 
                        type="button" 
                        onClick={toggleMenu}
                        aria-expanded={isMenuOpen ? "true" : "false"}
                        aria-label="Toggle navigation"
                        style={{
                            border: 'none',
                            padding: '0.25rem',
                            marginRight: '0.5rem',
                            display: 'none'
                        }}
                    >
                        <span style={{
                            color: 'white',
                            fontSize: '1.5rem'
                        }}>☰</span>
                    </button>
                    
                    {/* Logo círculo */}
                    <div className="d-flex align-items-center">
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'flex-start', 
                            width: '50px',
                            marginTop: '-10px', 
                            height: '50px', 
                            borderRadius: '50%', 
                            background: 'linear-gradient(180deg, #1a3a8f 0%, #0d2259 100%)', 
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', 
                            overflow: 'hidden',
                            marginRight: '1rem'
                        }}>
                            <img
                                src="/src/assets/toucan.gif"
                                alt="Toucan Logo"
                                style={{ maxWidth: '100%', maxHeight: '100%' }}
                            />
                        </div>
                    </div>
                    
                    {/* Título de la aplicación */}
                    <span className="navbar-brand" style={{
                        fontWeight: '600',
                        fontSize: '1.25rem',
                        color: 'white',
                        textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
                        margin: '0 auto 0 0'
                    }}>TucanApp</span>

                    {/* Contenedor del menú colapsable */}
                    <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <a className="btn btn-light" href="/login" style={{
                                    color: '#0d2259',
                                    fontWeight: '500',
                                    textShadow: '0 1px 2px rgba(255, 255, 255, 0.5)'
                                }}>Login</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Estilos responsivos con media queries */}
            <style jsx>{`
                @media (max-width: 991.98px) {
                    .navbar-toggler {
                        display: block !important;
                    }
                    .navbar-brand {
                        margin: 0 auto !important;
                    }
                    .collapse:not(.show) {
                        display: none;
                    }
                    .navbar .collapse.show, .navbar .collapsing {
                        position: absolute;
                        top: 70px;
                        left: 0;
                        right: 0;
                        background: linear-gradient(180deg, #1a3a8f 0%, #0d2259 100%);
                        padding: 1rem;
                        z-index: 1000;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    }
                    .navbar-nav {
                        flex-direction: column;
                        width: 100%;
                    }
                    .nav-item {
                        margin: 0.5rem 0;
                        text-align: center;
                    }
                }
            `}</style>

            <div className="container mt-5">
                <EventosVista />
            </div>
        </div>
    );
};

export default Index;