import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { FAQItem } from '@/types'

const faqs: FAQItem[] = [
  {
    question: 'Hvor presise er målene?',
    answer: 'FDM-printing har en toleranse på ca. ±0.3mm. Det betyr at hvis du bestiller et 15mm grep, kan det være alt fra 14.7mm til 15.3mm. For de fleste formål er dette godt innenfor akseptabelt – du merker ikke forskjellen på fingeren.',
  },
  {
    question: 'Kan jeg få STEP-fil i stedet for STL?',
    answer: 'Nei, vi leverer kun STL. STEP-filer egner seg for videre modifikasjon, men Stepper er designet som et ferdig produkt. STL-filen er optimalisert for print og klar til bruk.',
  },
  {
    question: 'Hva med lisens og bruksrett?',
    answer: 'Du kjøper rett til å printe og bruke Stepper for privat bruk. Filen kan ikke videreselges, deles eller brukes kommersielt. Kort sagt: print til deg selv og dine kompiser, ikke start en butikk.',
  },
  {
    question: 'Hvilken printer trenger jeg?',
    answer: 'Stepper er designet for FDM-printere med minimum 200x200mm byggeplate. Vi anbefaler PLA eller PETG med 20-30% infill. De fleste hobby-printere (Prusa, Ender, Bambu) funker fint.',
  },
  {
    question: 'Hva om jeg ikke har 3D-printer?',
    answer: 'Mange biblioteker og makerspaces har 3D-printere. Du kan også bruke tjenester som Treatstock eller lokale printshops. Vi hjelper gjerne med tips – send oss en mail.',
  },
  {
    question: 'Kan jeg endre designet etter kjøp?',
    answer: 'Nei, STL-filen er låst til dine valgte mål. Men du kan alltid kjøpe en ny konfigurasjon om du vil prøve andre mål. Hver konfigurasjon er unik.',
  },
  {
    question: 'Hvor lang tid tar leveringen?',
    answer: 'STL-filen sendes på e-post umiddelbart etter betaling. Ved pickup får du beskjed når tau og evt. ferdigprintet produkt er klart – vanligvis 1-3 virkedager.',
  },
  {
    question: 'Refundering og garanti?',
    answer: 'Digitale produkter kan ikke refunderes etter nedlasting. Vi garanterer at STL-filen er printbar og matcher konfigurasjonen du bestilte. Problemer? Ta kontakt, så løser vi det.',
  },
]

function FAQItemComponent({ item, isOpen, onClick }: { item: FAQItem; isOpen: boolean; onClick: () => void }) {
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={onClick}
        className="w-full py-5 flex items-center justify-between text-left group"
      >
        <span className="font-medium pr-4 group-hover:text-primary transition-colors">
          {item.question}
        </span>
        <ChevronDown 
          className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-primary' : ''
          }`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pb-5 text-muted-foreground leading-relaxed">
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="section bg-background">
      <div className="container-custom">
        {/* Section header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">
            Ofte stilte spørsmål
          </h2>
          <p className="section-subtitle mx-auto">
            Alt du lurer på, samlet på ett sted.
          </p>
        </motion.div>

        {/* FAQ list */}
        <motion.div 
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="card">
            {faqs.map((faq, index) => (
              <FAQItemComponent
                key={index}
                item={faq}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              />
            ))}
          </div>
        </motion.div>

        {/* Contact CTA */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-muted-foreground mb-4">
            Fant du ikke svar på det du lurte på?
          </p>
          <a 
            href="mailto:hei@bsclimbing.no" 
            className="btn-secondary inline-flex"
          >
            Send oss en mail
          </a>
        </motion.div>
      </div>
    </section>
  )
}
