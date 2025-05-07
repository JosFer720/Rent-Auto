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
        <button className={styles.filtro}>ECONÓMICO</button>
        <button className={styles.filtro}>DEPORTIVO</button>
        <button className={styles.filtro}>FAMILIAR</button>
        <button className={styles.filtro}>ELÉCTRICO</button>
      </div>

      <div className={styles.carList}>
        <div className={styles.carCard}>
          <h3>Toyota Corolla</h3>
          <p>Categoría: Sedán</p>
          <p>Año: 2020</p>
          <p>Estado: Disponible</p>
          <p>Precio: 45/día</p>
          <button className={styles.filtro}>Reservar</button>
        </div>

        <div className={styles.carCard}>
          <h3>Ford EcoSport</h3>
          <p>Categoría: SUV</p>
          <p>Año: 2019</p>
          <p>Estado: Disponible</p>
          <p>Precio: 60/día</p>
          <button className={styles.filtro}>Reservar</button>
        </div>

        <div className={styles.carCard}>
          <h3>Chevrolet Spark</h3>
          <p>Categoría: Económico</p>
          <p>Año: 2018</p>
          <p>Estado: Disponible</p>
          <p>Precio: 35/día</p>
          <button className={styles.filtro}>Reservar</button>
        </div>

        <div className={styles.carCard}>
          <h3>Nissan Model X</h3>
          <p>Categoría: Desconocida</p>
          <p>Año: 2013</p>
          <p>Estado: Mantenimiento</p>
          <p>Precio: 123.95/día</p>
          <button className={styles.filtro}>Reservar</button>
        </div>
      </div>
      </section>
    </div>
  );
}