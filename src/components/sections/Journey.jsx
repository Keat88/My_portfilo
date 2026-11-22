import { Briefcase, Compass, FolderOpen, GraduationCap } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import ScrollReveal from '../animations/ScrollReveal'
import SectionHeading from '../common/SectionHeading'
import Container from '../layout/Container'

const journeyItems = [
  { key: 'education', icon: GraduationCap },
  { key: 'internship', icon: Briefcase },
  { key: 'projects', icon: FolderOpen },
  { key: 'goal', icon: Compass },
]

export default function Journey() {
  const { t } = useTranslation()

  return (
    <section id="journey" className="relative py-16 sm:py-20">
      <Container>
        <ScrollReveal>
          <SectionHeading
            eyebrow={t('journey.eyebrow')}
            title={t('journey.title')}
            description={t('journey.description')}
            align="center"
            className="mb-12 sm:mb-14"
          />
        </ScrollReveal>

        <div className="relative mx-auto max-w-4xl">
          <div
            aria-hidden="true"
            className="absolute bottom-6 left-5 top-6 w-px bg-gradient-to-b from-primary via-cyan to-violet opacity-60 sm:left-6"
          />

          <ol className="space-y-5">
            {journeyItems.map((item, index) => {
              const Icon = item.icon
              const content = t(`journey.items.${item.key}`, { returnObjects: true })

              return (
                <li key={item.key} className="relative pl-14 sm:pl-16">
                  <span className="absolute left-0 top-6 grid h-10 w-10 place-items-center rounded-full border border-primary/30 bg-[var(--overlay-strong)] text-primary shadow-[0_0_24px_-10px_rgba(56,189,248,0.9)] sm:h-12 sm:w-12">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>

                  <ScrollReveal delay={index * 0.08}>
                    <article className="group relative overflow-hidden rounded-3xl border border-[var(--card-border)] bg-[var(--card-surface)] p-5 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-primary/35 sm:p-6">
                      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/10 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      <div className="relative flex flex-wrap items-center justify-between gap-3">
                        <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-primary/90">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {content.phase}
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted/70">
                          {content.meta}
                        </span>
                      </div>
                      <h3 className="mt-4 font-display text-lg font-semibold tracking-tight text-ink sm:text-xl">
                        {content.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{content.description}</p>
                    </article>
                  </ScrollReveal>
                </li>
              )
            })}
          </ol>
        </div>
      </Container>
    </section>
  )
}
