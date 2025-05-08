import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register'
import Autos from './pages/Autos'
import MisReservas from './pages/MisReservas';
import Perfil from './pages/Perfil';
import Pagos from './pages/Pagos';
import Reportes from './pages/Reportes'
import Resultados from './pages/Resultados'

function AppRoutes() {
  const location = useLocation();
  const rutasSinNavbar = ['/', '/login', '/registrar'];

  const mostrarNavbar = !rutasSinNavbar.includes(location.pathname);

  return (
    <>
      {mostrarNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registrar" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/autos" element={<Autos />} />
        <Route path="/mis-reservas" element={<MisReservas/>}/>
        <Route path="/perfil" element={<Perfil/>}/>
        <Route path="/pagos" element={<Pagos/>}/>
        <Route path="/reportes" element={<Reportes/>}/>
        <Route path="/resultados" element={<Resultados/>}/>
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
