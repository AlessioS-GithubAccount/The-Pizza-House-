import { useState } from 'react';
import { api } from '../lib/api';

export default function Register() {
  const [full_name, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await api('/api/auth/register', {
        method: 'POST',
        body: { full_name, email, password, phone }
      });
      localStorage.setItem('token', data.token);
      window.location.href = '/'; // reindirizza dopo registrazione
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container py-5" style={{ maxWidth: 520 }}>
      <h1 className="text-center mb-4">Crea account</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nome e Cognome</label>
          <input className="form-control" value={full_name}
                 onChange={e => setFullName(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" value={email}
                 onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Telefono (opzionale)</label>
          <input className="form-control" value={phone}
                 onChange={e => setPhone(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" value={password}
                 onChange={e => setPassword(e.target.value)} required minLength={8}/>
        </div>
        <button type="submit" className="btn btn-warning w-100" disabled={loading}>
          {loading ? 'Registrazione…' : 'Registrati'}
        </button>
      </form>
    </div>
  );
}
