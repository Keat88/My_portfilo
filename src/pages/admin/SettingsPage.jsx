import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Palette, Bell, Globe, Monitor } from 'lucide-react'
import PageHeader, { GlassCard, MockDataBadge } from '../../components/admin/common/PageHeader'
import { Field, Select, Toggle, Button } from '../../components/admin/forms/FormControls'
import { useToast } from '../../components/admin/common/ToastProvider'
import { useTheme } from '../../hooks/useTheme'
import { mockSettings } from '../../data/admin/mockData'
import { adminApi, formatApiError } from '../../services/adminApi'

export default function SettingsPage() {
  const toast = useToast()
  const { theme, setTheme } = useTheme()
  const { i18n } = useTranslation()
  const currentLang = (i18n.resolvedLanguage || i18n.language || 'en').startsWith('km') ? 'km' : 'en'
  const [settings, setSettings] = useState(() => ({ ...mockSettings, theme, language: currentLang }))
  const [source, setSource] = useState('mock')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const d = await adminApi.getSettings()
        if (cancelled) return
        if (d) { setSettings((prev) => ({ ...prev, ...d })); setSource('live') }
        else setSource('mock')
      } catch {
        if (!cancelled) setSource('mock')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  const onThemeChange = (value) => { setTheme(value); setSettings((s) => ({ ...s, theme: value })) }
  const onLanguageChange = (value) => {
    setSettings((s) => ({ ...s, language: value }))
    const y = window.scrollY
    i18n.changeLanguage(value)
    localStorage.setItem('i18nextLng', value)
    requestAnimationFrame(() => window.scrollTo({ top: y, left: 0, behavior: 'auto' }))
  }

  const save = async () => {
    setSaving(true)
    const payload = { ...settings, theme, language: currentLang }
    try {
      if (source === 'live') await adminApi.updateSettings(payload)
      toast.success('Settings saved (UI state).')
    } catch (e) { toast.error(formatApiError(e)) }
    finally { setSaving(false) }
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Account" title="Settings" description="Configure dashboard preferences. Theme and language changes apply using the existing site architecture.">
        {source === 'mock' && <div className="mt-2"><MockDataBadge /></div>}
      </PageHeader>

      {loading ? (
        <div className="grid gap-4 lg:grid-cols-2">{Array.from({length:3}).map((_,i)=><div key={i} className="h-56 animate-pulse rounded-2xl bg-white/5" />)}</div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <GlassCard hover={false}>
            <div className="mb-5 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><Palette className="h-5 w-5" /></span>
              <div><h3 className="font-display text-lg font-semibold text-ink">Theme preferences</h3><p className="text-sm text-muted">Controls the existing global theme.</p></div>
            </div>
            <div className="space-y-4">
              <Field label="Color mode" htmlFor="set-theme">
                <Select id="set-theme" value={theme} onChange={(e) => onThemeChange(e.target.value)}>
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </Select>
              </Field>
              <Toggle checked={settings.compactMode} onChange={(v)=>setSettings({...settings, compactMode:v})} label="Compact mode" description="Reduce spacing density in dashboard views (UI preference)." />
              <Toggle checked={settings.showTips} onChange={(v)=>setSettings({...settings, showTips:v})} label="Show dashboard tips" description="Display helpful hints and guidance in admin pages." />
            </div>
          </GlassCard>

          <GlassCard hover={false}>
            <div className="mb-5 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-cyan/10 text-cyan-300"><Globe className="h-5 w-5" /></span>
              <div><h3 className="font-display text-lg font-semibold text-ink">Language preferences</h3><p className="text-sm text-muted">Uses the existing i18n configuration.</p></div>
            </div>
            <div className="space-y-4">
              <Field label="Language" htmlFor="set-lang">
                <Select id="set-lang" value={currentLang} onChange={(e) => onLanguageChange(e.target.value)}>
                  <option value="en">English</option>
                  <option value="km">Khmer</option>
                </Select>
              </Field>
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-sm text-muted">
                Language selection is stored with the existing <code className="rounded bg-white/5 px-1 text-xs">i18next</code> setup so portfolio and admin stay consistent.
              </div>
            </div>
          </GlassCard>

          <GlassCard hover={false}>
            <div className="mb-5 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet/10 text-violet-300"><Bell className="h-5 w-5" /></span>
              <div><h3 className="font-display text-lg font-semibold text-ink">Notification preferences</h3><p className="text-sm text-muted">Control how you receive admin alerts.</p></div>
            </div>
            <div className="space-y-3">
              <Toggle checked={settings.emailNotifications} onChange={(v)=>setSettings({...settings,emailNotifications:v})} label="Email notifications" description="Receive email alerts for important dashboard events." />
              <Toggle checked={settings.messageAlerts} onChange={(v)=>setSettings({...settings,messageAlerts:v})} label="New message alerts" description="Get notified when new contact messages arrive." />
            </div>
          </GlassCard>

          <GlassCard hover={false}>
            <div className="mb-5 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-400/10 text-emerald-300"><Monitor className="h-5 w-5" /></span>
              <div><h3 className="font-display text-lg font-semibold text-ink">Dashboard appearance</h3><p className="text-sm text-muted">Visual preferences for admin workspace.</p></div>
            </div>
            <div className="space-y-3 text-sm text-muted">
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-3"><span>Glassmorphism surfaces</span><span className="text-ink">Enabled</span></div>
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-3"><span>Motion & transitions</span><span className="text-ink">Respect reduced motion</span></div>
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-3"><span>Charts theme</span><span className="text-ink">Follows app theme</span></div>
            </div>
          </GlassCard>
        </div>
      )}

      <div className="flex items-center justify-end">
        <Button onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save Settings'}</Button>
      </div>
    </div>
  )
}

