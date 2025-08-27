import { useState } from 'react';
import { Link } from 'react-router-dom';
import { signUp } from '../../../../utilities/users-service';
import styles from './AdminSignupForm.module.scss';

export default function SignUpForm({ setUser }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'admin',
        profilePicture: '',
        adminCampus: '',
        adminOfficeHours: '',
    });

    const [error, setError] = useState('');

    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
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

    const isFormComplete = Object.values(formData).every(v => v !== '');

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
                name="adminOfficeHours"
                value={formData.adminOfficeHours}
                onChange={handleChange}
                placeholder="Office Hours (e.g. 9am-5pm)"
            />

            <div className={styles.campusGroup} role="radiogroup" aria-label="Admin campus">
                <span
                    className={styles.slider}
                    data-pos={formData.adminCampus === 'B' ? 'right' : 'left'}
                />
                <input
                    id="campusA"
                    type="radio"
                    name="adminCampus"
                    value="A"
                    checked={formData.adminCampus === 'A'}
                    onChange={handleChange}
                />
                <label htmlFor="campusA">Campus A</label>
                <input
                    id="campusB"
                    type="radio"
                    name="adminCampus"
                    value="B"
                    checked={formData.adminCampus === 'B'}
                    onChange={handleChange}
                />
                <label htmlFor="campusB">Campus B</label>
            </div>


            {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}

            <button type="submit" className={styles.button} disabled={!isFormComplete}>
                Sign Up
            </button>
            <div className={styles.adminLink}>
                <p>Already Have an Account?
                    <Link to="/admin/login"> Login as Admin</Link>
                </p>

                <p>
                    <Link to="/user">User</Link>
                </p>
            </div>

        </form>
    );
}