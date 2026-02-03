import { Link } from 'react-router-dom'
import { ArrowLeft, RotateCcw, CheckCircle, AlertCircle } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Returns() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back link */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Tilbake</span>
          </Link>

          <h1 className="text-4xl font-bold mb-8">Retur og reklamasjon</h1>

          <div className="space-y-8">
            {/* Return policy */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <RotateCcw className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Kortversjonen</h2>
                  <p className="text-muted-foreground mb-4">
                    Stepper ferdig printet lages etter målene du oppgir. Derfor gjelder ikke angrerett på dette kjøpet 
                    (custom vare).
                  </p>
                  <div className="bg-surface-light rounded-xl p-4">
                    <p className="text-sm text-muted-foreground">
                      Men: Hvis vi har produsert feil, eller produktet har en mangel, har du selvfølgelig reklamasjonsrett.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* What can be returned */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-valid/10 rounded-xl flex items-center justify-center shrink-0">
                  <CheckCircle className="w-6 h-6 text-valid" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Angrerett</h2>
                  <div className="space-y-4 text-sm text-muted-foreground">
                    <div>
                      <h3 className="font-medium text-foreground mb-1">Stepper (ferdig printet – custom)</h3>
                      <p>
                        Stepper produseres på bestilling etter dine mål. Det betyr at angrerett (14 dager) ikke gjelder 
                        for denne typen varer.
                      </p>
                      <p className="mt-2">
                        Det vi står for: Hvis vi har produsert feil i forhold til spesifikasjonene du oppga, fikser vi det 
                        (se “Reklamasjon”).
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground mb-1">STL (digital fil)</h3>
                      <p>
                        STL leveres som digitalt innhold. Når du får filen levert umiddelbart etter betaling, bortfaller 
                        angreretten når du har samtykket til umiddelbar levering (dette gjøres i kassa med en checkbox).
                      </p>
                      <p className="mt-2">
                        Hvis filen er defekt/korrupt eller ikke matcher det du bestilte: ta kontakt, så ordner vi.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* What cannot be returned */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-destructive/10 rounded-xl flex items-center justify-center shrink-0">
                  <AlertCircle className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Avbestilling (for å være fair – uten returkaos)</h2>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>Du kan avbestille gratis innen 2 timer etter bestilling / før produksjon starter.</p>
                    <p>Etter at produksjon er startet, kan ordren ikke kanselleres.</p>
                    <p className="text-xs">
                      Retur (kun etter avtale): Siden Stepper er custom, tar vi ikke retur ved “angret kjøp”. Ved 
                      reklamasjon/feil avtaler vi retur eller løsning sammen.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Warranty */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4">Reklamasjon</h2>
              <p className="text-muted-foreground mb-4">
                Hvis Stepperen har en feil, eller ikke stemmer med det du bestilte, har du rett til å reklamere etter 
                forbrukerkjøpsloven.
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 mb-4">
                <li>Du har minst 2 år reklamasjonsrett.</li>
                <li>For produkter som er ment å vare vesentlig lenger enn 2 år, kan fristen være inntil 5 år.</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                Send e-post til{' '}
                <a href="mailto:hei@bsclimbing.no" className="text-primary hover:underline">hei@bsclimbing.no</a>
                {' '}med ordrenummer, bilder og kort beskrivelse av problemet, så svarer vi med neste steg.
              </p>
            </div>

            {/* Return address */}
            <div className="bg-surface-light rounded-2xl p-6 border border-border">
              <h3 className="font-semibold mb-2">Returadresse</h3>
              <address className="text-sm text-muted-foreground not-italic">
                BS Climbing<br />
                [Gateadresse]<br />
                [Postnummer] Oslo<br />
                Norge
              </address>
              <p className="text-xs text-muted-foreground mt-3">
                Ikke send retur før du har fått en bekreftelse fra oss.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Frakt ved reklamasjon: Hvis det er en feil/mangel, dekker vi returkostnad. Hvis produktet er som 
                bestilt, dekker du frakt selv. (Dette vurderes etter dialog.)
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
