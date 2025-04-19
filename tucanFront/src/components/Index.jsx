import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import EventosVista from './Eventos/Eventos';


const Index = () => {

    return (
        <div className="container-fluid p-0">
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                <div className="container-fluid d-flex justify-content-between align-items-center">
                    <div style={{ width: '60px' }}></div>
                    <span className="navbar-brand mx-auto">TUCANAAP</span>
                    <a className="btn btn-light" href="/login">Login</a>
                </div>
            </nav>
            <div className="container mt-5">
                <EventosVista/>
            </div>
        </div>
    );
};

export default Index;