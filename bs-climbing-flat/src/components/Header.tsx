'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
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
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-background text-sm">
              BS
            </div>
            <span className="font-bold text-lg tracking-tight group-hover:text-primary transition-colors">
              Stepper
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="/#hvorfor" 
              className="text-text-muted hover:text-text transition-colors text-sm"
            >
              Hvorfor custom?
            </Link>
            <Link 
              href="/#hvordan" 
              className="text-text-muted hover:text-text transition-colors text-sm"
            >
              Slik funker det
            </Link>
            <Link 
              href="/#faq" 
              className="text-text-muted hover:text-text transition-colors text-sm"
            >
              FAQ
            </Link>
            <Link href="/configure" className="btn-primary text-sm">
              Konfigurer Stepper
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-text-muted hover:text-text"
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
              <Link 
                href="/#hvorfor" 
                className="text-text-muted hover:text-text transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Hvorfor custom?
              </Link>
              <Link 
                href="/#hvordan" 
                className="text-text-muted hover:text-text transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Slik funker det
              </Link>
              <Link 
                href="/#faq" 
                className="text-text-muted hover:text-text transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                FAQ
              </Link>
              <Link 
                href="/configure" 
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
