// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { saveAuth } from '../lib/auth';
import styles from '../styles/login.module.css';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await api('/api/auth/login', {
        method: 'POST',
        body: { email: email.trim(), password }
      });
      // data = { token, user }
      if (!data?.token || !data?.user) {
        throw new Error('Risposta non valida dal server');
      }

      // Salva auth nel localStorage e notifica la UI (Navbar)
      saveAuth({ token: data.token, user: data.user });

      // Naviga in home (SPA)
      navigate('/');
    } catch (err) {
      const msg =
        err?.message ||
        (typeof err === 'string' ? err : 'Errore di accesso, riprova.');
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.loginPage}>
      <h1 className={styles.loginTitle}>Accedi</h1>
      {error && <div className={styles.errorAlert}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        <button
          type="submit"
          className={`btn btn-warning w-100 ${styles.submitBtn}`}
          disabled={loading}
        >
          {loading ? 'Accesso…' : 'Accedi'}
        </button>

        <p className={styles.registerLink}>
          Non hai un account? <Link to="/register">Registrati</Link>
        </p>
      </form>
    </div>
  );
}
