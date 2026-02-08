import { motion } from 'framer-motion'

export default function Delivery() {
  return (
    <section className="py-24 bg-surface border-y border-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-muted-foreground text-sm uppercase tracking-wider mb-4">
            Levering
          </p>
          <p className="text-lg text-foreground max-w-xl mx-auto">
            Henting hos Oslo Klatresenter, eller vi sender med Posten. 
            STL-filer leveres umiddelbart etter betaling.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
