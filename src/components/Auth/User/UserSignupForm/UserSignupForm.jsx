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
    profilePicture: '',
    academicYear: '',
    major: '',
    age: '',
  });

  const [error, setError] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    // Check if all fields are filled
    const missingFields = Object.entries(formData)
      .filter(([key, value]) => value === '')
      .map(([key]) => key);

    if (missingFields.length > 0) {
      setError(`Please fill in all fields: ${missingFields.join(', ')}`);
      return;
    }

    try {
      const user = await signUp(formData);
      setUser(user);
    } catch (err) {
      console.error(err);
      setError('Sign up failed. Please try again.');
    }
  }

  // Check if form is complete
  const isFormComplete = Object.values(formData).every((v) => v !== '');

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
        type="number"
        value={formData.age}
        onChange={handleChange}
        placeholder="Age"
      />

      {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}

      <button type="submit" className={styles.button} disabled={!isFormComplete}>
        Sign Up
      </button>

    </form>
  );
}
