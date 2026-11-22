import { FolderPlus, Pencil, Mail, Sparkles, MessageSquare } from 'lucide-react'
import { cn } from '../../../utils/cn'

const meta = {
  project_created: { icon: FolderPlus, color: 'text-emerald-300 bg-emerald-400/10 border-emerald-400/20' },
  project_updated: { icon: Pencil, color: 'text-sky-300 bg-sky-400/10 border-sky-400/20' },
  message_new: { icon: Mail, color: 'text-cyan-300 bg-cyan-400/10 border-cyan-400/20' },
  skill_added: { icon: Sparkles, color: 'text-violet-300 bg-violet-400/10 border-violet-400/20' },
  message_status: { icon: MessageSquare, color: 'text-amber-300 bg-amber-400/10 border-amber-400/20' },
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.max(1, Math.floor(diff / 60000))
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

export default function RecentActivity({ items = [] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => {
        const m = meta[item.type] || meta.project_updated
        const Icon = m.icon
        return (
          <li key={item.id} className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 [html[data-theme='light']_&]:bg-slate-50/70">
            <span className={cn('mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl border', m.color)}>
              <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-[var(--text-soft)]">{item.message}</p>
              <p className="mt-1 text-xs text-muted">{timeAgo(item.time)}</p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
