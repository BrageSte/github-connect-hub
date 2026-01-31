import Link from 'next/link'
import { XCircle, ArrowLeft, HelpCircle } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function CheckoutCancelPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24 pb-20">
        <div className="container-custom">
          <div className="max-w-lg mx-auto text-center">
            {/* Cancel icon */}
            <div className="w-20 h-20 bg-surface border border-border rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-text-muted" />
            </div>

            {/* Heading */}
            <h1 className="text-3xl font-bold mb-4">
              Betalingen ble avbrutt
            </h1>
            <p className="text-text-muted mb-8">
              Ingen bekymringer – konfigurasjonen din er ikke lagret, 
              og du har ikke blitt belastet.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/configure" className="btn-primary">
                <ArrowLeft className="w-4 h-4" />
                Tilbake til konfigurator
              </Link>
              <Link href="/" className="btn-secondary">
                Gå til forsiden
              </Link>
            </div>

            {/* Help section */}
            <div className="card text-left">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <HelpCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold mb-2">Trenger du hjelp?</h2>
                  <p className="text-sm text-text-muted mb-4">
                    Hvis du opplevde problemer med betalingen, 
                    eller har spørsmål om produktet, ta gjerne kontakt.
                  </p>
                  <a 
                    href="mailto:hei@bsclimbing.no"
                    className="text-sm text-primary hover:underline"
                  >
                    hei@bsclimbing.no
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
