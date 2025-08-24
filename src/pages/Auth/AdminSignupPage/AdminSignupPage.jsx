import { useState } from 'react';
import styles from './AdminSignupPage.module.scss';
import AdminSignup from '../../../components/Auth/Admin/AdminSignupForm/AdminSignupForm'

export default function AuthPage({ setUser }) {
  return (
    <main className={styles.AuthPage}>
      <h3 className={styles.toggleTitle}>Admin Sign Up</h3>

      <div className={styles.formContainer}>
        <AdminSignup setUser={setUser} />
      </div>
    </main>
  );
}