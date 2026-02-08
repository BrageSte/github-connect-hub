import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function CTASection() {
  return (
    <section className="py-32 bg-surface">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
            KLAR FOR Å DESIGNE DIN EGEN?
          </h2>
          <p className="text-muted-foreground mb-10 max-w-lg mx-auto">
            Start konfiguratoren og lag en crimp block som passer perfekt til dine fingre.
          </p>
          <Link 
            to="/configure" 
            className="inline-flex items-center justify-center px-10 py-4 bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors"
          >
            START KONFIGURATOR
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
