import React from 'react';
import styles from './Autos.module.css'; // Usa los mismos estilos base

export default function MisReservas() {
  const reservas = [
    {
      vehiculo: 'Toyota Corolla',
      fechaInicio: '08/05/2025',
      fechaFin: '10/05/2025',
      estado: 'Activa',
      precioTotal: 90,
    },
    {
      vehiculo: 'Ford EcoSport',
      fechaInicio: '01/04/2025',
      fechaFin: '03/04/2025',
      estado: 'Finalizada',
      precioTotal: 180,
    },
  ];

  return (
    <div className={styles.autosContainer}>
      <h1 className={styles.autosTitle}>Mis Reservas</h1>
      <section className={styles.reservasLista}>
        {reservas.map((reserva, index) => (
          <div key={index} className={styles.reservaCard}>
            <h3>{reserva.vehiculo}</h3>
            <p>Inicio: {reserva.fechaInicio}</p>
            <p>Fin: {reserva.fechaFin}</p>
            <p>Estado: {reserva.estado}</p>
            <p>Total: ${reserva.precioTotal}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
