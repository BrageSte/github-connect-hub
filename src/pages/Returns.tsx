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
                  <h2 className="text-xl font-semibold mb-2">14 dagers åpent kjøp</h2>
                  <p className="text-muted-foreground mb-4">
                    I henhold til angrerettloven har du rett til å returnere varen innen 14 dager 
                    etter at du mottok den, uten å oppgi grunn.
                  </p>
                  <div className="bg-surface-light rounded-xl p-4">
                    <h3 className="font-medium mb-2">For å benytte angreretten:</h3>
                    <ol className="text-sm text-muted-foreground space-y-2">
                      <li>1. Send e-post til hei@bsclimbing.no med ordrenummer</li>
                      <li>2. Du får en bekreftelse og returadresse</li>
                      <li>3. Send varen tilbake i original emballasje</li>
                      <li>4. Pengene refunderes innen 14 dager etter vi mottar varen</li>
                    </ol>
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
                  <h2 className="text-xl font-semibold mb-2">Hva kan returneres</h2>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-valid rounded-full" />
                      <span className="text-foreground">Fysiske produkter i uåpnet/ubrukt stand</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-valid rounded-full" />
                      <span className="text-foreground">Produkter med produksjonsfeil</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-valid rounded-full" />
                      <span className="text-foreground">Produkter som avviker fra bestillingen</span>
                    </li>
                  </ul>
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
                  <h2 className="text-xl font-semibold mb-2">Unntak fra angreretten</h2>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-destructive rounded-full" />
                      <span className="text-foreground">Digitale produkter (STL-filer) etter nedlasting</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-destructive rounded-full" />
                      <span className="text-foreground">Produkter som er tydelig brukt eller skadet av kunden</span>
                    </li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-4">
                    Merk: Siden hver Stepper produseres etter dine mål, gjelder angreretten kun 
                    hvis produktet ikke samsvarer med spesifikasjonene du oppga.
                  </p>
                </div>
              </div>
            </div>

            {/* Warranty */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4">Reklamasjon</h2>
              <p className="text-muted-foreground mb-4">
                Ved produksjonsfeil eller mangler har du rett til å reklamere i inntil 2 år 
                etter kjøpet, i henhold til forbrukerkjøpsloven.
              </p>
              <p className="text-sm text-muted-foreground">
                Ta kontakt på <a href="mailto:hei@bsclimbing.no" className="text-primary hover:underline">hei@bsclimbing.no</a> 
                {' '}med bilder og beskrivelse av problemet, så hjelper vi deg.
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
                Du dekker selv fraktkostnad ved retur, med mindre varen har en feil.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
