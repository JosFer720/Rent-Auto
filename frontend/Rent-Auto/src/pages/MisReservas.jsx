import React from 'react';
import styles from './MisReservas.module.css';

export default function MisReservas() {
  const userRole = localStorage.getItem('userRole');

  const reservasAdmin = [
    { vehiculo: 'Toyota Corolla', usuario: 'Juan Pérez', estado: 'Activa', fechaInicio: '08/05/2025', fechaFin: '10/05/2025', precioTotal: 90 },
    { vehiculo: 'Chevrolet Spark', usuario: 'Ana Gómez', estado: 'Finalizada', fechaInicio: '01/04/2025', fechaFin: '03/04/2025', precioTotal: 150 },
    { vehiculo: 'Ford EcoSport', usuario: 'Carlos Ruiz', estado: 'Cancelada', fechaInicio: '05/04/2025', fechaFin: '07/04/2025', precioTotal: 0 },
  ];

  const reservasEmpleadoCliente = [
    { vehiculo: 'Toyota Corolla', fechaInicio: '08/05/2025', fechaFin: '10/05/2025', estado: 'Activa', precioTotal: 90 },
    { vehiculo: 'Ford EcoSport', fechaInicio: '01/04/2025', fechaFin: '03/04/2025', estado: 'Finalizada', precioTotal: 180 },
  ];

  const mostrarReservas = userRole === 'admin' ? reservasAdmin : reservasEmpleadoCliente;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        {userRole === 'admin' ? 'Reservas del Sistema' : 'Mis Reservas'}
      </h1>

      <section className={styles.lista}>
        {mostrarReservas.map((reserva, index) => (
          <div key={index} className={styles.card}>
            <h3>{reserva.vehiculo}</h3>
            {userRole === 'admin' && <p>Usuario: {reserva.usuario}</p>}
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
