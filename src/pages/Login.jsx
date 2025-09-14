import { Link } from 'react-router-dom'

export default function Login() {
  return (
    <div className="container py-5" style={{ maxWidth: '500px' }}>
      <h1 className="text-center mb-4">Accedi</h1>

      <form>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input type="email" className="form-control" id="email" required />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" required />
        </div>

        <button type="submit" className="btn btn-primary w-100 mb-3">Accedi</button>

        <p className="text-center">Non sei ancora registrato? Clicca qui sotto</p>

        {/* ✅ Bottone registrazione centrato */}
        <div className="text-center">
          <Link
            to="/register"
            className="btn btn-outline-primary px-4"
          >
            Registrati ora
          </Link>
        </div>
      </form>
    </div>
  )
}
