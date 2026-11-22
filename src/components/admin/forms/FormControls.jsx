import { cn } from '../../../utils/cn'

export function Field({ label, htmlFor, hint, error, required, children, className }) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label htmlFor={htmlFor} className="flex items-center gap-1 text-sm font-medium text-[var(--text-soft)]">
          {label} {required && <span className="text-primary">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
      {error && <p className="text-xs text-red-300 [html[data-theme='light']_&]:text-red-600">{error}</p>}
    </div>
  )
}

const baseInput = 'w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/60 transition focus:border-primary/40 focus:bg-white/[0.05] focus:outline-none focus:ring-1 focus:ring-primary/30 [html[data-theme="light"]_&]:bg-white [html[data-theme="light"]_&]:border-slate-200'

export function Input({ className, error, ...props }) {
  return <input className={cn(baseInput, error && 'border-red-400/40 focus:border-red-400/50 focus:ring-red-400/20', className)} {...props} />
}

export function Textarea({ className, error, ...props }) {
  return <textarea className={cn(baseInput, 'min-h-[110px] resize-y', error && 'border-red-400/40 focus:border-red-400/50 focus:ring-red-400/20', className)} {...props} />
}

export function Select({ className, error, children, ...props }) {
  return <select className={cn(baseInput, error && 'border-red-400/40', className)} {...props}>{children}</select>
}

export function Toggle({ checked, onChange, label, description, disabled }) {
  return (
    <label className={cn('flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3 transition hover:border-primary/30', disabled && 'cursor-not-allowed opacity-60')}>
      <span className="relative mt-0.5 inline-flex h-5 w-9 shrink-0 items-center">
        <input type="checkbox" className="peer sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} disabled={disabled} />
        <span className="h-5 w-9 rounded-full bg-white/10 transition peer-checked:bg-primary/70 peer-focus-visible:ring-2 peer-focus-visible:ring-primary/40 [html[data-theme='light']_&]:bg-slate-200" />
        <span className="absolute left-0.5 h-4 w-4 rounded-full bg-white shadow transition peer-checked:translate-x-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-ink">{label}</span>
        {description && <span className="mt-0.5 block text-xs text-muted">{description}</span>}
      </span>
    </label>
  )
}

export function Button({ children, variant = 'primary', size = 'md', className, type = 'button', ...props }) {
  const variants = {
    primary: 'bg-gradient-to-r from-primary to-cyan text-slate-950 shadow-[0_12px_35px_-14px_rgba(56,189,248,0.8)] hover:brightness-110',
    secondary: 'border border-white/10 bg-white/[0.04] text-ink hover:border-primary/40 hover:bg-primary/10',
    ghost: 'text-muted hover:bg-white/5 hover:text-ink',
    danger: 'border border-red-400/30 bg-red-500/10 text-red-200 hover:bg-red-500/20 [html[data-theme="light"]_&]:text-red-700',
  }
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2.5 text-sm', lg: 'px-5 py-3 text-sm' }
  return (
    <button type={type} className={cn('inline-flex items-center justify-center gap-2 rounded-xl font-medium transition disabled:cursor-not-allowed disabled:opacity-60', variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  )
}
