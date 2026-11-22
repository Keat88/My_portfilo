import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-between gap-3 border-t border-white/10 px-3 py-3 text-sm">
      <p className="text-muted">Page <span className="text-ink">{page}</span> of <span className="text-ink">{totalPages}</span></p>
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page <= 1} className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-muted hover:text-ink disabled:opacity-40">
          <ChevronLeft className="h-4 w-4" /> Prev
        </button>
        <button type="button" onClick={() => onPageChange(Math.min(totalPages, page + 1))} disabled={page >= totalPages} className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-muted hover:text-ink disabled:opacity-40">
          Next <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
