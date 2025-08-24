import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './UserLoginForm.module.scss';
import { login } from '../../../../utilities/users-service';

export default function LoginForm({ setUser }) {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(credentials);
      setUser(user);
    } catch {
      setError('Invalid credentials');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        type="email"
        name="email"
        placeholder="Email"
        value={credentials.email}
        onChange={handleChange}
        required
      />
      <input
        className={styles.input}
        type="password"
        name="password"
        placeholder="Password"
        value={credentials.password}
        onChange={handleChange}
        required
      />
      {error && <div className={styles.error}>{error}</div>}
      <button type="submit" className={styles.button}>Log In</button>
      <p className={styles.adminLink}>
        <Link to="/admin/login">Admin</Link>
      </p>
    </form>
    
  );
}
