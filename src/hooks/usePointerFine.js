import { useEffect, useState } from 'react'

const QUERY = '(hover: hover) and (pointer: fine)'

export function usePointerFine() {
  const [fine, setFine] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(QUERY).matches,
  )

  useEffect(() => {
    const media = window.matchMedia(QUERY)
    const onChange = (event) => setFine(event.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  return fine
}
