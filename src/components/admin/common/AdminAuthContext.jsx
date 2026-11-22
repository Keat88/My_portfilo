/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { adminApi, isUnauthorizedError } from '../../../services/adminApi'
import { mockProfile } from '../../../data/admin/mockData'

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [checking, setChecking] = useState(true)
  const [authError, setAuthError] = useState(null)

  const verify = useCallback(async () => {
    setChecking(true)
    setAuthError(null)
    try {
      const data = await adminApi.verifySession()
      setAdmin(data?.user || data || { ...mockProfile, role: 'admin' })
    } catch (err) {
      const bypass = localStorage.getItem('admin_dev_bypass') === '1'
      if (bypass) {
        setAdmin({ ...mockProfile, role: 'admin', _devBypass: true })
      } else {
        setAdmin(null)
        if (!isUnauthorizedError(err)) setAuthError(err)
      }
    } finally {
      setChecking(false)
    }
  }, [])

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const data = await adminApi.verifySession()
        if (!active) return
        setAdmin(data?.user || data || { ...mockProfile, role: 'admin' })
      } catch (err) {
        if (!active) return
        const bypass = localStorage.getItem('admin_dev_bypass') === '1'
        if (bypass) {
          setAdmin({ ...mockProfile, role: 'admin', _devBypass: true })
        } else {
          setAdmin(null)
          if (!isUnauthorizedError(err)) setAuthError(err)
        }
      } finally {
        if (active) setChecking(false)
      }
    })()
    return () => { active = false }
  }, [])

  const loginDev = () => {
    localStorage.setItem('admin_dev_bypass', '1')
    setAdmin({ ...mockProfile, role: 'admin', _devBypass: true })
  }

  const logout = () => {
    localStorage.removeItem('admin_dev_bypass')
    localStorage.removeItem('admin_token')
    sessionStorage.removeItem('admin_token')
    setAdmin(null)
  }

  const value = useMemo(
    () => ({ admin, checking, authError, verify, logout, loginDev, isAuthed: !!admin }),
    [admin, checking, authError, verify],
  )
  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return ctx
}
