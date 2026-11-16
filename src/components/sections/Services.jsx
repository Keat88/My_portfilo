import { useTranslation } from 'react-i18next'
import ScrollReveal from '../animations/ScrollReveal'
import SectionHeading from '../common/SectionHeading'
import Container from '../layout/Container'
import { services } from '../../data/services'
import { getTechIcon } from '../../utils/techIcons'

export default function Services() {
  const { t } = useTranslation()

  return (
    <section id="services" className="relative py-16 sm:py-20">
      <Container>
        <ScrollReveal>
          <SectionHeading
            eyebrow={t('services.eyebrow')}
            title={t('services.title')}
            description={t('services.description')}
            align="center"
            className="mb-12 sm:mb-14"
          />
        </ScrollReveal>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, idx) => {
            const Icon = getTechIcon(service.icon)
            return (
              <ScrollReveal key={service.id} delay={idx * 0.08}>
                <article className="group relative h-full overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] p-7 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[0_0_0_1px_rgba(56,189,248,0.25),0_25px_70px_-30px_rgba(56,189,248,0.55)]">
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-primary/20 via-transparent to-violet/20" />
                  </div>
                  <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan/10 blur-2xl transition-transform duration-500 group-hover:scale-125" />

                  <div className="relative">
                    <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary shadow-[0_0_30px_-10px_rgba(56,189,248,0.9)] transition-all duration-500 group-hover:scale-110 group-hover:border-primary/50 group-hover:bg-primary/15 group-hover:shadow-[0_0_40px_-8px_rgba(34,211,238,0.9)]">
                      {Icon ? (
                        <Icon className="h-7 w-7" aria-hidden="true" />
                      ) : (
                        <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                      )}
                    </div>

                    <h3 className="font-display text-xl font-semibold tracking-tight text-ink">
                      {t(`services.items.${service.id}.title`)}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted sm:text-[0.95rem]">
                      {t(`services.items.${service.id}.description`)}
                    </p>

                    <div className="mt-6 h-px w-full bg-gradient-to-r from-primary/40 via-cyan/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-100" />
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
