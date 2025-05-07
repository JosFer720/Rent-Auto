import React from 'react';
import styles from './Perfil.module.css';

export default function Perfil() {
  const usuario = {
    nombre: 'Usuario 1',
    correo: 'usuario.1185@mail.com',
    contrasenaHash: 'hash1234',
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Perfil de Usuario</h1>
      <section className={styles.card}>
        <h3>{usuario.nombre}</h3>
        <p>Email: {usuario.correo}</p>
        <p>Contraseña (hash): {usuario.contrasenaHash}</p>
      </section>
    </div>
  );
}
