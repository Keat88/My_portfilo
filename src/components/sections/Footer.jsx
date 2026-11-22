import { ArrowUpRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { navLinks } from '../../data/navigation'
import { personalInfo } from '../../data/personalInfo'
import Container from '../layout/Container'
import SocialLinks from '../common/SocialLinks'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="relative border-t border-[var(--overlay-border-soft)] bg-[var(--overlay-softer)] py-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <Container>
        <div className="grid gap-8 sm:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <p className="font-display text-lg font-semibold tracking-tight text-ink">{personalInfo.name}</p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">{t('footer.description')}</p>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary/80">{t('footer.navigation')}</p>
            <ul className="mt-3 grid grid-cols-2 gap-2 text-sm text-muted">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a href={`#${link.id}`} className="group inline-flex items-center gap-1 transition-colors hover:text-ink">
                    {t(`navbar.${link.id}`)}
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary/80">{t('footer.social')}</p>
            <SocialLinks className="mt-3" size="sm" />
          </div>
        </div>

        <div className="mt-8 border-t border-[var(--overlay-border-soft)] pt-5 text-xs text-muted">
          {t('footer.copyright', { year: new Date().getFullYear(), name: personalInfo.name })}
        </div>
      </Container>
    </footer>
  )
}
