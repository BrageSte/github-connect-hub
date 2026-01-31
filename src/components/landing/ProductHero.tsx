import { Link } from 'react-router-dom'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ProductHero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-50" />
      <div className="absolute inset-0 bg-radial-gradient" />
      
      {/* Gradient orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container-custom relative z-10 pt-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text content */}
          <motion.div 
            className="text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-full mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="w-2 h-2 bg-valid rounded-full animate-pulse" />
              <span className="text-sm text-muted-foreground">Nå tilgjengelig</span>
            </motion.div>

            {/* Main headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
              Design din egen crimp
              <span className="block gradient-text">
                – millimeter for millimeter
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8">
              Velg mål. Se preview. Print selv.
              <span className="block mt-2 text-base">
                Custom crimp block fra BS Climbing – fordi standardmål ikke passer alle.
              </span>
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/configure" className="btn-primary text-base px-8 py-4">
                Konfigurer Stepper
                <ArrowRight size={18} />
              </Link>
              <button 
                onClick={() => scrollToSection('hvordan')} 
                className="btn-secondary text-base px-8 py-4"
              >
                Hvordan funker det?
              </button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start mt-10 pt-10 border-t border-border">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">±0.3mm</div>
                <div className="text-sm text-muted-foreground">Toleranse</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">4</div>
                <div className="text-sm text-muted-foreground">Grep per blokk</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">STL</div>
                <div className="text-sm text-muted-foreground">Ferdig fil</div>
              </div>
            </div>
          </motion.div>

          {/* Product visual placeholder */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-3xl blur-2xl" />
              
              {/* Product card */}
              <div className="relative bg-surface border border-border rounded-3xl p-8 h-full flex items-center justify-center">
                {/* 3D Placeholder visualization */}
                <div className="relative w-full aspect-[4/3]">
                  {/* Base board visualization */}
                  <div className="absolute inset-x-4 bottom-8 h-4 bg-border rounded-lg" />
                  
                  {/* Grip blocks */}
                  <div className="absolute inset-x-4 bottom-12 flex justify-between items-end px-4">
                    <div className="w-12 bg-gradient-to-t from-primary/60 to-primary rounded-t-lg" style={{ height: '120px' }} />
                    <div className="w-12 bg-gradient-to-t from-primary/60 to-primary rounded-t-lg" style={{ height: '100px' }} />
                    <div className="w-12 bg-gradient-to-t from-primary/60 to-primary rounded-t-lg" style={{ height: '80px' }} />
                    <div className="w-12 bg-gradient-to-t from-primary/60 to-primary rounded-t-lg" style={{ height: '60px' }} />
                  </div>

                  {/* Labels */}
                  <div className="absolute top-4 left-4 text-xs text-muted-foreground font-mono">
                    PREVIEW
                  </div>
                  
                  {/* Measurement lines */}
                  <div className="absolute right-4 bottom-12 top-8 flex flex-col justify-between items-center">
                    <div className="h-full w-px bg-border-light relative">
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-px bg-primary" />
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-px bg-primary" />
                    </div>
                    <span className="text-[10px] text-muted-foreground mt-2 font-mono">6-35mm</span>
                  </div>
                </div>

                {/* Corner accent */}
                <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-primary/30 rounded-tr-2xl" />
                <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-primary/30 rounded-bl-2xl" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <button 
            onClick={() => scrollToSection('hvorfor')}
            className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <span className="text-xs uppercase tracking-wider">Scroll</span>
            <ChevronDown size={20} className="animate-bounce" />
          </button>
        </motion.div>
      </div>
    </section>
  )
}
