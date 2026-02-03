import { Link } from 'react-router-dom'
import { ArrowLeft, Truck, Clock, MapPin } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Shipping() {
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

          <h1 className="text-4xl font-bold mb-8">Frakt og levering</h1>

          <div className="space-y-8">
            {/* Shipping info */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <Truck className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Fast frakt til hele Norge</h2>
                  <p className="text-muted-foreground mb-4">
                    Vi sender alle bestillinger med Posten/Bring. Fraktkostnaden er 
                    <span className="text-foreground font-semibold"> 79,- kr</span> uansett hvor i Norge du bor.
                  </p>
                  <div className="bg-surface-light rounded-xl p-4">
                    <div className="text-2xl font-bold text-primary mb-1">79,- kr</div>
                    <div className="text-sm text-muted-foreground">Fast pris, ingen overraskelser</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery time */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Leveringstid</h2>
                  <p className="text-muted-foreground mb-4">
                    Siden hver Stepper produseres etter din spesifikasjon, 
                    tar det litt tid før vi sender.
                  </p>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-foreground">Produksjonstid: 1-2 virkedager</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-foreground">Leveringstid: 2-3 virkedager</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-valid rounded-full" />
                      <span className="text-foreground font-medium">Totalt: 3-5 virkedager</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Tracking */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Sporing</h2>
                  <p className="text-muted-foreground">
                    Du får en e-post med sporingsnummer så snart pakken er sendt. 
                    Med dette kan du følge pakken hele veien til den ankommer.
                  </p>
                </div>
              </div>
            </div>

            {/* International */}
            <div className="bg-surface-light rounded-2xl p-6 border border-border">
              <h3 className="font-semibold mb-2">Utenfor Norge?</h3>
              <p className="text-sm text-muted-foreground">
                Vi sender foreløpig kun til adresser i Norge. 
                Ta kontakt på <a href="mailto:post@bsclimbing.no" className="text-primary hover:underline">post@bsclimbing.no</a> 
                {' '}hvis du ønsker levering til andre land, så finner vi en løsning.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
