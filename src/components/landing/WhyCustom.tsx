import { motion } from 'framer-motion'

const benefits = [
  {
    title: 'Aktiver alle fingrene',
    description: 'Når kanten matcher fingrene dine, slutter du å overbelaste “favorittfingrene”. Ring og lillefinger blir med.',
  },
  {
    title: 'Mer kontrollert halvcrimp',
    description: 'Målet er en renere posisjon og jevnere drag – ikke bare “holde igjen på hva som helst”.',
  },
  {
    title: 'Tren smart, ikke tilfeldig',
    description: 'Du velger dybde (15/20/25 mm). Dypere = snillere. Grunnere = strengere.',
  },
]

export default function WhyCustom() {
  return (
    <section className="py-32 bg-surface">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            HVORFOR CUSTOM?
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Fordi fingrene dine fortjener bedre enn standardmål.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center p-8"
            >
              <h3 className="text-lg font-semibold mb-3">{benefit.title}</h3>
              <p className="text-muted-foreground text-sm">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
