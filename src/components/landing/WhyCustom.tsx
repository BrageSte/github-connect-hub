import { motion } from 'framer-motion'

const benefits = [
  {
    title: 'Perfekt passform',
    description: 'Hver finger er unik. Med custom mål unngår du unødvendig stress på leddene.',
  },
  {
    title: 'Bedre trening',
    description: 'Når grepet passer perfekt, kan du fokusere på styrke – ikke på å tilpasse deg.',
  },
  {
    title: 'Ingen kompromisser',
    description: 'Slutt å tvinge fingrene inn i standardmål som ikke passer din hånd.',
  },
]

export default function WhyCustom() {
  return (
    <section className="py-32 bg-surface">
      <div className="max-w-5xl mx-auto px-6">
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
