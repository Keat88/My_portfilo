import { Eye } from 'lucide-react'
import StatusBadge from '../common/StatusBadge'
import { formatDate } from '../utils/format'

export default function RecentMessages({ messages = [], onView }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-xs uppercase tracking-[0.14em] text-muted">
            <th className="px-3 py-3 font-medium">Name</th>
            <th className="px-3 py-3 font-medium">Email</th>
            <th className="px-3 py-3 font-medium">Subject</th>
            <th className="px-3 py-3 font-medium">Date</th>
            <th className="px-3 py-3 font-medium">Status</th>
            <th className="px-3 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((m) => (
            <tr key={m.id} className="border-b border-white/5 transition hover:bg-white/[0.03]">
              <td className="px-3 py-3 font-medium text-ink">{m.name}</td>
              <td className="px-3 py-3 text-muted">{m.email}</td>
              <td className="max-w-[14rem] truncate px-3 py-3 text-[var(--text-soft)]" title={m.subject}>{m.subject}</td>
              <td className="whitespace-nowrap px-3 py-3 text-muted">{formatDate(m.date)}</td>
              <td className="px-3 py-3"><StatusBadge status={m.status} /></td>
              <td className="px-3 py-3 text-right">
                <button type="button" onClick={() => onView?.(m)} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-muted hover:border-primary/40 hover:text-primary">
                  <Eye className="h-3.5 w-3.5" /> View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

