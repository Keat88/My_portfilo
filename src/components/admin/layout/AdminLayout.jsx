import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import AdminTopbar from './AdminTopbar'
import ToastViewport from '../common/ToastViewport'
import { useAdminAuth } from '../common/AdminAuthContext'
import { ShieldAlert } from 'lucide-react'

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { admin, checking, loginDev, logout } = useAdminAuth()

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)] p-6">
        <div className="w-full max-w-md space-y-3">
          <div className="h-8 w-40 animate-pulse rounded-lg bg-white/10" />
          <div className="h-24 animate-pulse rounded-2xl bg-white/10" />
          <p className="text-sm text-muted">Verifying admin session...</p>
        </div>
      </div>
    )
  }

  if (!admin) {
    return <AdminAccessGate onDev={loginDev} />
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-ink">
      <div className="flex">
        <AdminSidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((v) => !v)}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
          onLogout={logout}
        />
        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <AdminTopbar onMenu={() => setMobileOpen(true)} onLogout={logout} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
      <ToastViewport />
    </div>
  )
}

function AdminAccessGate({ onDev }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] p-6 text-ink">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[var(--surface)] p-7 shadow-2xl [html[data-theme='light']_&]:bg-white">
        <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary"><ShieldAlert className="h-6 w-6" /></div>
        <h1 className="font-display text-2xl font-semibold">Admin access required</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">This area is protected. Sign in through the backend (JWT) so your session can be verified via <code className="rounded bg-white/5 px-1.5 py-0.5 text-xs">/api/v1/admin/auth/me</code>. No tokens are hardcoded.</p>
        <div className="mt-5 rounded-xl border border-amber-400/20 bg-amber-400/5 p-3 text-sm text-amber-200 [html[data-theme='light']_&]:text-amber-700">
          Backend not ready? You can open a clearly labeled local UI preview that uses temporary mock data only.
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <a href="/" className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-muted hover:bg-white/5 hover:text-ink">Back to portfolio</a>
          <button type="button" onClick={onDev} className="rounded-xl bg-gradient-to-r from-primary to-cyan px-4 py-2.5 text-sm font-semibold text-slate-950">Continue in UI Preview (mock data)</button>
        </div>
        <p className="mt-4 text-xs text-muted">UI Preview mode does not verify admin authorization and should be used only for local development.</p>
      </div>
      <ToastViewport />
    </div>
  )
}
