
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import { ArrowUpRight, ExternalLink, ImageOff, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FaGithub } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import ScrollReveal from '../animations/ScrollReveal'
import SectionHeading from '../common/SectionHeading'
import Container from '../layout/Container'
import { projects } from '../../data/projects'
import { cn } from '../../utils/cn'

const filters = ['all', 'web', 'system', 'api']

function statusLabel(project, t) {
  if (project.status === 'In Progress') return t('projects.status.inProgress')
  if (project.status === 'Completed') return t('projects.status.completed')
  return project.status
}

function highlightLabel(project, key, index, t) {
  return t(`projects.items.${project.id}.highlights.${key}`, {
    defaultValue: project.highlights[index] ?? key,
  })
}

function ProjectLinks({ project, t, compact = false }) {
  const hasGithub = Boolean(project.githubUrl)
  const hasLive = Boolean(project.liveUrl)
  const baseClass = cn(
    'inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300',
    compact ? 'w-full sm:w-auto' : '',
  )

  return (
    <div className="flex flex-wrap gap-2.5">
      {hasGithub ? (
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noreferrer noopener"
          className={cn(
            baseClass,
            'border-[var(--overlay-border)] bg-[var(--overlay-soft)] text-ink hover:-translate-y-0.5 hover:border-primary/45 hover:bg-primary/10',
          )}
        >
          <FaGithub className="h-4 w-4" aria-hidden="true" />
          {t('projects.github')}
        </a>
      ) : (
        <span className={cn(baseClass, 'cursor-not-allowed border-[var(--overlay-border-soft)] bg-[var(--overlay-softer)] text-muted/60')} aria-disabled="true">
          <FaGithub className="h-4 w-4" aria-hidden="true" />
          {t('projects.github')}
        </span>
      )}

      {hasLive ? (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noreferrer noopener"
          className={cn(
            baseClass,
            'border-primary/40 bg-primary/10 text-ink hover:-translate-y-0.5 hover:border-primary/60 hover:bg-primary/15',
          )}
        >
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
          {t('projects.liveDemo')}
        </a>
      ) : (
        <span className={cn(baseClass, 'cursor-not-allowed border-[var(--overlay-border-soft)] bg-[var(--overlay-softer)] text-muted/60')} aria-disabled="true">
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
          {t('projects.liveDemo')}
        </span>
      )}
    </div>
  )
}

function ProjectCard({ project, index, featured, onOpen }) {
  const { t } = useTranslation()
  const reduce = useReducedMotion()
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [4, -4]), { stiffness: 180, damping: 20 })
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-4, 4]), { stiffness: 180, damping: 20 })
  const name = t(`projects.items.${project.id}.name`)
  const description = t(`projects.items.${project.id}.description`)

  const handlePointerMove = (event) => {
    if (reduce || event.pointerType === 'touch') return
    const rect = event.currentTarget.getBoundingClientRect()
    rawX.set((event.clientX - rect.left) / rect.width - 0.5)
    rawY.set((event.clientY - rect.top) / rect.height - 0.5)
  }

  const handlePointerLeave = () => {
    rawX.set(0)
    rawY.set(0)
  }

  return (
    <ScrollReveal delay={(index % 4) * 0.06} className={featured ? 'md:col-span-2' : undefined}>
      <motion.article
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 1100 }}
        className="group relative h-full overflow-hidden rounded-3xl border border-[var(--card-border)] bg-[var(--card-surface)] backdrop-blur-xl transition-[border-color,box-shadow] duration-500 hover:border-primary/35 hover:shadow-[0_28px_90px_-40px_rgba(56,189,248,0.65)]"
      >
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className={cn('flex h-full flex-col', featured && 'md:grid md:grid-cols-[1.08fr_0.92fr]')}>
          <div
            className={cn(
              'relative overflow-hidden border-b border-[var(--overlay-border-soft)] bg-gradient-to-br from-[var(--surface)] via-[var(--card)] to-[var(--surface)]',
              featured ? 'aspect-[16/10] md:aspect-auto md:min-h-[23rem] md:border-b-0 md:border-r' : 'aspect-[16/9]',
            )}
          >
            {project.image ? (
              <img
                src={project.image}
                alt={t('a11y.thumbnailAlt', { name })}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-muted">
                <div className="grid h-16 w-16 place-items-center rounded-2xl border border-[var(--overlay-border)] bg-[var(--overlay-soft)] text-primary/80">
                  <ImageOff className="h-7 w-7" aria-hidden="true" />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted/70">
                  {t('a11y.projectThumbnail')}
                </span>
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--hero-fade)]/60 via-transparent to-transparent opacity-80" />

            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-amber-200/90 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-300" />
                {statusLabel(project, t)}
              </span>
              <span className="inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-primary/90 backdrop-blur-sm">
                {t(`projects.category.${project.category}`)}
              </span>
            </div>
          </div>

          <div className="flex flex-1 flex-col p-6 sm:p-7">
            <h3 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">{name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>

            {project.highlightKeys.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[var(--text-soft)]">
                {project.highlightKeys.map((key, i) => (
                  <li key={key} className="flex items-center gap-1.5">
                    <span className="h-1 w-1 rounded-full bg-primary/70" />
                    {highlightLabel(project, key, i, t)}
                  </li>
                ))}
              </ul>
            )}

            <ul className="mt-5 flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <li
                  key={tech}
                  className="inline-flex items-center rounded-full border border-[var(--overlay-border-soft)] bg-[var(--overlay-softer)] px-3 py-1 text-[11px] font-medium text-[var(--text-soft)] transition-colors hover:border-primary/40 hover:text-ink"
                >
                  {tech}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => onOpen(project)}
                aria-label={t('a11y.openProjectDetails', { name })}
                className="inline-flex items-center gap-2 rounded-full border border-primary/35 bg-primary/10 px-4 py-2 text-sm font-medium text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/60 hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
              >
                {t('projects.viewDetails')}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </motion.article>
    </ScrollReveal>
  )
}

function ProjectDialog({ project, onClose }) {
  const { t } = useTranslation()
  const reduce = useReducedMotion()
  const panelRef = useRef(null)
  const closeRef = useRef(null)
  const name = t(`projects.items.${project.id}.name`)

  useEffect(() => {
    const previouslyFocused = document.activeElement
    closeRef.current?.focus()

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab' || !panelRef.current) return

      const focusable = Array.from(
        panelRef.current.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'),
      )
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      previouslyFocused?.focus?.()
    }
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[90] grid place-items-center p-4 sm:p-6"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={t('a11y.closeDialog')}
        className="absolute inset-0 cursor-default bg-slate-950/70 backdrop-blur-sm"
      />

      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-dialog-title"
        initial={reduce ? false : { opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduce ? undefined : { opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-[var(--card-border)] bg-[var(--overlay-strong)] p-6 shadow-[0_40px_120px_-40px_rgba(2,6,23,0.95)] backdrop-blur-2xl sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary/80">
              {t(`projects.category.${project.category}`)}
            </p>
            <h2 id="project-dialog-title" className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              {name}
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={t('a11y.closeDialog')}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[var(--overlay-border)] bg-[var(--overlay-soft)] text-muted transition-colors hover:border-primary/40 hover:text-ink"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-[var(--text-soft)]">
          {t(`projects.items.${project.id}.description`)}
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-[var(--overlay-border-soft)] bg-[var(--overlay-softer)] p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted/70">{t('projects.details.status')}</p>
            <p className="mt-2 text-sm font-medium text-ink">{statusLabel(project, t)}</p>
          </div>
          <div className="rounded-2xl border border-[var(--overlay-border-soft)] bg-[var(--overlay-softer)] p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted/70">{t('projects.details.technologies')}</p>
            <p className="mt-2 text-sm font-medium text-ink">{project.technologies.join(' · ')}</p>
          </div>
        </div>

        {project.highlightKeys.length > 0 && (
          <div className="mt-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted/70">{t('projects.details.features')}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {project.highlightKeys.map((key, index) => (
                <li
                  key={key}
                  className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-xs text-[var(--text-soft)]"
                >
                  {highlightLabel(project, key, index, t)}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted/70">{t('projects.details.title')}</p>
          <div className="mt-3">
            <ProjectLinks project={project} t={t} compact />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Projects() {
  const { t } = useTranslation()
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)
  const closeDialog = useCallback(() => setSelected(null), [])
  const visibleProjects = useMemo(
    () => (filter === 'all' ? projects : projects.filter((project) => project.category === filter)),
    [filter],
  )

  return (
    <section id="projects" className="relative py-16 sm:py-20">
      <Container>
        <ScrollReveal>
          <SectionHeading
            eyebrow={t('projects.eyebrow')}
            title={t('projects.title')}
            description={t('projects.description')}
            align="center"
            className="mb-8 sm:mb-10"
          />
        </ScrollReveal>

        <ScrollReveal delay={0.06}>
          <div className="mb-8 flex flex-wrap items-center justify-center gap-2" role="group" aria-label={t('projects.eyebrow')}>
            {filters.map((key) => {
              const active = filter === key
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilter(key)}
                  aria-pressed={active}
                  className={cn(
                    'relative rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-300',
                    active
                      ? 'border-primary/40 text-ink'
                      : 'border-[var(--overlay-border-soft)] text-muted hover:border-primary/30 hover:text-ink',
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="project-filter"
                      className="absolute inset-0 -z-10 rounded-full bg-primary/12"
                      transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                    />
                  )}
                  {t(`projects.filters.${key}`)}
                </button>
              )
            })}
            <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted/60">
              {t('projects.count', { count: visibleProjects.length })}
            </span>
          </div>
        </ScrollReveal>

        <motion.div layout className="grid gap-6 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {visibleProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                featured={filter === 'all' && index === 0}
                onOpen={setSelected}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </Container>

      <AnimatePresence>
        {selected && <ProjectDialog project={selected} onClose={closeDialog} />}
      </AnimatePresence>
    </section>
  )
}
