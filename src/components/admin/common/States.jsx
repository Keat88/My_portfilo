import { cn } from '../../../utils/cn'

export default function LoadingSkeleton({ className }) {
  return <div className={cn('animate-pulse rounded-xl bg-white/10 [html[data-theme="light"]_&]:bg-slate-200/70', className)} />
}

export function EmptyState({ icon: Icon, title = 'Nothing here yet', description = 'No data available.', action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-12 text-center [html[data-theme='light']_&]:bg-white/60">
      {Icon && <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/5 text-muted"><Icon className="h-5 w-5" /></div>}
      <h3 className="font-display text-base font-semibold text-ink">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-muted">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function ErrorState({ message = 'Failed to load data.', onRetry }) {
  return (
    <div className="rounded-2xl border border-red-400/20 bg-red-400/5 px-5 py-6 text-center">
      <p className="text-sm text-red-200 [html[data-theme='light']_&]:text-red-700">{message}</p>
      {onRetry && <button type="button" onClick={onRetry} className="mt-3 rounded-lg border border-red-400/30 px-3 py-1.5 text-sm text-red-100 hover:bg-red-400/10 [html[data-theme='light']_&]:text-red-700">Retry</button>}
    </div>
  )
}
