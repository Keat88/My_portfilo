import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'
import { cn } from '../../../utils/cn'

export default function StatCard({ icon: Icon, label, value, description, trend, accent = 'from-primary/20 to-cyan/5', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      whileHover={{ y: -3 }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[var(--card)]/80 p-5 backdrop-blur-xl [html[data-theme='light']_&]:bg-white/90"
    >
      <div className={cn('pointer-events-none absolute inset-0 bg-gradient-to-br opacity-80', accent)} />
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/10 blur-2xl transition-opacity group-hover:opacity-100 opacity-60" />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">{label}</p>
          <p className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink">{value}</p>
          {description && <p className="mt-1 text-xs text-muted">{description}</p>}
        </div>
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-primary shadow-[0_0_24px_-10px_rgba(56,189,248,0.8)]">
          {Icon && <Icon className="h-5 w-5" aria-hidden="true" />}
        </div>
      </div>
      {trend && (
        <div className="relative mt-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-[11px] text-emerald-200 [html[data-theme='light']_&]:text-emerald-700">
          <TrendingUp className="h-3.5 w-3.5" /> {trend}
        </div>
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition group-hover:opacity-100" />
    </motion.div>
  )
}
