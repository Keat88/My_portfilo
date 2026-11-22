import { Braces, Code2, Database, Layers3, Server, Wrench } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import ScrollReveal from '../animations/ScrollReveal'
import SectionHeading from '../common/SectionHeading'
import SkillBar from '../common/SkillBar'
import Container from '../layout/Container'
import { skills } from '../../data/skills'
import { getTechIcon } from '../../utils/techIcons'
import { cn } from '../../utils/cn'

const categoryIcons = {
  frontend: Code2,
  backend: Server,
  languages: Braces,
  databases: Database,
  devops: Wrench,
  other: Layers3,
}

const categoryTones = {
  frontend: 'from-primary/20 via-transparent to-cyan/10',
  backend: 'from-cyan/20 via-transparent to-violet/10',
  languages: 'from-violet/20 via-transparent to-primary/10',
  databases: 'from-primary/20 via-transparent to-violet/10',
  devops: 'from-cyan/20 via-transparent to-primary/10',
  other: 'from-violet/20 via-transparent to-cyan/10',
}

export default function Skills() {
  const { t } = useTranslation()
  const categories = useMemo(() => skills.categories, [])

  return (
    <section id="skills" className="relative py-16 sm:py-20">
      <Container>
        <ScrollReveal>
          <SectionHeading
            eyebrow={t('skills.eyebrow')}
            title={t('skills.title')}
            description={t('skills.description')}
            align="center"
            className="mb-12 sm:mb-14"
          />
        </ScrollReveal>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category, index) => {
            const Icon = categoryIcons[category.id] ?? Layers3

            return (
              <ScrollReveal key={category.id} delay={(index % 3) * 0.08}>
                <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-[var(--card-border)] bg-[var(--card-surface)] p-5 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-primary/35 hover:shadow-[0_24px_80px_-35px_rgba(56,189,248,0.5)] sm:p-6">
                  <div className={cn('pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100', categoryTones[category.id])} />

                  <div className="relative">
                    <div className="mb-5 flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="grid h-11 w-11 place-items-center rounded-2xl border border-primary/25 bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                          {t(`skills.categories.${category.id}`)}
                        </h3>
                      </div>
                      <span className="rounded-full border border-[var(--overlay-border-soft)] bg-[var(--overlay-softer)] px-2.5 py-1 font-mono text-[10px] text-muted">
                        {String(category.items.length).padStart(2, '0')}
                      </span>
                    </div>

                    <ul className="mb-6 grid grid-cols-2 gap-2.5">
                      {category.items.map((item) => {
                        const TechIcon = getTechIcon(item.icon)
                        return (
                          <li
                            key={item.name}
                            className="flex min-w-0 items-center gap-2 rounded-xl border border-[var(--overlay-border-soft)] bg-[var(--overlay-softer)] px-3 py-2.5 text-xs text-[var(--text-soft)] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/10 hover:text-ink"
                          >
                            {TechIcon ? (
                              <TechIcon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                            ) : (
                              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                            )}
                            <span className="truncate font-medium">{item.name}</span>
                          </li>
                        )
                      })}
                    </ul>

                    <div className="mt-auto space-y-4">
                      {category.items.map((item, i) => (
                        <SkillBar
                          key={`${category.id}-${item.name}`}
                          name={item.name}
                          level={item.level}
                          delay={i * 0.05}
                        />
                      ))}
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
