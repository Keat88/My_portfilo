import { useEffect, useMemo, useState } from 'react'
import { Plus, Pencil, Trash2, Briefcase } from 'lucide-react'
import PageHeader, { GlassCard, MockDataBadge } from '../../components/admin/common/PageHeader'
import SearchBar from '../../components/admin/common/SearchFilter'
import StatusBadge from '../../components/admin/common/StatusBadge'
import Modal from '../../components/admin/common/Modal'
import ConfirmDialog from '../../components/admin/common/ConfirmDialog'
import { EmptyState, ErrorState } from '../../components/admin/common/States'
import { Field, Input, Textarea, Toggle, Button } from '../../components/admin/forms/FormControls'
import { useToast } from '../../components/admin/common/ToastProvider'
import { useDebouncedValue } from '../../hooks/admin/useAdmin'
import { mockServices } from '../../data/admin/mockData'
import { adminApi, formatApiError } from '../../services/adminApi'

const emptyForm = { title: '', description: '', icon: '', displayOrder: 0, visible: true }

export default function ServicesPage() {
  const toast = useToast()
  const [items, setItems] = useState([]); const [loading, setLoading] = useState(true)
  const [source, setSource] = useState('mock'); const [error, setError] = useState(null)
  const [query, setQuery] = useState(''); const debounced = useDebouncedValue(query, 250)
  const [modalOpen, setModalOpen] = useState(false); const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm); const [errors, setErrors] = useState({})
  const [confirm, setConfirm] = useState(null)

  const load = async () => { setLoading(true); setError(null); try { const d = await adminApi.getServices(); setItems(Array.isArray(d)?d:(d?.items||[])); setSource('live') } catch(e){ setItems(mockServices); setSource('mock'); if(e?.status>=500) setError(formatApiError(e)) } finally { setLoading(false) } }
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const d = await adminApi.getServices()
        if (cancelled) return
        setItems(Array.isArray(d)?d:(d?.items||[]))
        setSource('live')
      } catch (e) {
        if (cancelled) return
        setItems(mockServices)
        setSource('mock')
        if (e?.status >= 500) setError(formatApiError(e))
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  const filtered = useMemo(()=> items.filter((s)=> !debounced || `${s.title} ${s.description}`.toLowerCase().includes(debounced.toLowerCase())).sort((a,b)=>(a.displayOrder??0)-(b.displayOrder??0)), [items, debounced])
  const openCreate = ()=>{ setEditing(null); setForm({...emptyForm, displayOrder: items.length+1}); setErrors({}); setModalOpen(true) }
  const openEdit = (s)=>{ setEditing(s); setForm({ title:s.title||'', description:s.description||'', icon:s.icon||'', displayOrder:s.displayOrder??0, visible:s.visible!==false }); setErrors({}); setModalOpen(true) }
  const validate = ()=>{ const e={}; if(!form.title.trim()) e.title='Service title is required.'; if(!form.description.trim()) e.description='Description is required.'; setErrors(e); return !Object.keys(e).length }
  const save = async ()=>{ if(!validate()) return; const payload={...form,title:form.title.trim(),description:form.description.trim(),icon:form.icon.trim(),displayOrder:Number(form.displayOrder)||0}; try{ if(source==='live'){ editing?await adminApi.updateService(editing.id,payload):await adminApi.createService(payload); await load() } else setItems((p)=> editing ? p.map((x)=>x.id===editing.id?{...x,...payload}:x) : [...p,{id:Date.now(),...payload}]); toast.success(editing?'Service updated (UI state).':'Service created (UI state).'); setModalOpen(false) } catch(e){ toast.error(formatApiError(e)) } }
  const doDelete = async ()=>{ try{ if(source==='live'){ await adminApi.deleteService(confirm.id); await load() } else setItems((p)=>p.filter((x)=>x.id!==confirm.id)); toast.success('Service deleted (UI state).') } catch(e){ toast.error(formatApiError(e)) } finally { setConfirm(null) } }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Content Management" title="Services" description="Define the services you offer and control their visibility." actions={<Button onClick={openCreate}><Plus className="h-4 w-4" /> Add Service</Button>}>
        {source === 'mock' && <div className="mt-2"><MockDataBadge /></div>}
      </PageHeader>
      {error && <ErrorState message={error} onRetry={load} />}
      <GlassCard hover={false} className="p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SearchBar value={query} onChange={setQuery} placeholder="Search services..." className="sm:max-w-xs" />
          <p className="text-sm text-muted">{filtered.length} service(s)</p>
        </div>
        <div className="mt-5">
          {loading ? <div className="grid gap-4 md:grid-cols-2">{Array.from({length:4}).map((_,i)=><div key={i} className="h-40 animate-pulse rounded-2xl bg-white/5" />)}</div>
          : filtered.length===0 ? <EmptyState icon={Briefcase} title="No services found" description="Add a service to describe what you offer." action={<Button onClick={openCreate}><Plus className="h-4 w-4" /> Add Service</Button>} />
          : (
            <div className="grid gap-4 md:grid-cols-2">
              {filtered.map((s)=> (
                <article key={s.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-primary/30 [html[data-theme='light']_&]:bg-slate-50/60">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-primary/30 bg-primary/10 text-primary"><Briefcase className="h-5 w-5" /></div>
                      <div className="min-w-0">
                        <h3 className="font-display text-lg font-semibold text-ink">{s.title}</h3>
                        <p className="mt-1 text-sm text-muted">{s.description}</p>
                      </div>
                    </div>
                    <StatusBadge status={s.visible!==false?'Visible':'Hidden'} />
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-muted">
                    <span>Icon: <span className="font-mono text-[11px] text-[var(--text-soft)]">{s.icon||'—'}</span></span>
                    <span>Order: {s.displayOrder??0}</span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="secondary" size="sm" onClick={()=>openEdit(s)}><Pencil className="h-3.5 w-3.5" /> Edit</Button>
                    <Button variant="danger" size="sm" onClick={()=>setConfirm(s)}><Trash2 className="h-3.5 w-3.5" /> Delete</Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </GlassCard>

      <Modal open={modalOpen} onClose={()=>setModalOpen(false)} title={editing?'Edit Service':'Add Service'} description="Service details shown to visitors." size="md"
        footer={<><Button variant="ghost" onClick={()=>setModalOpen(false)}>Cancel</Button><Button onClick={save}>{editing?'Save Changes':'Create Service'}</Button></>}>
        <div className="grid gap-4">
          <Field label="Service title" required error={errors.title}><Input value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} placeholder="e.g. Backend Development" /></Field>
          <Field label="Description" required error={errors.description}><Textarea value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} placeholder="Describe this service..." /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Icon" hint="Icon name/key"><Input value={form.icon} onChange={(e)=>setForm({...form,icon:e.target.value})} placeholder="Server" /></Field>
            <Field label="Display order"><Input type="number" min="0" value={form.displayOrder} onChange={(e)=>setForm({...form,displayOrder:e.target.value})} /></Field>
          </div>
          <Toggle checked={form.visible} onChange={(v)=>setForm({...form,visible:v})} label="Visible" description="Show this service on the public portfolio." />
        </div>
      </Modal>
      <ConfirmDialog open={!!confirm} onClose={()=>setConfirm(null)} onConfirm={doDelete} danger title="Delete service" message={`Delete "${confirm?.title}"?`} confirmLabel="Delete" />
    </div>
  )
}

