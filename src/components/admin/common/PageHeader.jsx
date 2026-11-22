import { motion } from 'framer-motion'
import { cn } from '../../../utils/cn'

export default function PageHeader({ eyebrow = 'Admin', title, description, actions, children }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.28em] text-primary/80">{eyebrow}</p>}
        <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{title}</h2>
        {description && <p className="mt-1.5 max-w-2xl text-sm text-muted">{description}</p>}
        {children}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

export function GlassCard({ className, children, hover = true, ...props }) {
  return (
    <motion.div
      whileHover={hover ? { y: -2 } : undefined}
      transition={{ duration: 0.2 }}
      className={cn(
        'relative overflow-hidden rounded-2xl border border-white/10 bg-[var(--card)]/80 p-5 shadow-[0_18px_50px_-30px_rgba(2,6,23,0.8)] backdrop-blur-xl',
        '[html[data-theme="light"]_&]:bg-white/90 [html[data-theme="light"]_&]:shadow-[0_12px_40px_-24px_rgba(15,23,42,0.18)]',
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function MockDataBadge({ className, label = 'Mock data (UI preview)' }) {
  return (
    <span className={cn('inline-flex items-center rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-amber-200 [html[data-theme="light"]_&]:text-amber-700', className)}>
      {label}
    </span>
  )
}
