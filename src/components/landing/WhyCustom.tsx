import { TrendingUp, Heart, Target } from 'lucide-react'
import { motion } from 'framer-motion'

const reasons = [
  {
    icon: TrendingUp,
    title: 'Progresjon',
    description: 'Juster millimeterne etterhvert som du blir sterkere. Start med 20mm, jobb deg ned til 10. Du bestemmer tempoet.',
  },
  {
    icon: Heart,
    title: 'Rehab',
    description: 'Pulley-skade? Tilpass grepet til akkurat der du er i opptreningen. Små justeringer, stor forskjell.',
  },
  {
    icon: Target,
    title: 'Dine premisser',
    description: 'Standardmål funker for standardfingre. Dine fingre? Sannsynligvis ikke standard. Så hvorfor skal utstyret være det?',
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function WhyCustom() {
  return (
    <section id="hvorfor" className="section bg-background relative">
      {/* Background accent */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/3 h-2/3 bg-gradient-to-r from-primary/5 to-transparent blur-3xl pointer-events-none" />
      
      <div className="container-custom relative">
        {/* Section header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">
            Hvorfor custom?
          </h2>
          <p className="section-subtitle mx-auto">
            Fordi én størrelse aldri har passet alle – spesielt ikke i klatring.
          </p>
        </motion.div>

        {/* Reasons grid */}
        <motion.div 
          className="grid md:grid-cols-3 gap-6 lg:gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {reasons.map((reason, index) => (
            <motion.div 
              key={index}
              variants={item}
              className="card-hover group"
            >
              {/* Icon */}
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <reason.icon className="w-6 h-6 text-primary" />
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-semibold mb-3">
                {reason.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom quote */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <blockquote className="text-xl md:text-2xl text-muted-foreground italic max-w-2xl mx-auto">
            "Ingen magi. Bare geometri."
          </blockquote>
        </motion.div>
      </div>
    </section>
  )
}
