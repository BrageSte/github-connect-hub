import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/95 backdrop-blur-md border-b border-border' 
          : 'bg-transparent'
      }`}
    >
      <div className="container-custom">
        <nav className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-primary-foreground text-sm">
              BS
            </div>
            <span className="font-bold text-lg tracking-tight group-hover:text-primary transition-colors">
              Stepper
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => scrollToSection('hvorfor')}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              Hvorfor custom?
            </button>
            <button 
              onClick={() => scrollToSection('hvordan')}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              Slik funker det
            </button>
            <button 
              onClick={() => scrollToSection('faq')}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              FAQ
            </button>
            <Link to="/configure" className="btn-primary text-sm">
              Konfigurer Stepper
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => scrollToSection('hvorfor')}
                className="text-muted-foreground hover:text-foreground transition-colors py-2 text-left"
              >
                Hvorfor custom?
              </button>
              <button 
                onClick={() => scrollToSection('hvordan')}
                className="text-muted-foreground hover:text-foreground transition-colors py-2 text-left"
              >
                Slik funker det
              </button>
              <button 
                onClick={() => scrollToSection('faq')}
                className="text-muted-foreground hover:text-foreground transition-colors py-2 text-left"
              >
                FAQ
              </button>
              <Link 
                to="/configure" 
                className="btn-primary text-center mt-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Konfigurer Stepper
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
