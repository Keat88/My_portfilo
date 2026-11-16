import ScrollReveal from '../animations/ScrollReveal'
import SectionHeading from '../common/SectionHeading'
import Container from '../layout/Container'

export default function SectionStub({ id, eyebrow, title, description, phase }) {
  return (
    <section id={id} className="relative py-16 sm:py-20">
      <Container>
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.02] px-6 py-14 text-center backdrop-blur-sm sm:px-12 sm:py-16">
            <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[28rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
            <div className="relative">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.28em] text-primary/90">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                {phase}
              </div>
              <SectionHeading
                eyebrow={eyebrow}
                title={title}
                description={description}
                align="center"
              />
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  )
}
