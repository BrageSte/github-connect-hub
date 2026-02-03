import { Link } from 'react-router-dom'
import { XCircle, ArrowLeft, HelpCircle } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function CheckoutCancel() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-20">
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          {/* Cancel icon */}
          <div className="w-20 h-20 bg-surface-light border border-border rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-muted-foreground" />
          </div>

          <h1 className="text-3xl font-bold mb-4">Betalingen ble avbrutt</h1>
          <p className="text-muted-foreground mb-8">
            Ingen bekymringer – konfigurasjonen din er fortsatt lagret i handlekurven, 
            og du har ikke blitt belastet.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/cart" className="btn-primary">
              <ArrowLeft className="w-4 h-4" />
              Tilbake til handlekurv
            </Link>
            <Link to="/" className="btn-secondary">
              Gå til forsiden
            </Link>
          </div>

          {/* Help section */}
          <div className="bg-card border border-border rounded-2xl p-6 text-left">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                <HelpCircle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold mb-2">Trenger du hjelp?</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Hvis du opplevde problemer med betalingen, 
                  eller har spørsmål om produktet, ta gjerne kontakt.
                </p>
                <a 
                  href="mailto:post@bsclimbing.no"
                  className="text-sm text-primary hover:underline"
                >
                  post@bsclimbing.no
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
