export default function Home() {
  return (
    <>
      {/* HERO */}
      <header className="position-relative" >
        <video id="background-video" autoPlay loop muted playsInline
               poster="/images/10372997_4464061.jpg"
               className="position-absolute top-0 start-0 w-100 h-100"
               style={{ objectFit: 'cover' }}>
          <source src="/images/production_id_4457933 (2160p).mp4" type="video/mp4" />
        </video>
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'rgba(0,0,0,0.35)' }} />
        <div className="container position-relative text-white d-flex flex-column justify-content-center align-items-start" style={{ minHeight: '90vh' }}>
          <h1 className="display-3 fw-bold">The Pizza House</h1>
          <p className="lead">Real Italian Experience</p>
        </div>
      </header>

      {/* BIO */}
      <main className="container containerSmartphon">
        
        <section className="bio py-4">
          <div className="LogoBioClass">
            <img id="LogoBio" src="/images/pizza-logo-E6DE845BD3-seeklogo.com.png" alt="Logo" />
          </div>
          <div className="separator mbBio" />
          <h1 className="text-center">Benvenuto</h1>
          <h3 className="text-center">Ti andrebbe una fetta di pizza ??</h3>
          <p className="text-center mx-auto" style={{ maxWidth: '800px' }}>
            Esplora il mondo del gusto al The Pizza House! Concediti le nostre deliziose pizze,
            i primi piatti ricchi di sapore e i dessert, a casa tua o nel nostro locale.
          </p>

          {/* Nuovo bottone Registrazione */}
        <div className="text-center mt-4">
        <button
            type="button"
            className="registerbtn btn btn-warning btn-lg shadow"
               onClick={() => alert('Funzione registrazione in arrivo!')}
        >
            Diventa nostro cliente!
        </button>
        </div>
        

          <div className="alignBio">
                      <div className="separator mbBio2" />

            <h2 className="titleBio">La nostra storia.</h2>
            <img id="imgbw" src="/images/photoB&W.jpg" alt="Storia" />
            <p>
              Tradizione italiana, ingredienti freschi e forno a legna per momenti
              indimenticabili di gusto e convivialità.
            </p>
          </div>
        </section>

        {/* RICETTA / IMMAGINI */}
        <section className="containerRicetta">
          <div className="container text-center">
            <div className="row">
              <div className="col">
                <h4>La nostra pizza segue la ricetta della tradizione.</h4>
                <p>
                  Impasto semplice e materie prime selezionate; lievito madre tramandato; pomodori locali:
                  il risultato è un gusto autentico.
                </p>
              </div>
              <div className="col">
                <img id="farine" src="/images/farine.jpg" alt="Farine" />
              </div>

              <div className="container text-center">
                <div className="row">
                  <div className="col">
                    <img id="pizzeriaImg" src="/images/pizzeria-country-chic-683x1024.jpg" alt="Locale" />
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
      <div id="containerOrari">
        <div id="tabOrari">
          <h1>Aperto tutti i giorni</h1>
          <h5>Pranzo : 12.00 - 15.00</h5>
          <h5>Cena  : 19.00 - 24.00</h5>
          <h4><i className="fab fa-whatsapp"></i> Telefono: +39 346 99 65 3521</h4>
        </div>
      </div>
    </>
  )
}
