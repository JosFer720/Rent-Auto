import React from 'react';
import styles from './Pagos.module.css';

export default function Pagos() {
  const pagos = [
    {
      idPago: 1,
      idAlquiler: 1,
      monto: 195.76,
      fechaPago: '09/04/2024',
      metodo: 'Transferencia',
    }
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Historial de Pagos</h1>
      <section className={styles.lista}>
        {pagos.map((pago) => (
          <div key={pago.idPago} className={styles.card}>
            <h3>Pago #{pago.idPago}</h3>
            <p>Alquiler ID: {pago.idAlquiler}</p>
            <p>Monto: ${pago.monto.toFixed(2)}</p>
            <p>Fecha: {pago.fechaPago}</p>
            <p>Método: {pago.metodo}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
