import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const userRole = localStorage.getItem('userRole');

  return (
    <nav className="navbar">
      <div className="logo">Rent Auto</div>
      <ul className="nav-links">
        <li><Link to="/dashboard">Principal</Link></li>
        <li><Link to="/autos">Autos</Link></li>
        {userRole === 'admin' && <li><Link to="/reportes">Reportes</Link></li>}
        <li><Link to="/perfil">Perfil</Link></li>
        <li><Link to="/">Salir</Link></li>
      </ul>
    </nav>
  );
}
