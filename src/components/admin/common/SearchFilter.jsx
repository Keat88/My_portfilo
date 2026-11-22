import { Search } from 'lucide-react'
import { cn } from '../../../utils/cn'

export default function SearchBar({ value, onChange, placeholder = 'Search...', className }) {
  return (
    <label className={cn('relative block', className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-muted/60 focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/30 [html[data-theme='light']_&]:bg-white"
      />
    </label>
  )
}

export function FilterSelect({ value, onChange, options, className, ariaLabel }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={ariaLabel}
      className={cn('rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-ink focus:border-primary/40 focus:outline-none [html[data-theme="light"]_&]:bg-white', className)}
    >
      {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
  )
}
