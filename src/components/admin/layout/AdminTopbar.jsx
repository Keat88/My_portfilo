import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, Search, Bell, ChevronDown, Sun, Moon, User, Settings, LogOut } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTheme } from '../../../hooks/useTheme'
import { cn } from '../../../utils/cn'

const titles = {
  '/admin': 'Dashboard',
  '/admin/projects': 'Projects',
  '/admin/skills': 'Skills',
  '/admin/services': 'Services',
  '/admin/journey': 'Development Journey',
  '/admin/messages': 'Contact Messages',
  '/admin/profile': 'My Profile',
  '/admin/settings': 'Settings',
}

export default function AdminTopbar({ onMenu, onLogout }) {
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')

  const crumbs = useMemo(() => {
    const path = location.pathname
    const base = [{ label: 'Admin', to: '/admin' }]
    const current = titles[path]
    if (path !== '/admin' && current) base.push({ label: current, to: path })
    else if (path !== '/admin') base.push({ label: 'Page', to: path })
    return base
  }, [location.pathname])

  const pageTitle = titles[location.pathname] || 'Admin'

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[var(--background)]/75 backdrop-blur-xl [html[data-theme='light']_&]:bg-white/75">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
        <button type="button" onClick={onMenu} className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-muted hover:text-ink lg:hidden" aria-label="Open navigation menu">
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0 flex-1">
          <nav className="flex items-center gap-1.5 text-xs text-muted" aria-label="Breadcrumb">
            {crumbs.map((c, i) => (
              <span key={c.to} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-muted/50">/</span>}
                <Link to={c.to} className={cn('hover:text-ink', i === crumbs.length - 1 && 'text-ink font-medium')}>{c.label}</Link>
              </span>
            ))}
          </nav>
          <h1 className="truncate font-display text-base font-semibold text-ink sm:text-lg">{pageTitle}</h1>
        </div>

        <div className="hidden items-center md:flex">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." className="w-56 rounded-xl border border-white/10 bg-white/[0.03] py-2 pl-9 pr-3 text-sm text-ink placeholder:text-muted/60 focus:border-primary/40 focus:outline-none [html[data-theme='light']_&]:bg-white lg:w-72" />
          </label>
        </div>

        <button type="button" className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-muted hover:text-ink" aria-label="Notifications">
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold text-slate-950">3</span>
        </button>

        <button type="button" onClick={toggleTheme} className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-muted hover:text-ink" aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
          {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
        </button>

        <div className="relative">
          <button type="button" onClick={() => setOpen((v) => !v)} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-2 py-1.5 hover:border-primary/30">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-primary/80 to-violet/80 text-[10px] font-bold text-white">KK</span>
            <span className="hidden text-sm text-ink sm:block">Admin</span>
            <ChevronDown className={cn('h-4 w-4 text-muted transition', open && 'rotate-180')} />
          </button>
          <AnimatePresence>
            {open && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-white/10 bg-[var(--surface)] p-1.5 shadow-xl [html[data-theme='light']_&]:bg-white">
                <Link to="/admin/profile" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted hover:bg-white/5 hover:text-ink"><User className="h-4 w-4" />My Profile</Link>
                <Link to="/admin/settings" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted hover:bg-white/5 hover:text-ink"><Settings className="h-4 w-4" />Settings</Link>
                <button type="button" onClick={() => { setOpen(false); onLogout() }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-300 hover:bg-red-500/10"><LogOut className="h-4 w-4" />Logout</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
