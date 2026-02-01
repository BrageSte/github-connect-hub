import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="py-12 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} BS Climbing
          </div>
          
          <div className="flex gap-8 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              Hjem
            </Link>
            <Link to="/configure" className="hover:text-foreground transition-colors">
              Konfigurator
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
