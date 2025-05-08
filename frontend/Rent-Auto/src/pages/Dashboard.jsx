import React from 'react';
import styles from './dashboard.module.css';

export default function Dashboard() {
  const userRole = localStorage.getItem('userRole');
  const reservasActivas = 2;
  const proximoAlquiler = '10/05/2025';
  const ultimoVehiculo = 'Toyota Corolla 2021';

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.dashboardTitle}>Panel Principal</h1>

      <section className={styles.dashboardResumen}>
        {userRole === 'admin' && (
          <>
            <div className={styles.dashboardCard}>
              <h2>Total Reservas</h2>
              <p>35</p>
            </div>
            <div className={styles.dashboardCard}>
              <h2>Vehículos Alquilados</h2>
              <p>22</p>
            </div>
            <div className={styles.dashboardCard}>
              <h2>En Mantenimiento</h2>
              <p>5</p>
            </div>
            <div className={styles.dashboardCard}>
              <h2>Pagos Registrados</h2>
              <p>$12,450</p>
            </div>
          </>
        )}

        {userRole === 'empleado' && (
          <>
            <div className={styles.dashboardCard}>
              <h2>Reservas Activas</h2>
              <p>3</p>
            </div>
            <div className={styles.dashboardCard}>
              <h2>Alquileres Activos</h2>
              <p>2</p>
            </div>
          </>
        )}

        {userRole === 'cliente' && (
          <>
            <div className={styles.dashboardCard}>
              <h2>Reservas Activas</h2>
              <p>{reservasActivas}</p>
            </div>
            <div className={styles.dashboardCard}>
              <h2>Próximo Alquiler</h2>
              <p>{proximoAlquiler}</p>
            </div>
            <div className={styles.dashboardCard}>
              <h2>Último Vehículo</h2>
              <p>{ultimoVehiculo}</p>
            </div>
          </>
        )}
      </section>

      <section className={styles.dashboardAcciones}>
        <h2>Accesos Rápidos</h2>
        <button className={styles.dashboardButton} onClick={() => window.location.href = '/mis-reservas'}>
          {userRole === 'admin' ? 'Ver Todas las Reservas' : 'Mis Reservas'}
        </button>
        <button className={styles.dashboardButton} onClick={() => window.location.href = '/pagos'}>
          Historial de Pagos
        </button>
      </section>
    </div>
  );
}
