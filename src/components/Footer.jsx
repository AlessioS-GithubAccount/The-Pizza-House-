export default function Footer() {
  return (
    <footer className="container-fluid position-relative py-5 text-white videoBackground" style={{ overflow: 'hidden' }}>
      <video id="background-video2" autoPlay loop muted playsInline
             className="position-absolute top-0 start-0 w-100 h-100"
             style={{ objectFit: 'cover', zIndex: -1 }}>
        <source src="/images/pizza video-background map.mp4" type="video/mp4" />
      </video>

      <div className="row g-4">
        <section className="where-we-are col-12 col-md-6">
          <h2 className="footer-section-title">Dove Siamo</h2>
          <iframe id="mapAdress" title="OpenStreetMap" className="w-100 rounded shadow" height="280"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=8.442993164062502%2C44.8366389116501%2C8.764343261718752%2C44.99709652176981&layer=mapnik"
                  style={{ border: '1px solid rgba(255,255,255,0.6)' }} />
          <div className="mt-2">
            <a className="link-light" href="https://www.openstreetmap.org/#map=12/44.9169/8.6037" target="_blank" rel="noreferrer">
              Visualizza mappa ingrandita
            </a>
          </div>
        </section>

        <section className="where-we-are col-12 col-md-6">
          <h2 className="footer-section-title">Credits</h2>
          <ul>
            <li><p>Author: Frontend development and design by Alessio Sanna</p></li>
          </ul>
        </section>
      </div>

      <div id="therealfooter" className="buttonbar-social mt-4">
        <ul className="social-icons">
          <li><a href="https://www.facebook.com/" target="_blank" rel="noreferrer"><i className="fab fa-facebook"></i></a></li>
          <li><a href="mailto:thepizzahouse@gmail.com"><i className="fa fa-envelope"></i></a></li>
          <li><a href="https://www.instagram.com/" target="_blank" rel="noreferrer"><i className="fab fa-instagram"></i></a></li>
          <li><a href="https://wa.me/1234567890" target="_blank" rel="noreferrer"><i className="fab fa-whatsapp"></i></a></li>
        </ul>
      </div>
    </footer>
  )
}
