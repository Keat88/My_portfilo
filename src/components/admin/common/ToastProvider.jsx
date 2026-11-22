/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const ToastContext = createContext(null)

let idSeq = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const push = useCallback((toast) => {
    const id = ++idSeq
    const item = { id, type: 'info', duration: 3500, ...toast }
    setToasts((prev) => [...prev, item])
    if (item.duration > 0) setTimeout(() => remove(id), item.duration)
    return id
  }, [remove])

  const api = useMemo(() => ({
    toasts,
    push,
    remove,
    success: (message, opts = {}) => push({ type: 'success', message, ...opts }),
    error: (message, opts = {}) => push({ type: 'error', message, duration: 5000, ...opts }),
    info: (message, opts = {}) => push({ type: 'info', message, ...opts }),
  }), [toasts, push, remove])

  return <ToastContext.Provider value={api}>{children}</ToastContext.Provider>
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
