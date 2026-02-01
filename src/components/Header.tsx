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
      <div className="max-w-7xl mx-auto px-6">
        <nav className="flex items-center justify-between h-16">
          {/* Logo - Clean text only like Hand of God */}
          <Link to="/" className="font-semibold text-lg tracking-wide text-foreground hover:text-primary transition-colors">
            BS CLIMBING
          </Link>

          {/* Desktop Navigation - Minimal */}
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Hvordan
            </button>
            <button 
              onClick={() => scrollToSection('faq')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              FAQ
            </button>
            <Link 
              to="/configure" 
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Konfigurer
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
          <div className="md:hidden py-6 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-muted-foreground hover:text-foreground transition-colors py-2 text-left"
              >
                Hvordan
              </button>
              <button 
                onClick={() => scrollToSection('faq')}
                className="text-muted-foreground hover:text-foreground transition-colors py-2 text-left"
              >
                FAQ
              </button>
              <Link 
                to="/configure" 
                className="text-foreground font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Konfigurer
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
