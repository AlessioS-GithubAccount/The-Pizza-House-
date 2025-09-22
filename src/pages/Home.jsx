// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import styles from '../styles/home.module.css';

export default function Home() {
  const [entered, setEntered] = useState(false);

  // Refs per le sezioni che devono animarsi on scroll
  const bioRef = useRef(null);
  const recipeRef = useRef(null);
  const orariRef = useRef(null);

  useEffect(() => {
    // micro-delay per assicurare lo stato iniziale prima dell'animazione HERO
    const id = setTimeout(() => setEntered(true), 10);
    return () => clearTimeout(id);
  }, []);

  // IntersectionObserver riutilizzabile per più sezioni
  useEffect(() => {
    const attachRevealObserver = (root) => {
      if (!root) return () => {};
      const targets = root.querySelectorAll('[data-reveal]');
      // reset iniziale (utile se si torna sulla pagina via router)
      targets.forEach((el) => el.removeAttribute('data-inview'));

      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.setAttribute('data-inview', 'true');
              io.unobserve(entry.target); // anima una volta sola
            }
          });
        },
        { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
      );

      targets.forEach((el) => io.observe(el));
      return () => io.disconnect();
    };

    const cleanBio = attachRevealObserver(bioRef.current);
    const cleanRecipe = attachRevealObserver(recipeRef.current);
    const cleanOrari = attachRevealObserver(orariRef.current);
    return () => {
      cleanBio && cleanBio();
      cleanRecipe && cleanRecipe();
      cleanOrari && cleanOrari();
    };
  }, []);

  return (
    <>
      {/* HERO */}
      <header className={`position-relative ${styles.header}`}>
        <video
          className={`position-absolute top-0 start-0 w-100 h-100 ${styles.backgroundVideo} ${
            entered ? styles.videoFadeIn : styles.videoFadeInit
          }`}
          autoPlay
          loop
          muted
          playsInline
          style={{ objectFit: 'cover' }}
        >
          <source src="/images/production_id_4457933 (2160p).mp4" type="video/mp4" />
        </video>

        <div
          className={`position-absolute top-0 start-0 w-100 h-100 ${
            entered ? styles.overlayFadeIn : styles.overlayFadeInit
          }`}
          style={{ background: 'rgba(0,0,0,0.35)' }}
        />

        {/* Container testi: centrato orizzontalmente */}
        <div
          className="container text-white d-flex flex-column justify-content-center align-items-center text-center"
          style={{ minHeight: '90vh' }}
        >
          <h1
            className={`display-3 fw-bold ${styles.headerTitle} ${
              entered ? styles.fadeUpIn : styles.fadeUpInit
            }`}
          >
            The Pizza House
          </h1>
          <p
            className={`lead ${styles.headerSubtitle} ${
              entered ? styles.fadeUpInDelay : styles.fadeUpInit
            }`}
          >
            Real Italian Experience
          </p>
        </div>
      </header>

      {/* BIO */}
      <main className="container containerSmartphon">
        <section className="py-4" ref={bioRef}>
          <div className={styles.logoBioClass} data-reveal="fade">
            <img
              className={styles.logoBio}
              src="/images/pizza-logo-E6DE845BD3-seeklogo.com.png"
              alt="Logo"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div
            className={`d-block mx-auto ${styles.separator} ${styles.mbBio} ${styles.d200}`}
            data-reveal="bar"
          />

          <h1
            className={`text-center ${styles.distanceTitle} ${styles.d300}`}
            data-reveal="fade"
          >
            Benvenuto
          </h1>

          <h3
            className={`text-center ${styles.d400}`}
            data-reveal="fade"
          >
            Ti andrebbe una fetta di pizza ??
          </h3>

          <h5
            className={`text-center d-block mx-auto ${styles.distanceTitle} ${styles.d500}`}
            style={{ width: '100%', maxWidth: '800px' }}
            data-reveal="fade"
          >
            Esplora il mondo del gusto al The Pizza House! Concediti le nostre deliziose pizze,
            i primi piatti ricchi di sapore e i dessert, a casa tua o nel nostro locale.
          </h5>

          {/* Link con aspetto di bottone */}
          <div className={`text-center mt-4 ${styles.d600}`} data-reveal="pop">
            <Link to="/register" className={`${styles.registerbtn} btn btn-lg`} role="button">
              Diventa nostro cliente!
            </Link>
          </div>

          <div className={styles.alignBio}></div>
        </section>

        {/* RICETTA / IMMAGINI */}
        <div className={`container ${styles.mbBio2}`}>
          <div className={`d-block mx-auto ${styles.separator}`}></div>
          <h2 className={styles.titleBio}>La nostra storia.</h2>
        </div>

        <section className={styles.containerRicetta} ref={recipeRef}>
          <div className="container text-center">
            <div className={styles.glass} data-reveal="fade">
              <div className="row">
                <div className="col">
                  <h4 className={`${styles.titleRecipe1} ${styles.d100}`} data-reveal="fade">
                    La nostra pizza segue la ricetta della tradizione.
                  </h4>
                  <p className={`text-center ${styles.narrow80} ${styles.d200}`} data-reveal="fade">
                    Impasto semplice e materie prime davvero selezionate: partiamo da miscele di grani scelti e farine di qualità (tipo 0, 1 e una quota integrale), macinate lentamente per conservare profumi e nutrienti, con un tocco di semola rimacinata per dare sostegno e croccantezza. L’impasto nasce da pochi ingredienti puliti — acqua, farina, sale — e dal nostro lievito madre tramandato e rinfrescato ogni giorno: lunghe maturazioni a temperatura controllata lo rendono leggero, digeribile e naturalmente aromatico. I pomodori sono locali e, quando possibile, di stagione; li trattiamo con rispetto per preservarne dolcezza e acidità. Usiamo olio extravergine italiano equilibrato, latticini freschi e verdure raccolte di giornata, oltre a salumi selezionati da piccoli produttori del territorio. Ogni base è stesa a mano e cotta nel forno a legna fino a ottenere un cornicione alveolato e un cuore morbido. Così portiamo in tavola la vera tradizione italiana: ingredienti vicini, filiera corta e tempi naturali, per momenti indimenticabili di gusto e convivialità.
                  </p>
                </div>

                <div className="col">
                  <video
                    className={`${styles.farine} ${styles.glassMedia} ${styles.d300}`}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    style={{ display: 'block' }}
                    data-reveal="fade"
                  >
                    <source src="/video/videoGrano.mp4" type="video/mp4" />
                    Il tuo browser non supporta il video HTML5.
                  </video>
                </div>

                <div className={`container text-center ${styles.mt4vh}`}>
                  <div className="row">
                    <div className="col">
                      <video
                        className={`${styles.pizzeriaImg} ${styles.glassMedia} d-block mx-auto ${styles.d100}`}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        style={{ display: 'block' }}
                        data-reveal="fade"
                      >
                        <source src="/video/videoPizzaHouse.mp4" type="video/mp4" />
                        Il tuo browser non supporta il video HTML5.
                      </video>
                    </div>

                    <div className={`col ${styles.titleRecipe1}`}>
                      <h4 className={`${styles.titleRecipe1} ${styles.d200}`} data-reveal="fade">
                        Mangi da noi o te la portiamo a casa come appena sfornata.
                      </h4>
                      <p className={styles.d300} data-reveal="fade">
                        Impacchettiamo in scatole ventilate e borse termiche che mantengono il calore e proteggono la croccantezza del cornicione, così quando apri il cartone senti ancora il profumo del legno e del pomodoro. Se preferisci l’asporto, prepariamo il tutto all’ultimo minuto per ridurre i tempi d’attesa e consegniamo con cura perché la pizza arrivi asciutta, fragrante e filante al primo taglio. In locale troverai un servizio attento, tempi giusti tra una portata e l’altra e piccoli gesti — olio evo aromatizzato, pepe macinato al momento, suggerimenti di abbinamento — che rendono la pausa davvero speciale.

Da oltre 35 anni cuciniamo primi tirati al mattarello, risotti mantecati al punto, e secondi di carne o di pesce selezionati ogni giorno: tagli marinati e cotture lente per esaltare la morbidezza, pescato del giorno scottato in padella, contorni di verdure di stagione e insalate croccanti. La nostra cantina abbina alla tradizione una selezione di birre artigianali (lager pulite, IPA profumate, blanche fresche) e una carta di vini con etichette DOC/DOCG e piccoli produttori locali; se vuoi, ti guidiamo nell’abbinamento perfetto con impasti, sughi e topping. L’atmosfera è elegante ma informale: luci calde, legno e pietra, musica di sottofondo, tavoli ben distanziati per cene intime, serate tra amici e momenti in famiglia. Il personale è accogliente e preparato, attento a intolleranze e preferenze: proponiamo anche opzioni vegetariane/vegane e, su richiesta, impasti a ridotto contenuto di glutine. Che tu scelga il tavolo o il divano di casa, puntiamo a darti la stessa qualità, lo stesso sorriso e la stessa sensazione: quella di una pizza fatta con ingredienti freschi e locali, servita — ovunque tu sia — come appena sfornata.
                      </p>
                    </div>
                  </div>
                </div>
              </div>{/* row */}
            </div>{/* glass */}
          </div>{/* container */}
        </section>
      </main>

      {/* ORARI con CAROSELLO */}
      <div className={styles.containerOrari} ref={orariRef}>
        {/* Carosello immagini di sfondo */}
        <div className={styles.orariCarousel} aria-hidden="true">
          <img
            className={`${styles.slide} ${styles.s1}`}
            src="/images/Menù-Pizzeria_Bianco-e-Nero-2-1024x731.jpg"
            alt=""
            loading="lazy"
            decoding="async"
          />
          <img
            className={`${styles.slide} ${styles.s2}`}
            src="/images/farine.jpg"
            alt=""
            loading="lazy"
            decoding="async"
          />
          <img
            className={`${styles.slide} ${styles.s3}`}
            src="/images/pizzeria-country-chic-683x1024.jpg"
            alt=""
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* Overlay scuro già in CSS via ::after */}

        <div className={styles.tabOrari}>
          <h1 className={styles.d100} data-reveal="fade">Aperto tutti i giorni</h1>
          <h5 className={styles.d200} data-reveal="fade">Pranzo : 12.00 - 15.00</h5>
          <h5 className={styles.d300} data-reveal="fade">Cena : 19.00 - 24.00</h5>
          <h4 className={styles.d400} data-reveal="fade">
            <i className="fab fa-whatsapp" /> Telefono: +39 346 99 65 3521
          </h4>
        </div>
      </div>
    </>
  );
}
