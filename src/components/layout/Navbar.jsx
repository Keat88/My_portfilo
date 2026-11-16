import { AnimatePresence, motion, useScroll } from 'framer-motion'
import { ArrowUpRight, Download, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { navLinks } from '../../data/navigation'
import { personalInfo } from '../../data/personalInfo'
import { useActiveSection } from '../../hooks/useActiveSection'
import { useScrolled } from '../../hooks/useScrolled'
import { cn } from '../../utils/cn'
import Button from '../common/Button'

const sectionIds = navLinks.map((link) => link.id)

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const scrolled = useScrolled(24)
  const active = useActiveSection(sectionIds)
  const { scrollYProgress } = useScroll()

  useEffect(() => {
    if (!open) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

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
              ? 'border-white/10 bg-[#070b1c]/85 shadow-[0_20px_60px_-25px_rgba(2,6,23,0.9)] backdrop-blur-xl'
              : 'border-white/[0.06] bg-white/[0.03] backdrop-blur-md',
          )}
        >
          <a
            href="#home"
            className="group flex items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
            aria-label={`${personalInfo.name} — home`}
          >
            <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary via-cyan to-violet p-px shadow-[0_0_24px_-6px_rgba(56,189,248,0.8)] transition-shadow duration-300 group-hover:shadow-[0_0_30px_-4px_rgba(168,85,247,0.8)]">
              <span className="grid h-full w-full place-items-center rounded-[11px] bg-[#070c1c] font-display text-[11px] font-bold tracking-wide text-ink">
                {personalInfo.initials}
              </span>
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-sm font-semibold tracking-tight text-ink">
                {personalInfo.name}
              </span>
              <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.28em] text-muted/70">
                Portfolio
              </span>
            </span>
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
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
                  {link.label}
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
            <div className="hidden md:block">
              <Button
                href={personalInfo.cvUrl}
                download
                size="sm"
                icon={Download}
                iconPosition="left"
              >
                Download CV
              </Button>
            </div>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-navigation"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-ink transition-colors hover:border-primary/40 hover:text-primary lg:hidden"
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
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#070b1c]/95 p-3 shadow-[0_30px_80px_-30px_rgba(2,6,23,1)] backdrop-blur-2xl">
                  <nav aria-label="Mobile" className="flex flex-col">
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
                            {link.label}
                          </span>
                          {isActive && <ArrowUpRight aria-hidden="true" className="h-4 w-4 text-primary" />}
                        </a>
                      )
                    })}
                  </nav>

                  <div className="mt-2 border-t border-white/5 pt-3">
                    <Button
                      href={personalInfo.cvUrl}
                      download
                      size="md"
                      icon={Download}
                      iconPosition="left"
                      className="w-full"
                    >
                      Download CV
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
