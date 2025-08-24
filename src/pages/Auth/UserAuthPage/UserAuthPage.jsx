import { useState } from 'react';
import styles from './UserAuthPage.module.scss';
import UserLoginForm from '../../../components/Auth/User/UserLoginForm/UserLoginForm'
import UserSignupForm from '../../../components/Auth/User/UserSignupForm/UserSignupForm'

export default function AuthPage({ setUser }) {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <main className={styles.AuthPage}>
      <h3
        className={styles.toggleTitle}
        onClick={() => setShowLogin(!showLogin)}
      >
        {showLogin ? 'USER SIGN UP' : 'USER LOG IN'}
      </h3>

      <div className={styles.formContainer}>
        {showLogin ? <UserLoginForm setUser={setUser} /> : <UserSignupForm setUser={setUser} />}
      </div>
    </main>
  );
}
