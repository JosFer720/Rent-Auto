import React from 'react';
import styles from './login.module.css';
import logo from '../assets/logo.png';

export default function Login() {
  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginForm}>
        <img src={logo} alt="logo empresa" className={styles.loginLogo} />
        <h1 className={styles.loginTitle}>Rent Auto</h1>

        <label for="email" className={styles.labelLogin}>Ingresa tu Email</label>
        <input
          type="email"
          placeholder="Correo@fake.com"
          required
          className={styles.loginInput}
          id="email"
          name="email"
        />
        <label for="email" className={styles.labelLogin}>Ingresa tu Contraseña</label>
        <input
          type="password"
          placeholder="Contraseña"
          required
          className={styles.loginInput}
          id="contraseña"
          name="contraseña"
        />
        <button type="submit" className={styles.loginButton} onClick={() => window.location.href = '/dashboard'}>Registrate</button>
      </form>
    </div>
  );
}
