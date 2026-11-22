import { useEffect, useMemo, useState } from 'react'
import { Mail, Inbox, MailOpen, Reply, Archive, Trash2 } from 'lucide-react'
import PageHeader, { GlassCard, MockDataBadge } from '../../components/admin/common/PageHeader'
import SearchBar, { FilterSelect } from '../../components/admin/common/SearchFilter'
import StatusBadge from '../../components/admin/common/StatusBadge'
import ConfirmDialog from '../../components/admin/common/ConfirmDialog'
import Pagination from '../../components/admin/common/Pagination'
import { EmptyState, ErrorState } from '../../components/admin/common/States'
import { Button } from '../../components/admin/forms/FormControls'
import StatCard from '../../components/admin/dashboard/StatCard'
import { useToast } from '../../components/admin/common/ToastProvider'
import { useDebouncedValue, usePagination } from '../../hooks/admin/useAdmin'
import { mockMessages } from '../../data/admin/mockData'
import { adminApi, formatApiError } from '../../services/adminApi'
import { formatDate, formatDateTime } from '../../components/admin/utils/format'
import { cn } from '../../utils/cn'

const STATUSES = ['New', 'Read', 'Replied', 'Archived']

export default function MessagesPage() {
  const toast = useToast()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState('mock')
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [selected, setSelected] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const debounced = useDebouncedValue(query, 250)

  const load = async () => {
    setLoading(true); setError(null)
    try {
      const d = await adminApi.getMessages()
      setItems(Array.isArray(d) ? d : (d?.items || []))
      setSource('live')
    } catch (e) {
      setItems(mockMessages)
      setSource('mock')
      if (e?.status >= 500) setError(formatApiError(e))
    } finally { setLoading(false) }
  }
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const d = await adminApi.getMessages()
        if (cancelled) return
        setItems(Array.isArray(d) ? d : (d?.items || []))
        setSource('live')
      } catch (e) {
        if (cancelled) return
        setItems(mockMessages)
        setSource('mock')
        if (e?.status >= 500) setError(formatApiError(e))
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  const counts = useMemo(() => ({
    total: items.length,
    unread: items.filter((m) => m.status === 'New').length,
    new: items.filter((m) => m.status === 'New').length,
    replied: items.filter((m) => m.status === 'Replied').length,
    archived: items.filter((m) => m.status === 'Archived').length,
  }), [items])

  const filtered = useMemo(() => {
    const q = debounced.toLowerCase()
    return items.filter((m) => {
      if (status !== 'all' && m.status !== status) return false
      if (q && !`${m.name} ${m.email} ${m.subject} ${m.message}`.toLowerCase().includes(q)) return false
      return true
    }).sort((a,b)=> new Date(b.date) - new Date(a.date))
  }, [items, debounced, status])

  const { page, setPage, totalPages, pageItems } = usePagination(filtered, 8)
  useEffect(() => { setPage(1) }, [debounced, status, setPage])

  const updateStatus = async (msg, nextStatus) => {
    try {
      if (source === 'live') { await adminApi.updateMessageStatus(msg.id, nextStatus); await load() }
      else setItems((prev) => prev.map((m) => m.id === msg.id ? { ...m, status: nextStatus } : m))
      setSelected((s) => s && s.id === msg.id ? { ...s, status: nextStatus } : s)
      toast.success(`Message marked as ${nextStatus} (UI state).`)
    } catch (e) { toast.error(formatApiError(e)) }
  }

  const openDetail = async (msg) => {
    setSelected(msg)
    if (msg.status === 'New') await updateStatus(msg, 'Read')
  }

  const doDelete = async () => {
    const msg = confirm
    if (!msg) return
    try {
      if (source === 'live') { await adminApi.deleteMessage(msg.id); await load() }
      else setItems((prev) => prev.filter((m) => m.id !== msg.id))
      if (selected?.id === msg.id) setSelected(null)
      toast.success('Message deleted (UI state).')
    } catch (e) { toast.error(formatApiError(e)) }
    finally { setConfirm(null) }
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Communication" title="Contact Messages" description="Review and manage inquiries from your portfolio contact form.">
        {source === 'mock' && <div className="mt-2"><MockDataBadge /></div>}
      </PageHeader>
      {error && <ErrorState message={error} onRetry={load} />}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard icon={Inbox} label="Total Messages" value={counts.total} description="All received" accent="from-primary/20 to-cyan/5" />
        <StatCard icon={MailOpen} label="Unread" value={counts.unread} description="Need attention" accent="from-amber-400/20 to-orange-500/5" />
        <StatCard icon={Mail} label="New" value={counts.new} description="New inquiries" accent="from-sky-400/20 to-cyan/5" />
        <StatCard icon={Reply} label="Replied" value={counts.replied} description="Responded" accent="from-emerald-400/20 to-teal-500/5" />
        <StatCard icon={Archive} label="Archived" value={counts.archived} description="Stored away" accent="from-slate-400/20 to-slate-500/5" />
      </section>

      <GlassCard hover={false} className="overflow-hidden p-0">
        <div className="border-b border-white/10 p-4 sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row">
              <SearchBar value={query} onChange={setQuery} placeholder="Search messages..." className="sm:max-w-xs" />
              <FilterSelect value={status} onChange={setStatus} ariaLabel="Filter by status" options={[{ value: 'all', label: 'All statuses' }, ...STATUSES.map((s)=>({value:s,label:s}))]} />
            </div>
            <p className="text-sm text-muted">{filtered.length} message(s)</p>
          </div>
        </div>

        <div className="grid min-h-[28rem] lg:grid-cols-[1.05fr_0.95fr]">
          <div className={cn('border-b border-white/10 lg:border-b-0 lg:border-r', !selected && 'lg:col-span-2 lg:border-r-0')}>
            {loading ? (
              <div className="space-y-2 p-4">{Array.from({length:6}).map((_,i)=><div key={i} className="h-20 animate-pulse rounded-xl bg-white/5" />)}</div>
            ) : pageItems.length === 0 ? (
              <div className="p-6"><EmptyState icon={Mail} title="No messages found" description="Try a different search or filter." /></div>
            ) : (
              <ul className="divide-y divide-white/5">
                {pageItems.map((m) => (
                  <li key={m.id}>
                    <button type="button" onClick={() => openDetail(m)} className={cn('flex w-full items-start gap-3 p-4 text-left transition hover:bg-white/[0.03]', selected?.id === m.id && 'bg-primary/5', m.status === 'New' && 'bg-white/[0.015]')}>
                      <span className={cn('mt-1 h-2.5 w-2.5 shrink-0 rounded-full', m.status === 'New' ? 'bg-primary shadow-[0_0_10px_rgba(56,189,248,0.8)]' : 'bg-white/15')} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className={cn('truncate text-sm', m.status === 'New' ? 'font-semibold text-ink' : 'font-medium text-[var(--text-soft)]')}>{m.name}</p>
                          <span className="shrink-0 text-xs text-muted">{formatDate(m.date)}</span>
                        </div>
                        <p className="truncate text-xs text-muted">{m.email}</p>
                        <p className={cn('mt-1 truncate text-sm', m.status === 'New' ? 'text-ink' : 'text-[var(--text-soft)]')}>{m.subject}</p>
                        <p className="mt-0.5 line-clamp-1 text-xs text-muted">{m.message}</p>
                        <div className="mt-2"><StatusBadge status={m.status} /></div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>

          {selected && (
            <div className="flex min-h-[24rem] flex-col bg-white/[0.01]">
              <div className="flex items-start justify-between gap-3 border-b border-white/10 p-4 sm:p-5">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-lg font-semibold text-ink">{selected.subject}</h3>
                    <StatusBadge status={selected.status} />
                  </div>
                  <p className="mt-1 text-sm text-[var(--text-soft)]">{selected.name} <span className="text-muted">&lt;{selected.email}&gt;</span></p>
                  <p className="mt-0.5 text-xs text-muted">Received {formatDateTime(selected.date)}</p>
                </div>
                <button type="button" onClick={() => setSelected(null)} className="rounded-lg px-2 py-1 text-sm text-muted hover:bg-white/5 hover:text-ink lg:hidden">Close</button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 sm:p-5">
                <div className="rounded-2xl border border-white/10 bg-[var(--card)]/50 p-4 text-sm leading-relaxed text-[var(--text-soft)] whitespace-pre-wrap [html[data-theme='light']_&]:bg-white">
                  {selected.message}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 border-t border-white/10 p-4">
                <Button variant="secondary" size="sm" onClick={() => updateStatus(selected, 'Read')} disabled={selected.status === 'Read'}><MailOpen className="h-3.5 w-3.5" /> Mark as read</Button>
                <Button variant="secondary" size="sm" onClick={() => updateStatus(selected, 'Replied')} disabled={selected.status === 'Replied'}><Reply className="h-3.5 w-3.5" /> Mark as replied</Button>
                <Button variant="secondary" size="sm" onClick={() => updateStatus(selected, 'Archived')} disabled={selected.status === 'Archived'}><Archive className="h-3.5 w-3.5" /> Archive</Button>
                <Button variant="danger" size="sm" onClick={() => setConfirm(selected)}><Trash2 className="h-3.5 w-3.5" /> Delete</Button>
              </div>
            </div>
          )}
        </div>
      </GlassCard>

      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={doDelete} danger title="Delete message" message={`Delete message from "${confirm?.name}"? This cannot be undone.`} confirmLabel="Delete" />
    </div>
  )
}

