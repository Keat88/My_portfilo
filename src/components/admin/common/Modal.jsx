import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '../../../utils/cn'

export default function Modal({ open, onClose, title, description, children, footer, size = 'md' }) {
  const widths = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-4xl' }
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[100] flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button type="button" aria-label="Close dialog" className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className={cn('relative z-10 w-full overflow-hidden rounded-2xl border border-white/10 bg-[var(--surface)] shadow-2xl', widths[size])}
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4">
              <div>
                <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
                {description && <p className="mt-1 text-sm text-muted">{description}</p>}
              </div>
              <button type="button" onClick={onClose} className="rounded-lg p-2 text-muted hover:bg-white/5 hover:text-ink" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto px-5 py-4">{children}</div>
            {footer && <div className="flex items-center justify-end gap-2 border-t border-white/10 px-5 py-3">{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
