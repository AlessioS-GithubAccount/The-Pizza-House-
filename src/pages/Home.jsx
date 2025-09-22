import { Link } from 'react-router-dom';
import styles from '../styles/home.module.css';

export default function Home() {
  return (
    <>
      {/* HERO */}
      <header className={`position-relative ${styles.header}`}>
        <video
          className={`position-absolute top-0 start-0 w-100 h-100 ${styles.backgroundVideo}`}
          autoPlay
          loop
          muted
          playsInline
          style={{ objectFit: 'cover' }}
        >
          <source src="/images/production_id_4457933 (2160p).mp4" type="video/mp4" />
        </video>

        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ background: 'rgba(0,0,0,0.35)' }}
        />

        <div className="container position-relative text-white d-flex flex-column justify-content-center align-items-start" style={{ minHeight: '90vh' }}>
          <h1 className={`display-3 fw-bold ${styles.headerTitle}`}>The Pizza House</h1>
          <p className={`lead ${styles.headerSubtitle}`}>Real Italian Experience</p>
        </div>
      </header>

      {/* BIO */}
      <main className="container containerSmartphon">
        <section className="py-4">
          <div className={styles.logoBioClass}>
            <img className={styles.logoBio} src="/images/pizza-logo-E6DE845BD3-seeklogo.com.png" alt="Logo" />
          </div>

          <div className={`${styles.separator} ${styles.mbBio}`} />

          <h1 className="text-center">Benvenuto</h1>
          <h3 className="text-center">Ti andrebbe una fetta di pizza ??</h3>
          <p className="text-center mx-auto" style={{ maxWidth: '800px' }}>
            Esplora il mondo del gusto al The Pizza House! Concediti le nostre deliziose pizze,
            i primi piatti ricchi di sapore e i dessert, a casa tua o nel nostro locale.
          </p>

          {/* Link con aspetto di bottone */}
          <div className="text-center mt-4">
            <Link
              to="/register"
              className={`${styles.registerbtn} btn btn-lg `}
              role="button"
            >
              Diventa nostro cliente!
            </Link>
          </div>

          <div className={styles.alignBio}>
            <div className={`${styles.separator} ${styles.mbBio2}`} />
            <h2 className={styles.titleBio}>La nostra storia.</h2>

            {/* CARD VIDEO con bordo gradiente */}
            <div className={`${styles.videoCard} mx-auto`}>
              <div className={styles.videoBorder}>
                <div className={`${styles.videoCardInner} ${styles.aspect169}`}>
                  <img
                    className={styles.videoCardMedia}
                    src="/images/loopPizza.gif"
                    alt="Loop pizza"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RICETTA / IMMAGINI */}
        <section className={styles.containerRicetta}>
          <div className="container text-center">
            <div className="row">
              <div className="col">
                <h4>La nostra pizza segue la ricetta della tradizione.</h4>
                <p>
                  Impasto semplice e materie prime selezionate; lievito madre tramandato; pomodori locali:
                  il risultato è un gusto autentico. Tradizione italiana, ingredienti freschi e forno a legna
                  per momenti indimenticabili di gusto e convivialità.
                </p>
              </div>
              <div className="col">
                <img className={styles.farine} src="/images/farine.jpg" alt="Farine" />
              </div>

              <div className="container text-center">
                <div className="row">
                  <div className="col">
                    <img className={styles.pizzeriaImg} src="/images/pizzeria-country-chic-683x1024.jpg" alt="Locale" />
                  </div>
                  <div className="col">
                    <h4>Mangi da noi o te la portiamo a casa come appena sfornata.</h4>
                    <p>
                      Da oltre 35 anni, primi e secondi di carne o pesce, birre e vini selezionati.
                      Location elegante e personale accogliente.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      {/* ORARI */}
      <div className={styles.containerOrari}>
        <div className={styles.tabOrari}>
          <h1>Aperto tutti i giorni</h1>
          <h5>Pranzo : 12.00 - 15.00</h5>
          <h5>Cena  : 19.00 - 24.00</h5>
          <h4><i className="fab fa-whatsapp"></i> Telefono: +39 346 99 65 3521</h4>
        </div>
      </div>
    </>
  );
}
