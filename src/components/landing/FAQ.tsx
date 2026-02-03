import { motion } from 'framer-motion'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: 'Hvordan måler jeg fingrene mine?',
    answer: 'Bruk en skyvelære eller linjal. Mål bredden på hver finger ved det ytterste leddet. For høydeforskjellene, mål avstanden fra ledd til ledd. Vår konfigurator har en visuell guide som viser deg nøyaktig hvordan.',
  },
  {
    question: 'Hvilket materiale brukes?',
    answer: (
      <>
        PLA+ (fiberfri). Vi unngår karbon-/trefiberfyll fordi det kan gi mer slitasje og er mindre egnet for hudkontakt.{' '}
        <a
          href="https://support.3dxtech.com/hc/en-us/article_attachments/360089687193/Carbon_Fiber_SDS.pdf"
          className="text-primary hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          Les mer
        </a>
        .
      </>
    ),
  },
  {
    question: 'Kan jeg printe selv?',
    answer: 'Ja! Velg STL-fil og du får en print-klar fil optimalisert for FDM-printing. Vi inkluderer anbefalte slicer-innstillinger for beste resultat.',
  },
  {
    question: 'Hvor lang er leveringstiden?',
    answer: 'STL-filer leveres umiddelbart. Ferdig printede blokker sendes innen 3-5 virkedager, avhengig av etterspørsel.',
  },
  {
    question: 'Les mer / Research',
    answer: (
      <ul className="list-disc pl-4 space-y-1">
        <li>
          <a
            href="https://unlevel-edge.com/"
            className="text-primary hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            unlevel-edge.com
          </a>
        </li>
        <li>
          <a
            href="https://latticetraining.com/blog/what-makes-the-lattice-training-mxedge-different-from-other-edges/"
            className="text-primary hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            Lattice Training: MXEdge
          </a>
        </li>
        <li>
          <a
            href="https://www.trainingbeta.com/media/tyler-unlevel/"
            className="text-primary hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            TrainingBeta: Tyler Unlevel
          </a>
        </li>
      </ul>
    ),
  },
]

export default function FAQ() {
  return (
    <section id="faq" className="py-32 bg-background">
      <div className="max-w-2xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            SPØRSMÅL?
          </h2>
        </motion.div>

        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <AccordionItem 
                value={`item-${index}`} 
                className="border border-border px-6 data-[state=open]:border-muted-foreground/50"
              >
                <AccordionTrigger className="text-left hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
