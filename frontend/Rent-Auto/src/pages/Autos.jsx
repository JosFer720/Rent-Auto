import React from 'react';
import styles from './Autos.module.css';

export default function Autos() {
  const reservasActivas = 2;
  const proximoAlquiler = '10/05/2025';
  const ultimoVehiculo = 'Toyota Corolla 2021';

  return (
    <div className={styles.autosContainer}>
      <h1 className={styles.autosTitle}>Buscador de Autos</h1>

      <section className={styles.autosPrincipal}>
        <div className={styles.autosBuscador}>
          <input type="text" placeholder='Buscar'/>
        </div>
        <div className={styles.filtros}>
            <button className={styles.filtro}>SUV</button>
            <button className={styles.filtro}>SEDAN</button>
            <button className={styles.filtro}>CAMIONETA</button>
        </div>
        <div className={styles.carList}>
        <div className={styles.carCard}>
          <h3>Toyota Corolla</h3>
          <p>Categoría: Sedán</p>
          <p>Precio: 45/día</p>
        </div>

        <div className={styles.carCard}>
          <h3>Ford EcoSport</h3>
          <p>Categoría: SUV</p>
          <p>Precio: 60/día</p>
        </div>

        <div className={styles.carCard}>
          <h3>Chevrolet Spark</h3>
          <p>Categoría: Económico</p>
          <p>Precio:    35/día</p>
        </div>
      </div>
      </section>
    </div>
  );
}