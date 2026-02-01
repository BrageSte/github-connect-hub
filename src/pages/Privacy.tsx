import { Link } from 'react-router-dom'
import { ArrowLeft, Shield, Eye, Lock, Trash2 } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Privacy() {
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

          <h1 className="text-4xl font-bold mb-4">Personvern</h1>
          <p className="text-muted-foreground mb-8">
            Sist oppdatert: {new Date().toLocaleDateString('nb-NO', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="prose prose-invert max-w-none space-y-8">
            {/* Intro */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Vårt løfte</h2>
                  <p className="text-muted-foreground">
                    Vi samler kun inn informasjon som er nødvendig for å levere produktene du bestiller. 
                    Vi selger aldri dine data til tredjeparter.
                  </p>
                </div>
              </div>
            </div>

            {/* What we collect */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <Eye className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-4">Hva vi samler inn</h2>
                  <ul className="space-y-4 text-sm">
                    <li>
                      <span className="font-medium text-foreground">E-postadresse</span>
                      <p className="text-muted-foreground mt-1">
                        For å sende ordrebekreftelse og oppdateringer om din bestilling.
                      </p>
                    </li>
                    <li>
                      <span className="font-medium text-foreground">Leveringsadresse</span>
                      <p className="text-muted-foreground mt-1">
                        For å sende produktene til deg.
                      </p>
                    </li>
                    <li>
                      <span className="font-medium text-foreground">Betalingsinformasjon</span>
                      <p className="text-muted-foreground mt-1">
                        Behandles av Stripe og lagres ikke hos oss.
                      </p>
                    </li>
                    <li>
                      <span className="font-medium text-foreground">Produktkonfigurasjon</span>
                      <p className="text-muted-foreground mt-1">
                        Målene du oppgir for å lage din tilpassede Stepper.
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* How we protect */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-4">Hvordan vi beskytter dataene</h2>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-valid rounded-full" />
                      <span className="text-foreground">All trafikk er kryptert med SSL/TLS</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-valid rounded-full" />
                      <span className="text-foreground">Betalinger håndteres av Stripe (PCI-sertifisert)</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-valid rounded-full" />
                      <span className="text-foreground">Begrenset tilgang til persondata</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-valid rounded-full" />
                      <span className="text-foreground">Data lagres på sikre servere i EU</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Your rights */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <Trash2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-4">Dine rettigheter</h2>
                  <p className="text-muted-foreground mb-4">
                    I henhold til GDPR har du følgende rettigheter:
                  </p>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-foreground">Rett til innsyn i dine data</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-foreground">Rett til å korrigere feil</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-foreground">Rett til sletting ("retten til å bli glemt")</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-foreground">Rett til å klage til Datatilsynet</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-surface-light rounded-2xl p-6 border border-border">
              <h3 className="font-semibold mb-2">Spørsmål om personvern?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Kontakt oss på <a href="mailto:hei@bsclimbing.no" className="text-primary hover:underline">hei@bsclimbing.no</a> 
                {' '}hvis du har spørsmål eller ønsker å utøve dine rettigheter.
              </p>
              <p className="text-xs text-muted-foreground">
                Behandlingsansvarlig: BS Climbing, Oslo, Norge
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
