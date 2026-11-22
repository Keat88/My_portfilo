import { useEffect, useMemo, useState } from 'react'
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Route as RouteIcon, Calendar, Building2 } from 'lucide-react'
import PageHeader, { GlassCard, MockDataBadge } from '../../components/admin/common/PageHeader'
import SearchBar from '../../components/admin/common/SearchFilter'
import StatusBadge from '../../components/admin/common/StatusBadge'
import Modal from '../../components/admin/common/Modal'
import ConfirmDialog from '../../components/admin/common/ConfirmDialog'
import { EmptyState, ErrorState } from '../../components/admin/common/States'
import { Field, Input, Textarea, Toggle, Button } from '../../components/admin/forms/FormControls'
import { useToast } from '../../components/admin/common/ToastProvider'
import { useDebouncedValue } from '../../hooks/admin/useAdmin'
import { mockExperiences } from '../../data/admin/mockData'
import { adminApi, formatApiError } from '../../services/adminApi'
import { formatDate } from '../../components/admin/utils/format'

const emptyForm = { title: '', description: '', organization: '', startDate: '', endDate: '', displayOrder: 0, visible: true }

export default function JourneyPage() {
  const toast = useToast()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState('mock')
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')
  const debounced = useDebouncedValue(query, 250)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [confirm, setConfirm] = useState(null)

  const load = async () => {
    setLoading(true); setError(null)
    try {
      const d = await adminApi.getExperiences()
      const list = Array.isArray(d) ? d : (d?.items || [])
      setItems([...list].sort((a,b)=>(a.displayOrder??0)-(b.displayOrder??0)))
      setSource('live')
    } catch (e) {
      setItems([...mockExperiences].sort((a,b)=>(a.displayOrder??0)-(b.displayOrder??0)))
      setSource('mock')
      if (e?.status >= 500) setError(formatApiError(e))
    } finally { setLoading(false) }
  }
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const d = await adminApi.getExperiences()
        if (cancelled) return
        const list = Array.isArray(d) ? d : (d?.items || [])
        setItems([...list].sort((a,b)=>(a.displayOrder??0)-(b.displayOrder??0)))
        setSource('live')
      } catch (e) {
        if (cancelled) return
        setItems([...mockExperiences].sort((a,b)=>(a.displayOrder??0)-(b.displayOrder??0)))
        setSource('mock')
        if (e?.status >= 500) setError(formatApiError(e))
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  const filtered = useMemo(() => {
    if (!debounced) return items
    const q = debounced.toLowerCase()
    return items.filter((i) => `${i.title} ${i.organization} ${i.description}`.toLowerCase().includes(q))
  }, [items, debounced])

  const openCreate = () => { setEditing(null); setForm({ ...emptyForm, displayOrder: items.length + 1 }); setErrors({}); setModalOpen(true) }
  const openEdit = (it) => { setEditing(it); setForm({ title: it.title||'', description: it.description||'', organization: it.organization||'', startDate: (it.startDate||'').slice(0,10), endDate: (it.endDate||'').slice(0,10), displayOrder: it.displayOrder??0, visible: it.visible !== false }); setErrors({}); setModalOpen(true) }

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required.'
    if (!form.organization.trim()) e.organization = 'Organization is required.'
    if (!form.startDate) e.startDate = 'Start date is required.'
    if (form.endDate && form.startDate && form.endDate < form.startDate) e.endDate = 'End date cannot be before start date.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const persistLocalOrder = (next) => setItems(next.map((it, idx) => ({ ...it, displayOrder: idx + 1 })))

  const save = async () => {
    if (!validate()) return
    const payload = { ...form, title: form.title.trim(), description: form.description.trim(), organization: form.organization.trim(), endDate: form.endDate || null, displayOrder: Number(form.displayOrder)||0 }
    try {
      if (source === 'live') {
        if (editing) await adminApi.updateExperience(editing.id, payload)
        else await adminApi.createExperience(payload)
        await load()
      } else {
        if (editing) setItems((prev)=>prev.map((x)=>x.id===editing.id?{...x,...payload}:x).sort((a,b)=>(a.displayOrder??0)-(b.displayOrder??0)))
        else setItems((prev)=>[...prev,{id:Date.now(),...payload}].sort((a,b)=>(a.displayOrder??0)-(b.displayOrder??0)))
      }
      toast.success(editing ? 'Milestone updated (UI state).' : 'Milestone added (UI state).')
      setModalOpen(false)
    } catch (e) { toast.error(formatApiError(e)) }
  }

  const doDelete = async () => {
    try {
      if (source === 'live') { await adminApi.deleteExperience(confirm.id); await load() }
      else persistLocalOrder(items.filter((x)=>x.id!==confirm.id))
      toast.success('Milestone deleted (UI state).')
    } catch (e) { toast.error(formatApiError(e)) }
    finally { setConfirm(null) }
  }

  const move = async (index, dir) => {
    const nextIndex = index + dir
    if (nextIndex < 0 || nextIndex >= items.length) return
    const copy = [...items]
    const [moved] = copy.splice(index, 1)
    copy.splice(nextIndex, 0, moved)
    const ordered = copy.map((it, idx) => ({ ...it, displayOrder: idx + 1 }))
    setItems(ordered)
    if (source === 'live') {
      try {
        await Promise.all([ordered[index], ordered[nextIndex]].map((it) => adminApi.updateExperience(it.id, { displayOrder: it.displayOrder })))
      } catch (e) { toast.error(formatApiError(e)); load() }
    } else {
      toast.info('Milestone order updated (UI state).')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Content Management" title="Development Journey" description="Manage timeline milestones that showcase your growth and experience." actions={<Button onClick={openCreate}><Plus className="h-4 w-4" /> Add Milestone</Button>}>
        {source === 'mock' && <div className="mt-2"><MockDataBadge /></div>}
      </PageHeader>
      {error && <ErrorState message={error} onRetry={load} />}
      <GlassCard hover={false} className="p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SearchBar value={query} onChange={setQuery} placeholder="Search milestones..." className="sm:max-w-xs" />
          <p className="text-sm text-muted">{filtered.length} milestone(s)</p>
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="space-y-4">{Array.from({length:4}).map((_,i)=><div key={i} className="h-28 animate-pulse rounded-2xl bg-white/5" />)}</div>
          ) : filtered.length === 0 ? (
            <EmptyState icon={RouteIcon} title="No milestones found" description="Add milestones to build your development journey timeline." action={<Button onClick={openCreate}><Plus className="h-4 w-4" /> Add Milestone</Button>} />
          ) : (
            <ol className="relative space-y-4 before:absolute before:left-[1.1rem] before:top-2 before:bottom-2 before:w-px before:bg-gradient-to-b before:from-primary/40 before:via-cyan/20 before:to-transparent sm:before:left-[1.35rem]">
              {filtered.map((it, idx) => {
                const actualIndex = items.findIndex((x) => x.id === it.id)
                return (
                  <li key={it.id} className="relative pl-10 sm:pl-12">
                    <span className="absolute left-2 top-5 grid h-5 w-5 place-items-center rounded-full border border-primary/40 bg-[var(--card)] text-primary shadow-[0_0_0_4px_rgba(56,189,248,0.08)] sm:left-2.5">
                      <span className="h-2 w-2 rounded-full bg-current" />
                    </span>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-primary/30 [html[data-theme='light']_&]:bg-slate-50/60 sm:p-5">
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-display text-lg font-semibold text-ink">{it.title}</h3>
                            <StatusBadge status={it.visible !== false ? 'Visible' : 'Hidden'} />
                            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-muted">Order {it.displayOrder ?? idx + 1}</span>
                          </div>
                          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
                            <span className="inline-flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" /> {it.organization}</span>
                            <span className="inline-flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {formatDate(it.startDate)} — {it.endDate ? formatDate(it.endDate) : 'Present'}</span>
                          </div>
                          {it.description && <p className="mt-2 text-sm leading-relaxed text-[var(--text-soft)]">{it.description}</p>}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                          <Button variant="secondary" size="sm" onClick={() => move(actualIndex, -1)} disabled={actualIndex <= 0} aria-label="Move up"><ArrowUp className="h-3.5 w-3.5" /></Button>
                          <Button variant="secondary" size="sm" onClick={() => move(actualIndex, 1)} disabled={actualIndex >= items.length - 1} aria-label="Move down"><ArrowDown className="h-3.5 w-3.5" /></Button>
                          <Button variant="secondary" size="sm" onClick={() => openEdit(it)}><Pencil className="h-3.5 w-3.5" /> Edit</Button>
                          <Button variant="danger" size="sm" onClick={() => setConfirm(it)}><Trash2 className="h-3.5 w-3.5" /> Delete</Button>
                        </div>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ol>
          )}
        </div>
      </GlassCard>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Milestone' : 'Add Milestone'} description="Timeline entry details." size="md"
        footer={<><Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={save}>{editing ? 'Save Changes' : 'Add Milestone'}</Button></>}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title" required error={errors.title} className="sm:col-span-2"><Input value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} placeholder="e.g. Weekend Student Intern" /></Field>
          <Field label="Organization" required error={errors.organization} className="sm:col-span-2"><Input value={form.organization} onChange={(e)=>setForm({...form,organization:e.target.value})} placeholder="e.g. ETEC Center" /></Field>
          <Field label="Description" className="sm:col-span-2"><Textarea value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} placeholder="What you did or achieved..." /></Field>
          <Field label="Start date" required error={errors.startDate}><Input type="date" value={form.startDate} onChange={(e)=>setForm({...form,startDate:e.target.value})} /></Field>
          <Field label="End date" hint="Leave empty if current/present" error={errors.endDate}><Input type="date" value={form.endDate} onChange={(e)=>setForm({...form,endDate:e.target.value})} /></Field>
          <Field label="Display order"><Input type="number" min="0" value={form.displayOrder} onChange={(e)=>setForm({...form,displayOrder:e.target.value})} /></Field>
          <div className="flex items-end"><Toggle checked={form.visible} onChange={(v)=>setForm({...form,visible:v})} label="Visible" description="Show on public portfolio." /></div>
        </div>
      </Modal>
      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={doDelete} danger title="Delete milestone" message={`Delete "${confirm?.title}"?`} confirmLabel="Delete" />
    </div>
  )
}

