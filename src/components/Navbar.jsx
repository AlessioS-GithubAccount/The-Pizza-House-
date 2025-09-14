import { NavLink, Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <img id="logoPage" src="/images/pizza-logo-E6DE845BD3-seeklogo.com.png" alt="Logo" width="64" height="auto" />
          <span className="ms-2">THE PIZZA HOUSE</span>
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="nav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><NavLink to="/menu" className="nav-link">Menu</NavLink></li>
            <li className="nav-item"><NavLink to="/ordina" className="nav-link">Ordina</NavLink></li>
            <li className="nav-item"><a className="nav-link" href="#therealfooter">Contatti</a></li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
