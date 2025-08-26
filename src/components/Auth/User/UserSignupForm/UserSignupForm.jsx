import { useState } from 'react';
import { Link } from 'react-router-dom';
import { signUp } from '../../../../utilities/users-service';
import styles from './UserSignupForm.module.scss';

export default function UserSignUpForm({ setUser }) {
  const [formData, setFormData] = useState({
  name: '',
  email: '',
  password: '',
  role: 'user',
  profilePicture: '',  // new
  academicYear: '',
  major: '',
  age: '',
});

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const user = await signUp(formData);
      setUser(user);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        className={styles.input}
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
      />
      <input
        className={styles.input}
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        className={styles.input}
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
      />
      <input
        className={styles.input}
        name="profilePicture"
        value={formData.profilePicture}
        onChange={handleChange}
        placeholder="Profile Picture URL"
      />  
      <input
        className={styles.input}
        name="academicYear"
        value={formData.academicYear}
        onChange={handleChange}
        placeholder="Academic Year"
      />
      <input
        className={styles.input}
        name="major"
        value={formData.major}
        onChange={handleChange}
        placeholder="Major"
      />
      <input
        className={styles.input}
        name="age"
        value={formData.age}
        onChange={handleChange}
        placeholder="Age"
        type="number"
      />
      <button type="submit" className={styles.button}>Sign Up</button>
      <p className={styles.adminLink}>
        <Link to="/admin">Sign In as Admin</Link>
      </p>
    </form>
  );
}