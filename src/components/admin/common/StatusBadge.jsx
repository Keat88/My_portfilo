import { cn } from '../../../utils/cn'

const variants = {
  New: 'border-sky-400/30 bg-sky-400/10 text-sky-200 [html[data-theme="light"]_&]:text-sky-700',
  Read: 'border-slate-400/30 bg-slate-400/10 text-slate-200 [html[data-theme="light"]_&]:text-slate-700',
  Replied: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200 [html[data-theme="light"]_&]:text-emerald-700',
  Archived: 'border-amber-400/30 bg-amber-400/10 text-amber-200 [html[data-theme="light"]_&]:text-amber-700',
  Published: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200 [html[data-theme="light"]_&]:text-emerald-700',
  Draft: 'border-slate-400/30 bg-slate-400/10 text-slate-200 [html[data-theme="light"]_&]:text-slate-700',
  Visible: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200 [html[data-theme="light"]_&]:text-emerald-700',
  Hidden: 'border-slate-400/30 bg-slate-400/10 text-slate-200 [html[data-theme="light"]_&]:text-slate-700',
  Featured: 'border-violet-400/30 bg-violet-400/10 text-violet-200 [html[data-theme="light"]_&]:text-violet-700',
}

export default function StatusBadge({ status, className }) {
  return (
    <span className={cn('inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium', variants[status] || 'border-white/10 bg-white/5 text-muted', className)}>
      {status}
    </span>
  )
}
