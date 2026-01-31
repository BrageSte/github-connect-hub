import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Vilkår | BS Climbing Stepper',
  description: 'Vilkår og betingelser for kjøp av Stepper fra BS Climbing',
}

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24 pb-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-8">
              Vilkår og betingelser
            </h1>
            
            <div className="prose prose-invert max-w-none">
              <div className="card mb-8">
                <p className="text-text-muted text-sm mb-6">
                  Sist oppdatert: Januar 2025
                </p>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">1. Generelt</h2>
                  <p className="text-text-muted leading-relaxed">
                    Disse vilkårene gjelder for alle kjøp av Stepper-produkter fra BS Climbing. 
                    Ved å gjennomføre et kjøp aksepterer du disse vilkårene i sin helhet.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">2. Produktet</h2>
                  <p className="text-text-muted leading-relaxed mb-4">
                    Stepper er et digitalt produkt (STL-fil) for 3D-printing av en custom 
                    crimp/hangboard-blokk. Produktet leveres som en nedlastbar fil.
                  </p>
                  <ul className="list-disc list-inside text-text-muted space-y-2">
                    <li>Filen er optimalisert for FDM-printing</li>
                    <li>Toleranse: ±0.3mm (standard for FDM)</li>
                    <li>Filformat: STL</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">3. Lisens og bruksrett</h2>
                  <p className="text-text-muted leading-relaxed mb-4">
                    Ved kjøp får du en ikke-eksklusiv, ikke-overførbar lisens til å:
                  </p>
                  <ul className="list-disc list-inside text-text-muted space-y-2 mb-4">
                    <li>3D-printe Stepper for personlig, privat bruk</li>
                    <li>Printe kopier til eget bruk</li>
                  </ul>
                  <p className="text-text-muted leading-relaxed mb-4">
                    Du har <strong>ikke</strong> rett til å:
                  </p>
                  <ul className="list-disc list-inside text-text-muted space-y-2">
                    <li>Videreselge eller distribuere STL-filen</li>
                    <li>Bruke designet kommersielt</li>
                    <li>Modifisere og redistribuere filen</li>
                    <li>Dele filen med tredjeparter</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">4. Betaling</h2>
                  <p className="text-text-muted leading-relaxed">
                    Betaling håndteres sikkert via Stripe. Vi aksepterer de fleste 
                    betalingskort. Alle priser er oppgitt i NOK og inkluderer MVA.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">5. Levering</h2>
                  <p className="text-text-muted leading-relaxed">
                    STL-filen sendes til din e-post umiddelbart etter godkjent betaling. 
                    Tau for montering kan hentes gratis hos våre samarbeidspartnere i Oslo.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">6. Angrerett</h2>
                  <p className="text-text-muted leading-relaxed">
                    I henhold til angrerettloven § 22 bokstav n, gjelder ikke angrerett 
                    for digitale produkter når leveringen har begynt med forbrukerens 
                    uttrykkelige forhåndssamtykke, og forbrukeren har erkjent at 
                    angreretten dermed går tapt.
                  </p>
                  <p className="text-text-muted leading-relaxed mt-4">
                    Ved å fullføre kjøpet samtykker du til at filen leveres umiddelbart, 
                    og at angreretten faller bort ved nedlasting.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">7. Ansvarsbegrensning</h2>
                  <p className="text-text-muted leading-relaxed">
                    BS Climbing er ikke ansvarlig for skader som måtte oppstå ved bruk 
                    av produktet. Brukeren er selv ansvarlig for å sikre at produktet 
                    er trygt montert og egnet for tiltenkt bruk.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">8. Reklamasjon</h2>
                  <p className="text-text-muted leading-relaxed">
                    Dersom STL-filen ikke kan åpnes eller er korrupt, kontakt oss 
                    innen 14 dager på hei@bsclimbing.no. Vi vil da sende en ny fil 
                    eller refundere kjøpet.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-4">9. Kontakt</h2>
                  <p className="text-text-muted leading-relaxed">
                    For spørsmål om disse vilkårene, kontakt oss på:
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
