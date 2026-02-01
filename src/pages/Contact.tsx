import { Link } from 'react-router-dom'
import { ArrowLeft, Mail, MessageCircle, Clock } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Contact() {
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

          <h1 className="text-4xl font-bold mb-4">Kontakt oss</h1>
          <p className="text-muted-foreground mb-8">
            Vi hører gjerne fra deg! Send oss en melding, så svarer vi så raskt vi kan.
          </p>

          <div className="space-y-6">
            {/* Email */}
            <a 
              href="mailto:hei@bsclimbing.no"
              className="bg-card border border-border rounded-2xl p-6 flex items-center gap-4 hover:border-primary/50 transition-colors block"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-1">E-post</h2>
                <p className="text-primary">hei@bsclimbing.no</p>
              </div>
            </a>

            {/* Response time */}
            <div className="bg-card border border-border rounded-2xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-1">Svartid</h2>
                <p className="text-muted-foreground">Vi svarer vanligvis innen 24 timer på hverdager</p>
              </div>
            </div>

            {/* FAQ link */}
            <div className="bg-surface-light rounded-2xl p-6 border border-border">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold mb-2">Ofte stilte spørsmål</h2>
                  <p className="text-muted-foreground mb-4">
                    Kanskje finner du svaret i vår FAQ?
                  </p>
                  <Link 
                    to="/#faq" 
                    className="text-primary hover:underline text-sm font-medium"
                  >
                    Se FAQ →
                  </Link>
                </div>
              </div>
            </div>

            {/* Social / About */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">Om BS Climbing</h2>
              <p className="text-muted-foreground text-sm mb-4">
                BS Climbing lager skreddersydde treningsblokker for klatrere. 
                Vi tror på at utstyr skal tilpasses deg – ikke omvendt.
              </p>
              <p className="text-muted-foreground text-sm">
                Basert i Oslo 🇳🇴
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
