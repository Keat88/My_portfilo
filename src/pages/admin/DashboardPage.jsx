import { useMemo } from 'react'
import { FolderKanban, Eye, Wrench, Layers, Mail, MailOpen, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageHeader, { GlassCard, MockDataBadge } from '../../components/admin/common/PageHeader'
import StatCard from '../../components/admin/dashboard/StatCard'
import MessagesLineChart from '../../components/admin/charts/MessagesLineChart'
import ProjectDistributionChart from '../../components/admin/charts/ProjectDistributionChart'
import RecentActivity from '../../components/admin/dashboard/RecentActivity'
import RecentMessages from '../../components/admin/dashboard/RecentMessages'
import { EmptyState, ErrorState } from '../../components/admin/common/States'
import { Button } from '../../components/admin/forms/FormControls'
import { mockDashboardStats, mockMessagesTrend, mockProjectDistribution, mockActivities, mockMessages } from '../../data/admin/mockData'
import { adminApi, formatApiError } from '../../services/adminApi'
import { useEffect, useState } from 'react'

function todayLabel() {
  return new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [trend, setTrend] = useState(null)
  const [distribution, setDistribution] = useState(null)
  const [activities, setActivities] = useState(null)
  const [messages, setMessages] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [source, setSource] = useState('mock')

  const applyMock = (err, cancelled = false) => {
    if (cancelled) return
    setStats(mockDashboardStats)
    setTrend(mockMessagesTrend)
    setDistribution(mockProjectDistribution)
    setActivities(mockActivities)
    setMessages(mockMessages.slice(0, 5))
    setSource('mock')
    if (err?.status && err.status >= 500) setError(formatApiError(err))
  }

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const [s, m] = await Promise.all([adminApi.getStats(), adminApi.getMessages({ limit: 5 })])
      setStats(s?.stats || s)
      setTrend(s?.messagesTrend || mockMessagesTrend)
      setDistribution(s?.projectDistribution || mockProjectDistribution)
      setActivities(s?.activities || mockActivities)
      setMessages(Array.isArray(m) ? m.slice(0, 5) : (m?.items || mockMessages).slice(0, 5))
      setSource('live')
    } catch (err) {
      applyMock(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [s, m] = await Promise.all([adminApi.getStats(), adminApi.getMessages({ limit: 5 })])
        if (cancelled) return
        setStats(s?.stats || s)
        setTrend(s?.messagesTrend || mockMessagesTrend)
        setDistribution(s?.projectDistribution || mockProjectDistribution)
        setActivities(s?.activities || mockActivities)
        setMessages(Array.isArray(m) ? m.slice(0, 5) : (m?.items || mockMessages).slice(0, 5))
        setSource('live')
      } catch (err) {
        applyMock(err, cancelled)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  const cards = useMemo(() => stats ? [
    { icon: FolderKanban, label: 'Total Projects', value: stats.totalProjects ?? 0, description: 'All projects in portfolio', accent: 'from-primary/20 to-cyan/5' },
    { icon: Eye, label: 'Published Projects', value: stats.publishedProjects ?? 0, description: 'Visible on public site', accent: 'from-cyan/20 to-primary/5' },
    { icon: Wrench, label: 'Total Skills', value: stats.totalSkills ?? 0, description: 'Technologies listed', accent: 'from-violet/20 to-fuchsia-500/5' },
    { icon: Layers, label: 'Total Services', value: stats.totalServices ?? 0, description: 'Services you offer', accent: 'from-indigo-400/20 to-primary/5' },
    { icon: Mail, label: 'Total Messages', value: stats.totalMessages ?? 0, description: 'Contact form submissions', accent: 'from-sky-400/20 to-cyan/5' },
    { icon: MailOpen, label: 'Unread Messages', value: stats.unreadMessages ?? 0, description: 'Need your attention', accent: 'from-amber-400/20 to-orange-500/5' },
  ] : [], [stats])

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        eyebrow="Overview"
        title="Welcome back, Admin"
        description={`Manage your portfolio content, track messages, and keep everything up to date. ${todayLabel()}`}
        actions={<Link to="/admin/projects"><Button><Plus className="h-4 w-4" /> Add New Project</Button></Link>}
      >
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {source === 'mock' && <MockDataBadge />}
          {source === 'live' && <span className="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-emerald-200 [html[data-theme='light']_&]:text-emerald-700">Live data</span>}
        </div>
      </PageHeader>

      {error && <ErrorState message={error} onRetry={load} />}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-32 animate-pulse rounded-2xl border border-white/10 bg-white/[0.04]" />)}
        </div>
      ) : (
        <section aria-label="Statistics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((c, i) => <StatCard key={c.label} {...c} delay={i * 0.04} />)}
        </section>
      )}

      <section className="grid gap-4 xl:grid-cols-2">
        <GlassCard hover={false} className="min-w-0">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-lg font-semibold text-ink">Contact Messages Overview</h3>
              <p className="text-sm text-muted">Messages received over time</p>
            </div>
            {source === 'mock' && <MockDataBadge label="Sample chart data" />}
          </div>
          {trend?.length ? <MessagesLineChart data={trend} /> : <EmptyState title="No message data" description="Message trends will appear here once data is available." />}
        </GlassCard>

        <GlassCard hover={false} className="min-w-0">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-lg font-semibold text-ink">Project Distribution</h3>
              <p className="text-sm text-muted">Projects by category or technology</p>
            </div>
            {source === 'mock' && <MockDataBadge label="Sample chart data" />}
          </div>
          {distribution?.length ? <ProjectDistributionChart data={distribution} /> : <EmptyState title="No project data" description="Project distribution will appear here once data is available." />}
        </GlassCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.35fr]">
        <GlassCard hover={false}>
          <div className="mb-4">
            <h3 className="font-display text-lg font-semibold text-ink">Recent Activity</h3>
            <p className="text-sm text-muted">Latest updates across your portfolio</p>
          </div>
          {activities?.length ? <RecentActivity items={activities} /> : <EmptyState title="No recent activity" description="Actions you take in the dashboard will show up here." />}
        </GlassCard>

        <GlassCard hover={false} className="min-w-0">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-lg font-semibold text-ink">Recent Contact Messages</h3>
              <p className="text-sm text-muted">Latest inquiries from your portfolio</p>
            </div>
            <Link to="/admin/messages" className="text-sm font-medium text-primary hover:underline">View all</Link>
          </div>
          {messages?.length ? <RecentMessages messages={messages} onView={() => { window.location.href = '/admin/messages' }} /> : <EmptyState title="No messages yet" description="New contact messages will appear here." />}
        </GlassCard>
      </section>
    </div>
  )
}

