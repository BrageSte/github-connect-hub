import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="py-12 md:py-16 bg-surface border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="font-semibold text-lg tracking-wide text-foreground hover:text-primary transition-colors">
              BS CLIMBING
            </Link>
            <p className="text-muted-foreground text-sm mt-3 max-w-sm">
              Custom klatreutstyr designet av klatrere, for klatrere. 
              Ingen magi. Bare geometri.
            </p>
          </div>

          {/* Product links */}
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
                <Link to="/#how-it-works" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Slik funker det
                </Link>
              </li>
              <li>
                <Link to="/#faq" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Info links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
              Info
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/shipping" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Frakt
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Retur
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Personvern
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} BS Climbing. Alle rettigheter reservert.
          </p>
          <div className="text-muted-foreground text-xs text-center md:text-right space-y-1">
            <a
              href="mailto:post@bsclimbing.no"
              className="hover:text-primary transition-colors"
            >
              post@bsclimbing.no
            </a>
            <p>Åstadlia 18, 1396 Billingstad, Norway</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
