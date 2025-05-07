import React from 'react';
import styles from './login.module.css';
import logo from '../assets/logo.png';

export default function Login() {
  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginForm}>
        <img src={logo} alt="logo empresa" className={styles.loginLogo} />
        <h1 className={styles.loginTitle}>Rent Auto</h1>
        <h2 className={styles.loginSubtitle}>Iniciar Sesión</h2>

        <label for="email" className={styles.labelLogin}>Ingresa tu Correo</label>
        <input
          type="email"
          placeholder="Correo"
          required
          className={styles.loginInput}
          id="email"
          name="email"
        />

      <label for="contraseña" className={styles.labelLogin}>Ingresa tu Contraseña</label>  
        <input
          type="password"
          placeholder="Contraseña"
          required
          className={styles.loginInput}
          id="contraseña"
          name="contraseña"
        />
        <button type="submit" className={styles.loginButton} onClick={() => window.location.href = '/dashboard'}>Entrar</button>
        <a href="/registrar" className={styles.registrar}>Registrate</a>
      </form>
    </div>
  );
}
