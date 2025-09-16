import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Menu from './pages/Menu.jsx'
import Order from './pages/Order.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import ScrollToTop from './ScrollToTop.jsx'

export default function App() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 30 }}>
        <ScrollToTop />  
        <Routes>          
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/ordina" element={<Order />} />
          <Route path="/register" element={<Register />} /> 
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
