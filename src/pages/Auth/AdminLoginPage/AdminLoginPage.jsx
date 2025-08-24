import { useState } from 'react';
import styles from './AdminLoginPage.module.scss';
import AdminLogin from '../../../components/Auth/Admin/AdminLoginForm/AdminLoginForm'

export default function AuthPage({ setUser }) {
  return (
    <main className={styles.AuthPage}>
      <h3 className={styles.toggleTitle}>Admin Login</h3>

      <div className={styles.formContainer}>
        <AdminLogin setUser={setUser} />
      </div>
    </main>
  );
}