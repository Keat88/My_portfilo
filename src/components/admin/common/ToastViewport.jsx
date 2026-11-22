import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Info, X, AlertTriangle } from 'lucide-react'
import { useToast } from './ToastProvider'
import { cn } from '../../../utils/cn'

const styles = {
  success: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-100',
  error: 'border-red-400/30 bg-red-400/10 text-red-100',
  info: 'border-primary/30 bg-primary/10 text-slate-100',
  warning: 'border-amber-400/30 bg-amber-400/10 text-amber-100',
}
const icons = { success: CheckCircle2, error: AlertTriangle, info: Info, warning: AlertTriangle }

export default function ToastViewport() {
  const { toasts, remove } = useToast()
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[120] flex w-[min(92vw,24rem)] flex-col gap-2">
      <AnimatePresence initial={false}>
        {toasts.map((t) => {
          const Icon = icons[t.type] || Info
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              className={cn('pointer-events-auto flex items-start gap-3 rounded-xl border px-3.5 py-3 shadow-lg backdrop-blur-xl', styles[t.type] || styles.info)}
              role="status"
            >
              <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <p className="flex-1 text-sm leading-relaxed text-ink [html[data-theme='dark']_&]:text-inherit">{t.message}</p>
              <button type="button" onClick={() => remove(t.id)} className="rounded-md p-1 text-muted hover:bg-white/10 hover:text-ink" aria-label="Dismiss notification">
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
