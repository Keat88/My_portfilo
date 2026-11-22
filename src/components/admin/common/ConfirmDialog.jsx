import { AlertTriangle } from 'lucide-react'
import Modal from './Modal'

export default function ConfirmDialog({ open, onClose, onConfirm, title = 'Confirm action', message = 'Are you sure you want to continue?', confirmLabel = 'Confirm', danger = false, loading = false }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={(
        <>
          <button type="button" onClick={onClose} className="rounded-lg border border-white/10 px-4 py-2 text-sm text-muted hover:bg-white/5 hover:text-ink" disabled={loading}>Cancel</button>
          <button type="button" onClick={onConfirm} disabled={loading} className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition ${danger ? 'bg-red-500 hover:bg-red-400' : 'bg-primary hover:bg-primary/90'}`}>
            {loading ? 'Working...' : confirmLabel}
          </button>
        </>
      )}
    >
      <div className="flex gap-3">
        <span className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl ${danger ? 'bg-red-500/10 text-red-300' : 'bg-primary/10 text-primary'}`}>
          <AlertTriangle className="h-4 w-4" />
        </span>
        <p className="text-sm leading-relaxed text-muted">{message}</p>
      </div>
    </Modal>
  )
}
