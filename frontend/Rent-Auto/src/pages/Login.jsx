import React from 'react';
import styles from './login.module.css';
import logo from '../assets/logo.png';

export default function Login() {
  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginForm}>
        <img src={logo} alt="logo empresa"/>
        <h1>Rent Auto</h1>
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