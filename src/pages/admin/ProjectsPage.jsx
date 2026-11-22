import { useEffect, useMemo, useState } from 'react'
import { Plus, Pencil, Trash2, ExternalLink, ImageOff } from 'lucide-react'
import { FaGithub } from 'react-icons/fa'
import PageHeader, { GlassCard, MockDataBadge } from '../../components/admin/common/PageHeader'
import SearchBar, { FilterSelect } from '../../components/admin/common/SearchFilter'
import StatusBadge from '../../components/admin/common/StatusBadge'
import Modal from '../../components/admin/common/Modal'
import ConfirmDialog from '../../components/admin/common/ConfirmDialog'
import Pagination from '../../components/admin/common/Pagination'
import { EmptyState, ErrorState } from '../../components/admin/common/States'
import { Field, Input, Textarea, Toggle, Button } from '../../components/admin/forms/FormControls'
import ImageUpload from '../../components/admin/forms/ImageUpload'
import { useToast } from '../../components/admin/common/ToastProvider'
import { useDebouncedValue, usePagination } from '../../hooks/admin/useAdmin'
import { mockProjects } from '../../data/admin/mockData'
import { adminApi, formatApiError } from '../../services/adminApi'
import { formatDate } from '../../components/admin/utils/format'

const emptyForm = { title: '', shortDescription: '', fullDescription: '', thumbnail: null, githubUrl: '', liveUrl: '', technologies: '', featured: false, published: false }

export default function ProjectsPage() {
  const toast = useToast()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [source, setSource] = useState('mock')
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sort, setSort] = useState('newest')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [formErrors, setFormErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [confirm, setConfirm] = useState(null)
  const debounced = useDebouncedValue(query, 250)

  const load = async () => {
    setLoading(true); setError(null)
    try {
      const data = await adminApi.getProjects()
      setItems(Array.isArray(data) ? data : (data?.items || []))
      setSource('live')
    } catch (err) {
      setItems(mockProjects)
      setSource('mock')
      if (err?.status >= 500) setError(formatApiError(err))
    } finally { setLoading(false) }
  }
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await adminApi.getProjects()
        if (cancelled) return
        setItems(Array.isArray(data) ? data : (data?.items || []))
        setSource('live')
      } catch (err) {
        if (cancelled) return
        setItems(mockProjects)
        setSource('mock')
        if (err?.status >= 500) setError(formatApiError(err))
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  const filtered = useMemo(() => {
    let list = [...items]
    if (debounced) {
      const q = debounced.toLowerCase()
      list = list.filter((p) => [p.title, p.shortDescription, ...(p.technologies || [])].join(' ').toLowerCase().includes(q))
    }
    if (statusFilter === 'published') list = list.filter((p) => p.published)
    if (statusFilter === 'draft') list = list.filter((p) => !p.published)
    if (statusFilter === 'featured') list = list.filter((p) => p.featured)
    list.sort((a, b) => {
      if (sort === 'title') return (a.title || '').localeCompare(b.title || '')
      if (sort === 'oldest') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    })
    return list
  }, [items, debounced, statusFilter, sort])

  const { page, setPage, totalPages, pageItems } = usePagination(filtered, 6)

  const openCreate = () => { setEditing(null); setForm(emptyForm); setFormErrors({}); setModalOpen(true) }
  const openEdit = (p) => {
    setEditing(p)
    setForm({ title: p.title || '', shortDescription: p.shortDescription || '', fullDescription: p.fullDescription || '', thumbnail: p.thumbnail ? { preview: p.thumbnail, name: 'Current thumbnail' } : null, githubUrl: p.githubUrl || '', liveUrl: p.liveUrl || '', technologies: (p.technologies || []).join(', '), featured: !!p.featured, published: !!p.published })
    setFormErrors({})
    setModalOpen(true)
  }

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Project title is required.'
    if (!form.shortDescription.trim()) e.shortDescription = 'Short description is required.'
    if (form.githubUrl && !/^https?:\/\//i.test(form.githubUrl)) e.githubUrl = 'Enter a valid URL (https://...).'
    if (form.liveUrl && !/^https?:\/\//i.test(form.liveUrl)) e.liveUrl = 'Enter a valid URL (https://...).'
    setFormErrors(e)
    return Object.keys(e).length === 0
  }

  const save = async () => {
    if (!validate()) return
    setSaving(true)
    const payload = {
      title: form.title.trim(),
      shortDescription: form.shortDescription.trim(),
      fullDescription: form.fullDescription.trim(),
      githubUrl: form.githubUrl.trim(),
      liveUrl: form.liveUrl.trim(),
      technologies: form.technologies.split(',').map((t) => t.trim()).filter(Boolean),
      featured: form.featured,
      published: form.published,
    }
    try {
      if (source === 'live') {
        if (editing) await adminApi.updateProject(editing.id, payload)
        else await adminApi.createProject(payload)
        await load()
      } else {
        if (editing) setItems((prev) => prev.map((p) => p.id === editing.id ? { ...p, ...payload, thumbnail: form.thumbnail?.preview || p.thumbnail } : p))
        else setItems((prev) => [{ id: Date.now(), ...payload, thumbnail: form.thumbnail?.preview || '', createdAt: new Date().toISOString() }, ...prev])
      }
      toast.success(editing ? 'Project updated (UI state).' : 'Project created (UI state).')
      setModalOpen(false)
    } catch (err) {
      toast.error(formatApiError(err))
    } finally { setSaving(false) }
  }

  const doDelete = async () => {
    if (!confirm) return
    try {
      if (source === 'live') { await adminApi.deleteProject(confirm.id); await load() }
      else setItems((prev) => prev.filter((p) => p.id !== confirm.id))
      toast.success('Project deleted (UI state).')
    } catch (err) { toast.error(formatApiError(err)) }
    finally { setConfirm(null) }
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Content Management" title="Projects" description="Create, edit, and manage portfolio projects." actions={<Button onClick={openCreate}><Plus className="h-4 w-4" /> Add Project</Button>}>
        {source === 'mock' && <div className="mt-2"><MockDataBadge /></div>}
      </PageHeader>

      {error && <ErrorState message={error} onRetry={load} />}
      <GlassCard hover={false} className="p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row">
            <SearchBar value={query} onChange={(v) => { setQuery(v); setPage(1) }} placeholder="Search projects..." className="sm:max-w-xs" />
            <FilterSelect value={statusFilter} onChange={(v) => { setStatusFilter(v); setPage(1) }} ariaLabel="Filter projects" options={[{ value: 'all', label: 'All statuses' }, { value: 'published', label: 'Published' }, { value: 'draft', label: 'Draft' }, { value: 'featured', label: 'Featured' }]} />
            <FilterSelect value={sort} onChange={(v) => { setSort(v); setPage(1) }} ariaLabel="Sort projects" options={[{ value: 'newest', label: 'Newest' }, { value: 'oldest', label: 'Oldest' }, { value: 'title', label: 'Title A–Z' }]} />
          </div>
          <p className="text-sm text-muted">{filtered.length} project(s)</p>
        </div>

        <div className="mt-5">
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-56 animate-pulse rounded-2xl bg-white/5" />)}</div>
          ) : pageItems.length === 0 ? (
            <EmptyState icon={FolderKanbanIcon} title="No projects found" description="Try adjusting filters or add your first project." action={<Button onClick={openCreate}><Plus className="h-4 w-4" /> Add Project</Button>} />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {pageItems.map((p) => (
                <article key={p.id} className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition hover:border-primary/30 [html[data-theme='light']_&]:bg-slate-50/60">
                  <div className="relative aspect-[16/8] overflow-hidden border-b border-white/10 bg-gradient-to-br from-[var(--surface)] to-[var(--card)]">
                    {p.thumbnail ? <img src={p.thumbnail} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-muted"><ImageOff className="h-6 w-6" /></div>}
                    <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                      <StatusBadge status={p.published ? 'Published' : 'Draft'} />
                      {p.featured && <StatusBadge status="Featured" />}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate font-display text-lg font-semibold text-ink">{p.title}</h3>
                        <p className="mt-1 line-clamp-2 text-sm text-muted">{p.shortDescription}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {(p.technologies || []).slice(0, 5).map((t) => <span key={t} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] text-[var(--text-soft)]">{t}</span>)}
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted">
                      <span>{formatDate(p.createdAt)}</span>
                      {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-primary"><FaGithub className="h-3.5 w-3.5" />GitHub</a>}
                      {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-primary"><ExternalLink className="h-3.5 w-3.5" />Live</a>}
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <Button variant="secondary" size="sm" onClick={() => openEdit(p)}><Pencil className="h-3.5 w-3.5" /> Edit</Button>
                      <Button variant="danger" size="sm" onClick={() => setConfirm(p)}><Trash2 className="h-3.5 w-3.5" /> Delete</Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </GlassCard>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Project' : 'Add Project'} description="Manage project details shown in your portfolio." size="lg"
        footer={<><Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={save} disabled={saving}>{saving ? 'Saving...' : (editing ? 'Save Changes' : 'Create Project')}</Button></>}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Project title" htmlFor="p-title" required error={formErrors.title} className="sm:col-span-2"><Input id="p-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. ContactHub" /></Field>
          <Field label="Short description" htmlFor="p-short" required error={formErrors.shortDescription} className="sm:col-span-2"><Input id="p-short" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} placeholder="Brief summary" /></Field>
          <Field label="Full description" htmlFor="p-full" className="sm:col-span-2"><Textarea id="p-full" value={form.fullDescription} onChange={(e) => setForm({ ...form, fullDescription: e.target.value })} placeholder="Detailed description..." /></Field>
          <div className="sm:col-span-2"><ImageUpload value={form.thumbnail} onChange={(v) => setForm({ ...form, thumbnail: v })} hint="Upload a thumbnail image for the project card." /></div>
          <Field label="GitHub URL" htmlFor="p-gh" error={formErrors.githubUrl}><Input id="p-gh" value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} placeholder="https://github.com/..." /></Field>
          <Field label="Live Demo URL" htmlFor="p-live" error={formErrors.liveUrl}><Input id="p-live" value={form.liveUrl} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} placeholder="https://..." /></Field>
          <Field label="Technologies" htmlFor="p-tech" hint="Comma-separated (e.g. React, Spring Boot, MySQL)" className="sm:col-span-2"><Input id="p-tech" value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} placeholder="React, FastAPI, MySQL" /></Field>
          <Toggle checked={form.featured} onChange={(v) => setForm({ ...form, featured: v })} label="Featured project" description="Highlight this project in featured sections." />
          <Toggle checked={form.published} onChange={(v) => setForm({ ...form, published: v })} label="Published" description="Visible on the public portfolio." />
        </div>
      </Modal>

      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={doDelete} danger title="Delete project" message={`Delete "${confirm?.title}"? This action cannot be undone.`} confirmLabel="Delete" />
    </div>
  )
}

function FolderKanbanIcon(props) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h4M7 12h2M13 8h4M13 12h4M13 16h2"/></svg> }

