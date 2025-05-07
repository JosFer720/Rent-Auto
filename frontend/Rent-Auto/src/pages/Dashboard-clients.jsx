import React from 'react';
import styles from './dashboard-clients.module.css';

export default function Dashboard() {
  const reservasActivas = 2;
  const proximoAlquiler = '10/05/2025';
  const ultimoVehiculo = 'Toyota Corolla 2021';

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.dashboardTitle}>Panel Principal</h1>

      <section className={styles.dashboardResumen}>
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
      </section>

      <section className={styles.dashboardAcciones}>
        <h2>Accesos Rápidos</h2>
        <button className={styles.dashboardButton} onClick={() => window.location.href = '/mis-reservas'}>Mis Reservas</button>
        <button className={styles.dashboardButton} onClick={() => window.location.href = '/pagos'}>Historial de Pagos</button>
      </section>
    </div>
  );
}