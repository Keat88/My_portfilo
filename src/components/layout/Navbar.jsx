import { AnimatePresence, motion, useScroll } from 'framer-motion'
import { ArrowUpRight, Check, ChevronDown, Download, Globe, Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { navLinks } from '../../data/navigation'
import { personalInfo } from '../../data/personalInfo'
import { useActiveSection } from '../../hooks/useActiveSection'
import { useScrolled } from '../../hooks/useScrolled'
import { cn } from '../../utils/cn'
import Button from '../common/Button'
import ThemeToggle from '../ThemeToggle'

const sectionIds = navLinks.map((link) => link.id)

const languages = [
  { code: 'en', labelKey: 'language.en', short: 'EN', flag: <span class="fi fi-sh"></span> },
  { code: 'km', labelKey: 'language.km', short: 'KH', flag: <span class="fi fi-kh"></span> },
]

function LanguageSwitcher({
  t,
  currentLang,
  activeLang,
  langOpen,
  setLangOpen,
  changeLanguage,
  compact = false,
  containerRef,
}) {
  return (
    <div ref={containerRef} className={cn('relative', compact && 'w-full')}>
      <button
        type="button"
        onClick={() => setLangOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={langOpen}
        aria-label={t('language.switchTo')}
        className={cn(
          'inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] text-ink transition-all duration-300 hover:border-primary/40 hover:text-primary',
          compact ? 'w-full justify-between px-3 py-2.5 text-sm' : 'h-10 px-2.5 text-xs sm:px-3',
        )}
      >
        <span className="flex items-center gap-2">
          <span className={cn('text-base leading-none', compact ? '' : 'sm:text-sm')}>{activeLang.flag}</span>
          <span className={cn('font-medium', compact ? 'text-slate-200' : 'hidden sm:inline text-slate-200')}>
            {t(activeLang.labelKey)}
          </span>
          {!compact && <span className="font-mono text-[10px] text-primary/80 sm:hidden">{activeLang.short}</span>}
        </span>
        <ChevronDown aria-hidden="true" className={cn('h-4 w-4 text-muted transition-transform duration-300', langOpen && 'rotate-180 text-primary')} />
      </button>
      <AnimatePresence>
        {langOpen && (
          <motion.ul
            role="listbox"
            aria-label={t('language.label')}
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className={cn(
              'absolute z-[70] overflow-hidden rounded-xl border border-white/10 bg-[var(--overlay-strong)] p-1.5 shadow-[0_20px_60px_-20px_rgba(2,6,23,1)] backdrop-blur-xl',
              compact ? 'left-0 right-0 mt-2' : 'right-0 mt-2 min-w-[10.5rem]',
            )}
          >
            {languages.map((lang) => {
              const selected = currentLang === lang.code
              return (
                <li key={lang.code}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => changeLanguage(lang.code)}
                    className={cn(
                      'flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                      selected ? 'bg-primary/10 text-ink' : 'text-muted hover:bg-white/5 hover:text-ink',
                    )}
                  >
                    <span className="flex items-center gap-2.5">
                      {/* <span className="text-base leading-none">{lang.flag}</span> */}
                      {lang.flag}
                      <span className="font-medium">{t(lang.labelKey)}</span>
                    </span>
                    {selected && <Check aria-hidden="true" className="h-4 w-4 text-primary" />}
                  </button>
                </li>
              )
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const langRef = useRef(null)
  const scrolled = useScrolled(24)
  const active = useActiveSection(sectionIds)
  const { scrollYProgress } = useScroll()
  const currentLang = (i18n.resolvedLanguage || i18n.language || 'en').startsWith('km') ? 'km' : 'en'

  const changeLanguage = (lang) => {
    const y = window.scrollY
    i18n.changeLanguage(lang)
    localStorage.setItem('i18nextLng', lang)
    setLangOpen(false)
    requestAnimationFrame(() => window.scrollTo({ top: y, left: 0, behavior: 'auto' }))
  }

  useEffect(() => {
    if (!open && !langOpen) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false)
        setLangOpen(false)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, langOpen])

  useEffect(() => {
    const onClick = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const activeLang = languages.find((l) => l.code === currentLang) || languages[0]

  return (
    <>
      <motion.div
        aria-hidden="true"
        style={{ scaleX: scrollYProgress }}
        className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-primary via-cyan to-violet"
      />

      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:pt-4">
        <div
          className={cn(
            'relative mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-2xl border px-3.5 py-2.5 transition-all duration-500 sm:px-4',
            scrolled
              ? 'border-[var(--nav-border-scrolled)] bg-[var(--nav-scrolled)] shadow-[var(--shadow-glow)] backdrop-blur-xl'
              : 'border-[var(--nav-border-idle)] bg-[var(--nav-idle)] backdrop-blur-md',
          )}
        >
          <a
            href="#home"
            className="group flex items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
            aria-label={t('a11y.homeAria', { name: personalInfo.name })}
          >
            <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary via-cyan to-violet p-px shadow-[0_0_24px_-6px_rgba(56,189,248,0.8)] transition-shadow duration-300 group-hover:shadow-[0_0_30px_-4px_rgba(168,85,247,0.8)]">
              <span className="grid h-full w-full place-items-center rounded-[11px] bg-[var(--overlay-strong)] font-display text-[11px] font-bold tracking-wide text-ink">
                {personalInfo.initials}
              </span>
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-sm font-semibold tracking-tight text-ink">
                {personalInfo.name}
              </span>
              <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.28em] text-muted/70">
                {t('navbar.portfolio')}
              </span>
            </span>
          </a>

          <nav aria-label={t('a11y.primaryNav')} className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => {
              const isActive = active === link.id
              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'group relative rounded-lg px-3 py-2 text-sm transition-colors duration-300',
                    isActive ? 'text-ink' : 'text-muted hover:text-ink',
                  )}
                >
                  {t(`navbar.${link.id}`)}
                  {isActive ? (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-3 -bottom-px h-px bg-gradient-to-r from-primary via-cyan to-violet"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  ) : (
                    <span className="absolute inset-x-3 -bottom-px h-px origin-left scale-x-0 bg-white/30 transition-transform duration-300 group-hover:scale-x-100" />
                  )}
                </a>
              )
            })}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden lg:block">
              <LanguageSwitcher
                t={t}
                currentLang={currentLang}
                activeLang={activeLang}
                langOpen={langOpen}
                setLangOpen={setLangOpen}
                changeLanguage={changeLanguage}
                containerRef={langRef}
              />
            </div>
            <ThemeToggle />
            <div className="hidden md:block">
              <Button
                href={personalInfo.cvUrl}
                download
                size="sm"
                icon={Download}
                iconPosition="left"
              >
                {t('navbar.downloadCV')}
              </Button>
            </div>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-navigation"
              aria-label={open ? t('a11y.closeMenu') : t('a11y.openMenu')}
              className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-ink transition-colors hover:border-primary/40 hover:text-primary lg:hidden [html[data-theme='light']_&]:border-slate-200 [html[data-theme='light']_&]:bg-white [html[data-theme='light']_&]:shadow-sm"
            >
              {open ? <X aria-hidden="true" className="h-5 w-5" /> : <Menu aria-hidden="true" className="h-5 w-5" />}
            </button>
          </div>

          <AnimatePresence>
            {open && (
              <motion.div
                id="mobile-navigation"
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-50 lg:hidden"
              >
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-[var(--overlay-strong)] p-3 shadow-[var(--shadow-glow)] backdrop-blur-2xl [html[data-theme='light']_&]:border-slate-200/80">
                  <nav aria-label={t('a11y.mobileNav')} className="flex flex-col">
                    {navLinks.map((link, index) => {
                      const isActive = active === link.id
                      return (
                        <a
                          key={link.id}
                          href={`#${link.id}`}
                          onClick={() => setOpen(false)}
                          aria-current={isActive ? 'page' : undefined}
                          className={cn(
                            'flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors',
                            isActive
                              ? 'bg-primary/10 text-ink'
                              : 'text-muted hover:bg-white/5 hover:text-ink',
                          )}
                        >
                          <span className="flex items-center gap-3">
                            <span className="font-mono text-[10px] text-primary/70">
                              0{index + 1}
                            </span>
                            {t(`navbar.${link.id}`)}
                          </span>
                          {isActive && <ArrowUpRight aria-hidden="true" className="h-4 w-4 text-primary" />}
                        </a>
                      )
                    })}
                  </nav>

                  <div className="mt-3 space-y-2 border-t border-white/5 pt-3">
                    <div className="px-1">
                      <div className="mb-2 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-muted/70">
                        <Globe className="h-3.5 w-3.5" aria-hidden="true" />
                        {t('language.label')}
                      </div>
                      <LanguageSwitcher
                        t={t}
                        currentLang={currentLang}
                        activeLang={activeLang}
                        langOpen={langOpen}
                        setLangOpen={setLangOpen}
                        changeLanguage={changeLanguage}
                        compact
                      />
                    </div>
                    <Button
                      href={personalInfo.cvUrl}
                      download
                      size="md"
                      icon={Download}
                      iconPosition="left"
                      className="w-full"
                    >
                      {t('navbar.downloadCV')}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
    </>
  )
}
