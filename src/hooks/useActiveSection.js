import { useEffect, useState } from 'react'

export function useActiveSection(sectionIds) {
  const [active, setActive] = useState(sectionIds[0] ?? '')

  useEffect(() => {
    if (sectionIds.length === 0) return undefined

    let observer
    let mutationObserver
    let frame = 0
    let attempts = 0
    let observedCount = -1

    const connect = () => {
      const elements = sectionIds
        .map((id) => document.getElementById(id))
        .filter((element) => element !== null)

      if (elements.length === 0) return 0
      if (elements.length === observedCount) return observedCount

      observedCount = elements.length
      observer?.disconnect()
      observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

          if (visible[0]) setActive(visible[0].target.id)
        },
        { rootMargin: '-40% 0px -45% 0px', threshold: [0, 0.25] },
      )

      elements.forEach((element) => observer.observe(element))
      return observedCount
    }

    const scan = () => {
      const count = connect()
      if (count < sectionIds.length && attempts < 120) {
        attempts += 1
        frame = requestAnimationFrame(scan)
      }
    }

    const rescan = () => {
      observedCount = -1
      attempts = 0
      if (frame) cancelAnimationFrame(frame)
      frame = requestAnimationFrame(scan)
    }

    const main = document.getElementById('main')
    if (main) {
      mutationObserver = new MutationObserver(rescan)
      mutationObserver.observe(main, { childList: true })
    }

    window.addEventListener('resize', rescan)
    scan()

    return () => {
      if (frame) cancelAnimationFrame(frame)
      observer?.disconnect()
      mutationObserver?.disconnect()
      window.removeEventListener('resize', rescan)
    }
  }, [sectionIds])

  return active
}
