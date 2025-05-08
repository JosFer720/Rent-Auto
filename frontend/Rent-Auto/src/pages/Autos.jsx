import React from 'react';
import styles from './Autos.module.css';

export default function Autos() {
  const userRole =localStorage.getItem('userRole');

  const handleReservar = (vehiculo) => {
    const fechaInicio = prompt("Fecha inicio (YYYY-MM-DD HH:mm):");
    const fechaFin = prompt("Fecha fin (YYYY-MM-DD HH:mm):");
    console.log(`Reserva: ${vehiculo} desde ${fechaInicio} hasta ${fechaFin}`);
    // BACKEND
  };

  const handleAlquilar = (reservaId) => {
    const fechaEntrega = prompt("Fecha entrega (YYYY-MM-DD HH:mm):");
    const fechaDevolucion = prompt("Fecha devolución (YYYY-MM-DD HH:mm):");
    console.log(`Alquiler para reserva ${reservaId}, de ${fechaEntrega} a ${fechaDevolucion}`);
    // BACKEND
  };

  const handleNuevoVehiculo = () => {
    const marca = prompt("Marca:");
    const modelo = prompt("Modelo:");
    const anio = prompt("Año:");
    const costo = prompt("Costo por día:");
    console.log(`Agregar nuevo vehículo: ${marca} ${modelo}, ${anio}, $${costo}/día`);
    // BACKEND
  };

  const handleEstado = (vehiculoId) => {
    const nuevoEstado = prompt("Nuevo estado (Disponible / Rentado / Mantenimiento):");
    console.log(`Cambiar estado del vehículo ${vehiculoId} a ${nuevoEstado}`);
    // BACKEND
  };

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

        {userRole === 'admin' && (
          <div style={{ marginTop: '1rem' }}>
            <button className={styles.filtro} onClick={handleNuevoVehiculo}>Añadir Vehículo</button>
          </div>
        )}

        <div className={styles.carList}>
          {[
            { id: 1, nombre: "Toyota Corolla", categoria: "Sedán", anio: 2020, estado: "Disponible", precio: 45 },
            { id: 2, nombre: "Ford EcoSport", categoria: "SUV", anio: 2019, estado: "Disponible", precio: 60 },
            { id: 3, nombre: "Chevrolet Spark", categoria: "Económico", anio: 2018, estado: "Disponible", precio: 35 },
            { id: 4, nombre: "Nissan Model X", categoria: "Desconocida", anio: 2013, estado: "Mantenimiento", precio: 123.95 },
          ].map(auto => (
            <div key={auto.id} className={styles.carCard}>
              <h3>{auto.nombre}</h3>
              <p>Categoría: {auto.categoria}</p>
              <p>Año: {auto.anio}</p>
              <p>Estado: {auto.estado}</p>
              <p>Precio: {auto.precio}/día</p>

              {(userRole === 'cliente' || userRole === 'empleado') && (
                <>
                  <button className={styles.filtro} onClick={() => handleReservar(auto.nombre)}>Reservar</button>
                  <button className={styles.filtro} onClick={() => handleAlquilar(auto.id)}>Alquilar</button>
                </>
              )}

              {userRole === 'admin' && (
                <button className={styles.filtro} onClick={() => handleEstado(auto.id)}>
                  Cambiar Estado
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}