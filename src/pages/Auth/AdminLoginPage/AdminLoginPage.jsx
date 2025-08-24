import { useState } from 'react';
import styles from './AuthPage.module.scss';
import LoginForm from '../../components/LoginForm/LoginForm';
import SignUpForm from '../../components/SignUpForm/SignUpForm';

export default function AuthPage({ setUser }) {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <main className={styles.AuthPage}>
      <h3
        className={styles.toggleTitle}
        onClick={() => setShowLogin(!showLogin)}
      >
        {showLogin ? 'SIGN UP' : 'LOG IN'}
      </h3>

      <div className={styles.formContainer}>
        {showLogin ? <LoginForm setUser={setUser} /> : <SignUpForm setUser={setUser} />}
      </div>
    </main>
  );
}
