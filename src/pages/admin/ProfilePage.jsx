import { useEffect, useState } from 'react'
import { User, Lock, Camera } from 'lucide-react'
import PageHeader, { GlassCard, MockDataBadge } from '../../components/admin/common/PageHeader'
import { Field, Input, Button } from '../../components/admin/forms/FormControls'
import { ErrorState } from '../../components/admin/common/States'
import { useToast } from '../../components/admin/common/ToastProvider'
import { mockProfile } from '../../data/admin/mockData'
import { adminApi, formatApiError } from '../../services/adminApi'

export default function ProfilePage() {
  const toast = useToast()
  const [profile, setProfile] = useState({ avatar: '', fullName: '', username: '', email: '' })
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' })
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState('mock')
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [savingPw, setSavingPw] = useState(false)
  const [errors, setErrors] = useState({})
  const [pwErrors, setPwErrors] = useState({})

  useEffect(() => {
    (async () => {
      setLoading(true); setError(null)
      try { const d = await adminApi.getProfile(); setProfile({ avatar: d?.avatar || '', fullName: d?.fullName || d?.name || '', username: d?.username || '', email: d?.email || '' }); setSource('live') }
      catch (e) { setProfile(mockProfile); setSource('mock'); if (e?.status >= 500) setError(formatApiError(e)) }
      finally { setLoading(false) }
    })()
  }, [])

  const saveProfile = async (e) => {
    e.preventDefault()
    const err = {}
    if (!profile.fullName.trim()) err.fullName = 'Full name is required.'
    if (!profile.username.trim()) err.username = 'Username is required.'
    if (!profile.email.trim()) err.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) err.email = 'Enter a valid email address.'
    setErrors(err)
    if (Object.keys(err).length) return
    setSaving(true)
    try {
      if (source === 'live') await adminApi.updateProfile(profile)
      toast.success('Profile updated (UI state).')
    } catch (ex) { toast.error(formatApiError(ex)) }
    finally { setSaving(false) }
  }

  const changePassword = async (e) => {
    e.preventDefault()
    const err = {}
    if (!passwords.current) err.current = 'Current password is required.'
    if (!passwords.next) err.next = 'New password is required.'
    else if (passwords.next.length < 8) err.next = 'Password must be at least 8 characters.'
    if (passwords.confirm !== passwords.next) err.confirm = 'Passwords do not match.'
    setPwErrors(err)
    if (Object.keys(err).length) return
    setSavingPw(true)
    try {
      if (source === 'live') await adminApi.changePassword({ currentPassword: passwords.current, newPassword: passwords.next })
      else await new Promise((r) => setTimeout(r, 300))
      setPasswords({ current: '', next: '', confirm: '' })
      toast.success('Password updated (UI state).')
    } catch (ex) { toast.error(formatApiError(ex)) }
    finally { setSavingPw(false) }
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Account" title="My Profile" description="Manage your admin profile information and password.">
        {source === 'mock' && <div className="mt-2"><MockDataBadge /></div>}
      </PageHeader>
      {error && <ErrorState message={error} />}

      {loading ? (
        <div className="grid gap-4 lg:grid-cols-2">{Array.from({length:2}).map((_,i)=><div key={i} className="h-80 animate-pulse rounded-2xl bg-white/5" />)}</div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <GlassCard hover={false}>
            <div className="mb-5 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><User className="h-5 w-5" /></span>
              <div><h3 className="font-display text-lg font-semibold text-ink">Profile information</h3><p className="text-sm text-muted">Update your public admin details.</p></div>
            </div>
            <form onSubmit={saveProfile} className="space-y-4">
              <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <div className="relative grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary/30 to-violet/30 text-lg font-semibold text-ink">
                  {profile.avatar ? <img src={profile.avatar} alt="" className="h-full w-full object-cover" /> : (profile.fullName || 'A').split(' ').filter(Boolean).slice(0,2).map(p=>p[0]).join('').toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink">Profile avatar</p>
                  <p className="text-xs text-muted">Avatar upload can be connected to backend media storage.</p>
                  <label className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-muted hover:text-ink">
                    <Camera className="h-3.5 w-3.5" /> Change avatar
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = () => setProfile((p)=>({...p, avatar: r.result})); r.readAsDataURL(f) }} />
                  </label>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" required error={errors.fullName} className="sm:col-span-2"><Input value={profile.fullName} onChange={(e)=>setProfile({...profile,fullName:e.target.value})} /></Field>
                <Field label="Username" required error={errors.username}><Input value={profile.username} onChange={(e)=>setProfile({...profile,username:e.target.value})} /></Field>
                <Field label="Email" required error={errors.email}><Input type="email" value={profile.email} onChange={(e)=>setProfile({...profile,email:e.target.value})} /></Field>
              </div>
              <div className="pt-2"><Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Profile'}</Button></div>
            </form>
          </GlassCard>

          <GlassCard hover={false}>
            <div className="mb-5 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet/10 text-violet-300"><Lock className="h-5 w-5" /></span>
              <div><h3 className="font-display text-lg font-semibold text-ink">Change password</h3><p className="text-sm text-muted">Use a strong password for admin access.</p></div>
            </div>
            <form onSubmit={changePassword} className="space-y-4">
              <Field label="Current password" required error={pwErrors.current}><Input type="password" value={passwords.current} onChange={(e)=>setPasswords({...passwords,current:e.target.value})} autoComplete="current-password" /></Field>
              <Field label="New password" required error={pwErrors.next} hint="At least 8 characters."><Input type="password" value={passwords.next} onChange={(e)=>setPasswords({...passwords,next:e.target.value})} autoComplete="new-password" /></Field>
              <Field label="Confirm new password" required error={pwErrors.confirm}><Input type="password" value={passwords.confirm} onChange={(e)=>setPasswords({...passwords,confirm:e.target.value})} autoComplete="new-password" /></Field>
              <div className="pt-2"><Button type="submit" variant="secondary" disabled={savingPw}>{savingPw ? 'Updating...' : 'Update Password'}</Button></div>
              {source === 'mock' && <p className="text-xs text-muted">Password changes are simulated in UI preview mode and are not sent to a backend.</p>}
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  )
}

