import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Reportes from './pages/Reportes';
import Resultados from './pages/Resultados';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/resultados" element={<Resultados />} />
      </Routes>
    </Router>
  );
}
