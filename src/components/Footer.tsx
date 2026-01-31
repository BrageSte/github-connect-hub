import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border">
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-primary-foreground text-sm">
                BS
              </div>
              <span className="font-bold text-lg tracking-tight">
                BS Climbing
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm">
              Custom klatreutstyr designet av klatrere, for klatrere. 
              Ingen magi. Bare geometri.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
              Produkt
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/configure" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Konfigurer Stepper
                </Link>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('hvordan')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Slik funker det
                </button>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
              Info
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/vilkar" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Vilkår
                </Link>
              </li>
              <li>
                <Link to="/personvern" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Personvern
                </Link>
              </li>
              <li>
                <a 
                  href="mailto:hei@bsclimbing.no" 
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Kontakt
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} BS Climbing. Alle rettigheter reservert.
          </p>
          <p className="text-muted-foreground text-xs">
            Laget med presisjon i Oslo 🇳🇴
          </p>
        </div>
      </div>
    </footer>
  )
}
