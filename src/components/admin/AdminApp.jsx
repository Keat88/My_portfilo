import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminAuthProvider } from './common/AdminAuthContext'
import { ToastProvider } from './common/ToastProvider'
import AdminLayout from './layout/AdminLayout'

const DashboardPage = lazy(() => import('../../pages/admin/DashboardPage'))
const ProjectsPage = lazy(() => import('../../pages/admin/ProjectsPage'))
const SkillsPage = lazy(() => import('../../pages/admin/SkillsPage'))
const ServicesPage = lazy(() => import('../../pages/admin/ServicesPage'))
const JourneyPage = lazy(() => import('../../pages/admin/JourneyPage'))
const MessagesPage = lazy(() => import('../../pages/admin/MessagesPage'))
const ProfilePage = lazy(() => import('../../pages/admin/ProfilePage'))
const SettingsPage = lazy(() => import('../../pages/admin/SettingsPage'))

function PageFallback() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-white/10" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="h-28 animate-pulse rounded-2xl bg-white/10" />
        <div className="h-28 animate-pulse rounded-2xl bg-white/10" />
        <div className="h-28 animate-pulse rounded-2xl bg-white/10" />
      </div>
      <div className="h-72 animate-pulse rounded-2xl bg-white/10" />
    </div>
  )
}

export default function AdminApp() {
  return (
    <AdminAuthProvider>
      <ToastProvider>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="skills" element={<SkillsPage />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="journey" element={<JourneyPage />} />
              <Route path="messages" element={<MessagesPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Route>
          </Routes>
        </Suspense>
      </ToastProvider>
    </AdminAuthProvider>
  )
}
