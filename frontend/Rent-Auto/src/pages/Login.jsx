import React from 'react';
import styles from './login.module.css';

export default function Login() {
  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginForm}>
        <h2>Iniciar Sesión</h2>
        <input
          type="email"
          placeholder="Correo"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          required
        />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}