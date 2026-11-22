import { AnimatePresence, motion, useScroll } from 'framer-motion'
import { ArrowUpRight, Check, ChevronDown, Globe, Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import flagKh from 'flag-icons/flags/4x3/kh.svg'
import flagSh from 'flag-icons/flags/4x3/sh.svg'
import { navLinks } from '../../data/navigation'
import { personalInfo } from '../../data/personalInfo'
import { useActiveSection } from '../../hooks/useActiveSection'
import { useScrolled } from '../../hooks/useScrolled'
import { cn } from '../../utils/cn'
import ThemeToggle from '../ThemeToggle'

const sectionIds = navLinks.map((link) => link.id)

const languages = [
  {
    code: 'en',
    labelKey: 'language.en',
    short: 'EN',
    flag: <img src={flagSh} alt="" className="h-3.5 w-5 rounded-[2px] object-cover" />,
  },
  {
    code: 'km',
    labelKey: 'language.km',
    short: 'KH',
    flag: <img src={flagKh} alt="" className="h-3.5 w-5 rounded-[2px] object-cover" />,
  },
]

function LanguageSwitcher({
  t,
  currentLang,
  activeLang,
  langOpen,
  setLangOpen,
  changeLanguage,
  compact = false,
  idPrefix,
}) {
  const triggerRef = useRef(null)
  const optionRefs = useRef([])
  const menuId = `${idPrefix}-language-menu`

  const focusOption = (index) => {
    const target = optionRefs.current[(index + languages.length) % languages.length]
    target?.focus()
  }

  const handleTriggerKeyDown = (event) => {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setLangOpen(true)
      requestAnimationFrame(() => focusOption(0))
    }
  }

  const handleMenuKeyDown = (event) => {
    const current = optionRefs.current.indexOf(document.activeElement)

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      focusOption(current + 1)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      focusOption(current - 1)
    } else if (event.key === 'Home') {
      event.preventDefault()
      focusOption(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      focusOption(languages.length - 1)
    } else if (event.key === 'Escape') {
      event.preventDefault()
      setLangOpen(false)
      triggerRef.current?.focus()
    }
  }

  return (
    <div data-language-switcher className={cn('relative', compact && 'w-full')}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setLangOpen((value) => !value)}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="menu"
        aria-controls={menuId}
        aria-expanded={langOpen}
        aria-label={t('language.switchTo')}
        className={cn(
          'inline-flex items-center gap-2 rounded-xl border border-[var(--overlay-border)] bg-[var(--overlay-soft)] text-ink transition-all duration-300 hover:border-primary/40 hover:text-primary',
          compact ? 'w-full justify-between px-3 py-2.5 text-sm' : 'h-10 px-2.5 text-xs sm:px-3',
        )}
      >
        <span className="flex items-center gap-2">
          <span className={cn('text-base leading-none', compact ? '' : 'sm:text-sm')}>{activeLang.flag}</span>
          <span className={cn('font-medium text-[var(--text-soft)]', compact ? '' : 'hidden sm:inline')}>
            {t(activeLang.labelKey)}
          </span>
          {!compact && <span className="font-mono text-[10px] text-primary/80 sm:hidden">{activeLang.short}</span>}
        </span>
        <ChevronDown aria-hidden="true" className={cn('h-4 w-4 text-muted transition-transform duration-300', langOpen && 'rotate-180 text-primary')} />
      </button>

      <AnimatePresence>
        {langOpen && (
          <motion.div
            id={menuId}
            role="menu"
            aria-label={t('language.label')}
            onKeyDown={handleMenuKeyDown}
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className={cn(
              'absolute z-[70] overflow-hidden rounded-xl border border-[var(--overlay-border)] bg-[var(--overlay-strong)] p-1.5 shadow-[0_20px_60px_-20px_rgba(2,6,23,1)] backdrop-blur-xl',
              compact ? 'left-0 right-0 mt-2' : 'right-0 mt-2 min-w-[10.5rem]',
            )}
          >
            {languages.map((lang, index) => {
              const selected = currentLang === lang.code
              return (
                <button
                  key={lang.code}
                  ref={(element) => {
                    optionRefs.current[index] = element
                  }}
                  type="button"
                  role="menuitemradio"
                  aria-checked={selected}
                  onClick={() => changeLanguage(lang.code)}
                  className={cn(
                    'flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                    selected ? 'bg-primary/10 text-ink' : 'text-muted hover:bg-[var(--overlay-softer)] hover:text-ink',
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    {lang.flag}
                    <span className="font-medium">{t(lang.labelKey)}</span>
                  </span>
                  {selected && <Check aria-hidden="true" className="h-4 w-4 text-primary" />}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const scrolled = useScrolled(24)
  const active = useActiveSection(sectionIds)
  const { scrollYProgress } = useScroll()
  const currentLang = (i18n.resolvedLanguage || i18n.language || 'en').startsWith('km') ? 'km' : 'en'

  const changeLanguage = (lang) => {
    const y = window.scrollY
    i18n.changeLanguage(lang)
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
    const onClick = (event) => {
      if (!(event.target instanceof Element)) return
      if (!event.target.closest('[data-language-switcher]')) setLangOpen(false)
    }

    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const activeLang = languages.find((language) => language.code === currentLang) || languages[0]

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
              <span className="font-display text-sm font-semibold tracking-tight text-ink">{personalInfo.name}</span>
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
                  aria-current={isActive ? 'location' : undefined}
                  className={cn(
                    'group relative rounded-lg px-2.5 py-2 text-sm transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60',
                    isActive ? 'text-ink' : 'text-muted hover:text-ink',
                  )}
                >
                  {t(`navbar.${link.id}`)}
                  {isActive ? (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-2 -bottom-px h-px bg-gradient-to-r from-primary via-cyan to-violet"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  ) : (
                    <span className="absolute inset-x-2 -bottom-px h-px origin-left scale-x-0 bg-[var(--overlay-border)] transition-transform duration-300 group-hover:scale-x-100" />
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
                idPrefix="desktop"
              />
            </div>
            <ThemeToggle />

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-navigation"
              aria-label={open ? t('a11y.closeMenu') : t('a11y.openMenu')}
              className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--overlay-border)] bg-[var(--overlay-soft)] text-ink transition-colors hover:border-primary/40 hover:text-primary lg:hidden"
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
                className="absolute inset-x-0 top-[calc(100%+0.3rem)] z-50 lg:hidden"
              >
                <div className="max-h-[calc(100vh-6rem)] overflow-y-auto rounded-2xl border border-[var(--overlay-border)] bg-[var(--overlay-strong)] p-3 shadow-[var(--shadow-glow)] backdrop-blur-2xl">
                  <nav aria-label={t('a11y.mobileNav')} className="flex flex-col">
                    {navLinks.map((link, index) => {
                      const isActive = active === link.id
                      return (
                        <a
                          key={link.id}
                          href={`#${link.id}`}
                          onClick={() => setOpen(false)}
                          aria-current={isActive ? 'location' : undefined}
                          className={cn(
                            'flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors',
                            isActive
                              ? 'bg-primary/10 text-ink'
                              : 'text-muted hover:bg-[var(--overlay-softer)] hover:text-ink',
                          )}
                        >
                          <span className="flex items-center gap-3">
                            <span className="font-mono text-[10px] text-primary/70">{String(index + 1).padStart(2, '0')}</span>
                            {t(`navbar.${link.id}`)}
                          </span>
                          {isActive && <ArrowUpRight aria-hidden="true" className="h-4 w-4 text-primary" />}
                        </a>
                      )
                    })}
                  </nav>

                  <div className="mt-3 space-y-2 border-t border-[var(--overlay-border-soft)] pt-3">
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
                        idPrefix="mobile"
                      />
                    </div>
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
