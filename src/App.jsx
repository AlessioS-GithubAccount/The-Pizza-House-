import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Menu from './pages/Menu.jsx'
import Order from './pages/Order.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 30 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/ordina" element={<Order />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
