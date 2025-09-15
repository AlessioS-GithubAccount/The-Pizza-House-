import styles from '../styles/Footer.module.css';

export default function Footer() {
  return (
    <footer className={`container-fluid position-relative py-5 text-white ${styles.footerRoot} ${styles.videoBackground}`} style={{ overflow: 'hidden' }}>
      <video
        className={`position-absolute top-0 start-0 w-100 h-100 ${styles.backgroundVideo2}`}
        autoPlay
        loop
        muted
        playsInline
        // Consiglio: rinomina il file per evitare spazi, oppure usa %20 negli spazi
        // src="/images/pizza%20video-background%20map.mp4"
      >
        <source src="/images/pizza video-background map.mp4" type="video/mp4" />
      </video>

      <div className="row g-4">
        <section className={`col-12 col-md-6 ${styles.whereWeAre}`}>
          <h2 className={styles.footerSectionTitle}>Dove Siamo</h2>
          <iframe
            title="OpenStreetMap"
            className={`w-100 rounded shadow ${styles.mapAdress}`}
            height="280"
            src="https://www.openstreetmap.org/export/embed.html?bbox=8.442993164062502%2C44.8366389116501%2C8.764343261718752%2C44.99709652176981&layer=mapnik"
            style={{ border: '1px solid rgba(255,255,255,0.6)' }}
          />
          <div className="mt-2">
            <a className="link-light" href="https://www.openstreetmap.org/#map=12/44.9169/8.6037" target="_blank" rel="noreferrer">
              Visualizza mappa ingrandita
            </a>
          </div>
        </section>

        <section className={`col-12 col-md-6 ${styles.whereWeAre}`}>
          <h2 className={styles.footerSectionTitle}>Credits</h2>
          <ul>
            <li><p>Author: Frontend development and design by Alessio Sanna</p></li>
          </ul>
        </section>
      </div>

      <div className={`${styles.buttonbarSocial} ${styles.therealfooter} mt-4`}>
        <ul className={styles.socialIcons}>
          <li><a href="https://www.facebook.com/" target="_blank" rel="noreferrer"><i className="fab fa-facebook"></i></a></li>
          <li><a href="mailto:thepizzahouse@gmail.com"><i className="fa fa-envelope"></i></a></li>
          <li><a href="https://www.instagram.com/" target="_blank" rel="noreferrer"><i className="fab fa-instagram"></i></a></li>
          <li><a href="https://wa.me/1234567890" target="_blank" rel="noreferrer"><i className="fab fa-whatsapp"></i></a></li>
        </ul>
      </div>
    </footer>
  );
}
