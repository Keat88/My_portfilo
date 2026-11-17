import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import ScrollReveal from '../animations/ScrollReveal'
import SectionHeading from '../common/SectionHeading'
import SkillBar from '../common/SkillBar'
import Container from '../layout/Container'
import { skills } from '../../data/skills'
import { getTechIcon } from '../../utils/techIcons'
import { cn } from '../../utils/cn'

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

        <div className="grid gap-6 lg:grid-cols-2">
          {categories.map((category, idx) => (
            <ScrollReveal key={category.id} delay={idx * 0.08}>
              <div className="group relative h-full overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_20px_70px_-30px_rgba(56,189,248,0.5)] sm:p-7">
                <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-60" />
                <div className="pointer-events-none absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-violet/10 blur-3xl opacity-60" />
                <div className="relative">
                  <div className="mb-6 flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-gradient-to-r from-primary to-violet shadow-[0_0_12px_rgba(56,189,248,0.8)]" />
                    <h3 className="font-display text-xl font-semibold tracking-tight text-ink">
                      {t(`skills.categories.${category.id}`)}
                    </h3>
                  </div>

                  <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {category.items.map((item) => {
                      const Icon = getTechIcon(item.icon)
                      return (
                        <div
                          key={item.name}
                          className={cn(
                            'flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs text-[var(--text-soft)]',
                            'transition-all duration-300 hover:border-primary/40 hover:bg-primary/10 hover:text-ink hover:shadow-[0_0_20px_-8px_rgba(56,189,248,0.7)]',
                          )}
                        >
                          {Icon ? (
                            <Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                          ) : (
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          )}
                          <span className="truncate font-medium">{item.name}</span>
                        </div>
                      )
                    })}
                  </div>

                  <div className="space-y-4">
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
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
