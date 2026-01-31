import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Personvern | BS Climbing Stepper',
  description: 'Personvernerklæring for BS Climbing',
}

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24 pb-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-8">
              Personvernerklæring
            </h1>
            
            <div className="prose prose-invert max-w-none">
              <div className="card mb-8">
                <p className="text-text-muted text-sm mb-6">
                  Sist oppdatert: Januar 2025
                </p>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">1. Behandlingsansvarlig</h2>
                  <p className="text-text-muted leading-relaxed">
                    BS Climbing er behandlingsansvarlig for personopplysninger 
                    som samles inn via denne nettsiden.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">2. Hvilke opplysninger samles inn</h2>
                  <p className="text-text-muted leading-relaxed mb-4">
                    Vi samler inn følgende opplysninger i forbindelse med kjøp:
                  </p>
                  <ul className="list-disc list-inside text-text-muted space-y-2">
                    <li>E-postadresse (for ordrebekreftelse og fil-levering)</li>
                    <li>Betalingsinformasjon (behandles av Stripe)</li>
                    <li>Leveringsadresse (kun ved valg av frakt)</li>
                    <li>Produktkonfigurasjon (mål på grep)</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">3. Formål med behandlingen</h2>
                  <p className="text-text-muted leading-relaxed mb-4">
                    Opplysningene brukes til å:
                  </p>
                  <ul className="list-disc list-inside text-text-muted space-y-2">
                    <li>Gjennomføre og levere bestillinger</li>
                    <li>Sende ordrebekreftelse og STL-fil</li>
                    <li>Håndtere kundeservice og support</li>
                    <li>Overholde lovpålagte krav (regnskap, etc.)</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">4. Rettslig grunnlag</h2>
                  <p className="text-text-muted leading-relaxed">
                    Behandlingen av personopplysninger er basert på:
                  </p>
                  <ul className="list-disc list-inside text-text-muted space-y-2 mt-4">
                    <li>Oppfyllelse av avtale (GDPR art. 6(1)(b))</li>
                    <li>Rettslig forpliktelse (GDPR art. 6(1)(c))</li>
                    <li>Berettiget interesse (GDPR art. 6(1)(f))</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">5. Deling av opplysninger</h2>
                  <p className="text-text-muted leading-relaxed mb-4">
                    Vi deler opplysninger med følgende tredjeparter:
                  </p>
                  <ul className="list-disc list-inside text-text-muted space-y-2">
                    <li><strong>Stripe</strong> – for betalingsbehandling</li>
                    <li><strong>E-posttjeneste</strong> – for ordrebekreftelser</li>
                  </ul>
                  <p className="text-text-muted leading-relaxed mt-4">
                    Vi selger aldri personopplysninger til tredjeparter.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">6. Lagring og sletting</h2>
                  <p className="text-text-muted leading-relaxed">
                    Personopplysninger lagres så lenge det er nødvendig for formålet 
                    de ble samlet inn for. Ordreinformasjon lagres i henhold til 
                    bokføringsloven (5 år). Du kan be om sletting av opplysninger 
                    som ikke er pålagt oppbevart.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">7. Dine rettigheter</h2>
                  <p className="text-text-muted leading-relaxed mb-4">
                    Du har rett til å:
                  </p>
                  <ul className="list-disc list-inside text-text-muted space-y-2">
                    <li>Be om innsyn i dine personopplysninger</li>
                    <li>Be om retting av uriktige opplysninger</li>
                    <li>Be om sletting ("retten til å bli glemt")</li>
                    <li>Protestere mot behandling</li>
                    <li>Be om dataportabilitet</li>
                    <li>Klage til Datatilsynet</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">8. Informasjonskapsler (cookies)</h2>
                  <p className="text-text-muted leading-relaxed">
                    Denne nettsiden bruker kun nødvendige informasjonskapsler for 
                    å håndtere betalingsprosessen via Stripe. Vi bruker ikke 
                    sporings- eller markedsføringskapsler.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">9. Sikkerhet</h2>
                  <p className="text-text-muted leading-relaxed">
                    Vi tar datasikkerhet på alvor. All kommunikasjon med nettsiden 
                    er kryptert (HTTPS), og betalingsinformasjon håndteres direkte 
                    av Stripe i henhold til PCI DSS-standarden.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-4">10. Kontakt</h2>
                  <p className="text-text-muted leading-relaxed">
                    For spørsmål om personvern, kontakt oss på:
                  </p>
                  <p className="mt-2">
                    <a 
                      href="mailto:hei@bsclimbing.no" 
                      className="text-primary hover:underline"
                    >
                      hei@bsclimbing.no
                    </a>
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
