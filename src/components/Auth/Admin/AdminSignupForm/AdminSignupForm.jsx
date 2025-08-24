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
    });

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
            <input className={styles.input} name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
            <input className={styles.input} name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
            <input className={styles.input} type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" />
            <button type="submit" className={styles.button}>Sign Up</button>
            <p>
                <p>Already Have an Account?<Link to="/admin/login">Login as Admin</Link></p>
                <Link to="/user">User</Link>
            </p>
        </form>
    );
}