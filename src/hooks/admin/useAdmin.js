import { useEffect, useState } from 'react'

export function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}
export function usePagination(items = [], pageSize = 8) {
  const [rawPage, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  const page = Math.min(rawPage, totalPages)
  const start = (page - 1) * pageSize
  const pageItems = items.slice(start, start + pageSize)

  return { page, setPage, totalPages, pageItems, total: items.length, pageSize }
}
