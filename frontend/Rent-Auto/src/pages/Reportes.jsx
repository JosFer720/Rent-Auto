import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Reportes.module.css';

export default function Reportes() {
  const navigate = useNavigate();

  const irAReporte = (tipo) => {
    navigate(`/resultados?tipo=${tipo}`);
  };

  const reportes = [
    { tipo: 'reservas_usuario', icono: '📋', titulo: 'Reservas por Usuario' },
    { tipo: 'mantenimiento', icono: '🧰', titulo: 'Vehículos en Mantenimiento' },
<<<<<<< HEAD
    { tipo: 'pagos', icono: '💳', titulo: 'Pagos por Método' },         // ✅ ahora es tipo 'pagos'
=======
    { tipo: 'metodos', icono: '💳', titulo: 'Pagos por Método' },
>>>>>>> d050911 (Api and DB responses)
    { tipo: 'alquileres', icono: '🚗', titulo: 'Alquileres Activos' },
    { tipo: 'ingresos', icono: '🏢', titulo: 'Ingresos por Sucursal' }   // ✅ este se queda como 'ingresos'
  ];

  return (
    <div className={styles.autosContainer}>
      <h1 className={styles.autosTitle}>📊 Panel de Reportes</h1>
      <section className={styles.gridReportes}>
        {reportes.map((reporte) => (
          <div
            key={reporte.tipo}
            className={styles.reporteCard}
            onClick={() => irAReporte(reporte.tipo)}
          >
            <div className={styles.icon}>{reporte.icono}</div>
            <h3>{reporte.titulo}</h3>
          </div>
        ))}
      </section>
    </div>
  );
}
