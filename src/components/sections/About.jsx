import { animate, motion, useInView, useReducedMotion } from 'framer-motion'
import { Briefcase, GraduationCap, Target } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ScrollReveal from '../animations/ScrollReveal'
import SectionHeading from '../common/SectionHeading'
import Container from '../layout/Container'
import { projects } from '../../data/projects'
import { services } from '../../data/services'
import { skills } from '../../data/skills'
import { cn } from '../../utils/cn'

const focusCards = [
  { key: 'education', icon: GraduationCap, tone: 'from-primary/25 via-cyan/10 to-transparent' },
  { key: 'experience', icon: Briefcase, tone: 'from-cyan/25 via-violet/10 to-transparent' },
  { key: 'goal', icon: Target, tone: 'from-violet/25 via-primary/10 to-transparent' },
]

function AnimatedStat({ value, label, suffix = '' }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (reduce || !inView) return undefined

    const controls = animate(0, value, {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    })

    return () => controls.stop()
  }, [inView, reduce, value])

  return (
    <div ref={ref} className="rounded-2xl border border-[var(--overlay-border-soft)] bg-[var(--overlay-softer)] px-3 py-3 text-center">
      <p className="font-display text-2xl font-semibold text-ink sm:text-3xl">
        {reduce ? value : display}
        {suffix}
      </p>
      <p className="mt-1 text-[10px] leading-snug text-muted sm:text-[11px]">{label}</p>
    </div>
  )
}

export default function About() {
  const { t } = useTranslation()
  const reduce = useReducedMotion()
  const technologyCount = skills.categories.reduce((total, category) => total + category.items.length, 0)

  return (
    <section id="about" className="relative py-16 sm:py-20">
      <Container>
        <ScrollReveal>
          <SectionHeading
            eyebrow={t('about.eyebrow')}
            title={t('about.title')}
            description={t('about.summary')}
            className="mb-12 sm:mb-14"
          />
        </ScrollReveal>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
          <ScrollReveal>
            <div className="relative h-full overflow-hidden rounded-3xl border border-[var(--card-border)] bg-[var(--card-surface)] p-6 backdrop-blur-xl sm:p-8">
              <div className="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -right-16 h-48 w-48 rounded-full bg-violet/10 blur-3xl" />

              <div className="relative">
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary/80">
                  {t('about.eyebrow')}
                </span>
                <p className="mt-4 text-sm leading-relaxed text-[var(--text-soft)] sm:text-[0.95rem]">
                  {t('about.description')}
                </p>

                <div className="mt-7 rounded-2xl border border-[var(--overlay-border-soft)] bg-[var(--overlay-softer)] px-4 py-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted/70">
                    {t('about.stackLabel')}
                  </p>
                  <p className="mt-2 text-xs font-medium text-ink sm:text-sm">{t('about.stack')}</p>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  <AnimatedStat value={technologyCount} label={t('about.stats.technologies')} />
                  <AnimatedStat value={projects.length} label={t('about.stats.projects')} />
                  <AnimatedStat value={services.length} label={t('about.stats.focusAreas')} />
                </div>
              </div>
            </div>
          </ScrollReveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {focusCards.map((card, index) => {
              const Icon = card.icon
              const item = t(`about.cards.${card.key}`, { returnObjects: true })

              return (
                <ScrollReveal
                  key={card.key}
                  delay={index * 0.08}
                  className={cn(index === focusCards.length - 1 && 'sm:col-span-2')}
                >
                  <motion.article
                    whileHover={reduce ? undefined : { y: -4 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="group relative h-full overflow-hidden rounded-3xl border border-[var(--card-border)] bg-[var(--card-surface)] p-5 backdrop-blur-xl sm:p-6"
                  >
                    <div className={cn('pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100', card.tone)} />
                    <div className="relative">
                      <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary/80">{item.label}</p>
                      <h3 className="mt-2 font-display text-lg font-semibold tracking-tight text-ink">{item.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
                    </div>
                  </motion.article>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}
