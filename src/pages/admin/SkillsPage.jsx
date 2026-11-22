import { useEffect, useMemo, useState } from 'react'
import { Plus, Pencil, Trash2, Sparkles } from 'lucide-react'
import PageHeader, { GlassCard, MockDataBadge } from '../../components/admin/common/PageHeader'
import SearchBar, { FilterSelect } from '../../components/admin/common/SearchFilter'
import StatusBadge from '../../components/admin/common/StatusBadge'
import Modal from '../../components/admin/common/Modal'
import ConfirmDialog from '../../components/admin/common/ConfirmDialog'
import { EmptyState, ErrorState } from '../../components/admin/common/States'
import { Field, Input, Select, Toggle, Button } from '../../components/admin/forms/FormControls'
import { useToast } from '../../components/admin/common/ToastProvider'
import { useDebouncedValue } from '../../hooks/admin/useAdmin'
import { mockSkills } from '../../data/admin/mockData'
import { adminApi, formatApiError } from '../../services/adminApi'

const CATEGORIES = ['Programming Languages', 'Frontend Development', 'Backend Development', 'Database', 'DevOps and Tools']
const emptyForm = { name: '', category: CATEGORIES[0], icon: '', displayOrder: 0, visible: true }

export default function SkillsPage() {
  const toast = useToast()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState('mock')
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [confirm, setConfirm] = useState(null)
  const debounced = useDebouncedValue(query, 250)

  const load = async () => {
    setLoading(true); setError(null)
    try { const d = await adminApi.getSkills(); setItems(Array.isArray(d) ? d : (d?.items || [])); setSource('live') }
    catch (e) { setItems(mockSkills); setSource('mock'); if (e?.status >= 500) setError(formatApiError(e)) }
    finally { setLoading(false) }
  }
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const d = await adminApi.getSkills()
        if (cancelled) return
        setItems(Array.isArray(d) ? d : (d?.items || []))
        setSource('live')
      } catch (e) {
        if (cancelled) return
        setItems(mockSkills)
        setSource('mock')
        if (e?.status >= 500) setError(formatApiError(e))
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  const filtered = useMemo(() => items.filter((s) => {
    const q = debounced.toLowerCase()
    if (q && !`${s.name} ${s.category} ${s.icon || ''}`.toLowerCase().includes(q)) return false
    if (cat !== 'all' && s.category !== cat) return false
    return true
  }).sort((a,b)=> (a.displayOrder??0)-(b.displayOrder??0) || a.name.localeCompare(b.name)), [items, debounced, cat])

  const openCreate = () => { setEditing(null); setForm({ ...emptyForm, displayOrder: items.length + 1 }); setErrors({}); setModalOpen(true) }
  const openEdit = (s) => { setEditing(s); setForm({ name: s.name||'', category: s.category||CATEGORIES[0], icon: s.icon||'', displayOrder: s.displayOrder??0, visible: s.visible !== false }); setErrors({}); setModalOpen(true) }

  const validate = () => { const e = {}; if (!form.name.trim()) e.name = 'Skill name is required.'; if (!form.category) e.category = 'Category is required.'; setErrors(e); return !Object.keys(e).length }
  const save = async () => {
    if (!validate()) return
    const payload = { ...form, name: form.name.trim(), icon: form.icon.trim(), displayOrder: Number(form.displayOrder)||0 }
    try {
      if (source === 'live') { editing ? await adminApi.updateSkill(editing.id, payload) : await adminApi.createSkill(payload); await load() }
      else setItems((prev) => editing ? prev.map((x)=>x.id===editing.id?{...x,...payload}:x) : [...prev, { id: Date.now(), ...payload }])
      toast.success(editing ? 'Skill updated (UI state).' : 'Skill added (UI state).'); setModalOpen(false)
    } catch (e) { toast.error(formatApiError(e)) }
  }
  const doDelete = async () => {
    try { if (source==='live'){ await adminApi.deleteSkill(confirm.id); await load() } else setItems((p)=>p.filter((x)=>x.id!==confirm.id)); toast.success('Skill deleted (UI state).') }
    catch(e){ toast.error(formatApiError(e)) } finally { setConfirm(null) }
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Content Management" title="Skills" description="Manage the technologies and tools displayed on your portfolio." actions={<Button onClick={openCreate}><Plus className="h-4 w-4" /> Add Skill</Button>}>
        {source === 'mock' && <div className="mt-2"><MockDataBadge /></div>}
      </PageHeader>
      {error && <ErrorState message={error} onRetry={load} />}
      <GlassCard hover={false} className="p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row">
            <SearchBar value={query} onChange={setQuery} placeholder="Search skills..." className="sm:max-w-xs" />
            <FilterSelect value={cat} onChange={setCat} ariaLabel="Filter category" options={[{ value: 'all', label: 'All categories' }, ...CATEGORIES.map((c)=>({value:c,label:c}))]} />
          </div>
          <p className="text-sm text-muted">{filtered.length} skill(s)</p>
        </div>

        <div className="mt-5">
          {loading ? <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{Array.from({length:6}).map((_,i)=><div key={i} className="h-28 animate-pulse rounded-2xl bg-white/5" />)}</div>
          : filtered.length === 0 ? <EmptyState icon={Sparkles} title="No skills found" description="Add a skill to showcase your stack." action={<Button onClick={openCreate}><Plus className="h-4 w-4" /> Add Skill</Button>} />
          : (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((s) => (
                <div key={s.id} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-primary/30 [html[data-theme='light']_&]:bg-slate-50/60">
                  <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/10 blur-2xl opacity-0 transition group-hover:opacity-100" />
                  <div className="relative flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-primary/30 bg-primary/10 font-mono text-[10px] text-primary">{(s.icon || s.name || '?').slice(0,2)}</div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-ink">{s.name}</p>
                        <p className="truncate text-xs text-muted">{s.category}</p>
                      </div>
                    </div>
                    <StatusBadge status={s.visible !== false ? 'Visible' : 'Hidden'} />
                  </div>
                  <div className="relative mt-3 flex items-center justify-between text-xs text-muted">
                    <span>Icon: <span className="font-mono text-[11px] text-[var(--text-soft)]">{s.icon || '—'}</span></span>
                    <span>Order: {s.displayOrder ?? 0}</span>
                  </div>
                  <div className="relative mt-4 flex gap-2">
                    <Button variant="secondary" size="sm" onClick={() => openEdit(s)}><Pencil className="h-3.5 w-3.5" /> Edit</Button>
                    <Button variant="danger" size="sm" onClick={() => setConfirm(s)}><Trash2 className="h-3.5 w-3.5" /> Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </GlassCard>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Skill' : 'Add Skill'} description="Configure skill details. Proficiency percentages are not used." size="md"
        footer={<><Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={save}>{editing ? 'Save Changes' : 'Add Skill'}</Button></>}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Skill name" htmlFor="s-name" required error={errors.name} className="sm:col-span-2"><Input id="s-name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} placeholder="e.g. React.js" /></Field>
          <Field label="Category" htmlFor="s-cat" required error={errors.category}><Select id="s-cat" value={form.category} onChange={(e)=>setForm({...form,category:e.target.value})}>{CATEGORIES.map((c)=><option key={c} value={c}>{c}</option>)}</Select></Field>
          <Field label="Display order" htmlFor="s-order"><Input id="s-order" type="number" min="0" value={form.displayOrder} onChange={(e)=>setForm({...form,displayOrder:e.target.value})} /></Field>
          <Field label="Icon" htmlFor="s-icon" hint="Icon name/key (e.g. SiReact, Code)" className="sm:col-span-2"><Input id="s-icon" value={form.icon} onChange={(e)=>setForm({...form,icon:e.target.value})} placeholder="SiReact" /></Field>
          <div className="sm:col-span-2"><Toggle checked={form.visible} onChange={(v)=>setForm({...form,visible:v})} label="Visible" description="Show this skill on the public portfolio." /></div>
        </div>
      </Modal>
      <ConfirmDialog open={!!confirm} onClose={()=>setConfirm(null)} onConfirm={doDelete} danger title="Delete skill" message={`Delete "${confirm?.name}"?`} confirmLabel="Delete" />
    </div>
  )
}

