export default function Login() {
  return (
    <div className="container py-5" style={{ maxWidth: '500px' }}>
      <h1 className="text-center mb-4">Login</h1>
      <form>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input type="email" className="form-control" id="email" required />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" required />
        </div>
        <button type="submit" className="btn btn-primary w-100">Accedi</button>
      </form>
    </div>
  )
}
