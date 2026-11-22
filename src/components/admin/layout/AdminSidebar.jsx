import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, FolderKanban, Sparkles, Briefcase, Route, Mail,
  User, Settings, LogOut, ChevronsLeft, ChevronsRight, Circle
} from 'lucide-react'
import { cn } from '../../../utils/cn'

const nav = [
  { heading: 'Overview', items: [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  ]},
  { heading: 'Content Management', items: [
    { to: '/admin/projects', label: 'Projects', icon: FolderKanban },
    { to: '/admin/skills', label: 'Skills', icon: Sparkles },
    { to: '/admin/services', label: 'Services', icon: Briefcase },
    { to: '/admin/journey', label: 'Development Journey', icon: Route },
  ]},
  { heading: 'Communication', items: [
    { to: '/admin/messages', label: 'Contact Messages', icon: Mail },
  ]},
  { heading: 'Account', items: [
    { to: '/admin/profile', label: 'My Profile', icon: User },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
  ]},
]

export default function AdminSidebar({ collapsed, onToggle, mobileOpen, onMobileClose, onLogout }) {
  const content = (
    <div className={cn('flex h-full flex-col border-r border-white/10 bg-[var(--surface)]/95 backdrop-blur-xl [html[data-theme="light"]_&]:bg-white/95', collapsed ? 'w-[4.5rem]' : 'w-72')}>
      <div className={cn('flex items-center gap-3 border-b border-white/10 px-3 py-4', collapsed && 'justify-center px-2')}>
        <div className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary via-cyan to-violet p-px shadow-[0_0_24px_-8px_rgba(56,189,248,0.8)]">
          <div className="grid h-full w-full place-items-center rounded-[11px] bg-[var(--surface)] font-display text-xs font-bold text-ink [html[data-theme='light']_&]:bg-white">KK</div>
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[var(--surface)] bg-emerald-400 [html[data-theme='light']_&]:border-white" title="Online" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-semibold text-ink">Portfolio Admin</p>
            <p className="flex items-center gap-1.5 text-[11px] text-emerald-400"><Circle className="h-2 w-2 fill-current" /> Online</p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {nav.map((group) => (
          <div key={group.heading} className="mb-3">
            {!collapsed && <p className="px-2 pb-1.5 pt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted/70">{group.heading}</p>}
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={onMobileClose}
                    className={({ isActive }) => cn(
                      'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200',
                      isActive ? 'bg-primary/10 text-ink shadow-[inset_0_0_0_1px_rgba(56,189,248,0.2)]' : 'text-muted hover:bg-white/5 hover:text-ink',
                      collapsed && 'justify-center px-2'
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && <motion.span layoutId="admin-active" className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-primary to-cyan" />}
                        <Icon className={cn('h-4.5 w-4.5 shrink-0', isActive ? 'text-primary' : 'text-muted group-hover:text-primary')} />
                        {!collapsed && <span className="truncate font-medium">{item.label}</span>}
                      </>
                    )}
                  </NavLink>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-2">
        <button type="button" onClick={onLogout} className={cn('flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted transition hover:bg-red-500/10 hover:text-red-300', collapsed && 'justify-center px-2')} title={collapsed ? 'Logout' : undefined}>
          <LogOut className="h-4.5 w-4.5" /> {!collapsed && <span>Logout</span>}
        </button>
        <button type="button" onClick={onToggle} className={cn('mt-1 hidden w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted transition hover:bg-white/5 hover:text-ink lg:flex', collapsed && 'justify-center px-2')} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          {collapsed ? <ChevronsRight className="h-4.5 w-4.5" /> : <><ChevronsLeft className="h-4.5 w-4.5" /><span>Collapse</span></>}
        </button>
      </div>
    </div>
  )

  return (
    <>
      <aside className="sticky top-0 hidden h-screen lg:block">{content}</aside>
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-[80] lg:hidden">
            <motion.button type="button" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={onMobileClose} aria-label="Close menu" />
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} transition={{ type: 'spring', stiffness: 320, damping: 30 }} className="absolute inset-y-0 left-0">
              {content}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
