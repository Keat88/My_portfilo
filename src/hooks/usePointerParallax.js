import { useEffect, useRef } from 'react'
import { useInView, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { usePointerFine } from './usePointerFine'

export function usePointerParallax(
  ref,
  { margin = '150px 0px 150px 0px', strength = 1 } = {},
) {
  const reduce = useReducedMotion()
  const pointerFine = usePointerFine()
  const inView = useInView(ref, { margin })
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 55, damping: 18, mass: 0.6 })
  const y = useSpring(rawY, { stiffness: 55, damping: 18, mass: 0.6 })
  const frameRef = useRef(0)
  const pointRef = useRef({ x: 0, y: 0 })
  const active = pointerFine && !reduce && inView

  useEffect(() => () => cancelAnimationFrame(frameRef.current), [])

  useEffect(() => {
    if (active) return
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current)
      frameRef.current = 0
    }
    rawX.set(0)
    rawY.set(0)
  }, [active, rawX, rawY])

  const onPointerMove = (event) => {
    if (!active) return

    pointRef.current.x = (event.clientX / window.innerWidth - 0.5) * strength
    pointRef.current.y = (event.clientY / window.innerHeight - 0.5) * strength

    if (frameRef.current) return
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = 0
      rawX.set(pointRef.current.x)
      rawY.set(pointRef.current.y)
    })
  }

  const onPointerLeave = () => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current)
      frameRef.current = 0
    }
    rawX.set(0)
    rawY.set(0)
  }

  return { x, y, active, inView, onPointerMove, onPointerLeave }
}
