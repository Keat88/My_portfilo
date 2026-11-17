import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { cn } from '../../utils/cn'

const TAU = Math.PI * 2
const MAX_DPR = 1.5
const FRAME_INTERVAL = 1000 / 45

function parseColor(value) {
  if (!value) return null

  const color = value.trim()

  if (color.startsWith('#')) {
    const hex = color.slice(1)
    const full =
      hex.length === 3
        ? hex
            .split('')
            .map((char) => char + char)
            .join('')
        : hex

    if (!/^[0-9a-f]{6}$/i.test(full)) return null

    const int = Number.parseInt(full, 16)
    return [(int >> 16) & 255, (int >> 8) & 255, int & 255]
  }

  const rgb = color.match(/[\d.]+/g)
  if (!rgb || rgb.length < 3) return null
  return rgb.slice(0, 3).map((part) => Math.round(Number(part)))
}

function readPalette() {
  const root = document.documentElement
  const styles = window.getComputedStyle(root)

  const primary = parseColor(styles.getPropertyValue('--primary')) ?? [56, 189, 248]
  const violet = parseColor(styles.getPropertyValue('--violet')) ?? [168, 85, 247]
  const cyan = parseColor(styles.getPropertyValue('--cyan')) ?? [34, 211, 238]

  return {
    dark: root.getAttribute('data-theme') !== 'light',
    primary,
    violet,
    cyan,
  }
}

function rgb(color) {
  return `rgb(${color[0]}, ${color[1]}, ${color[2]})`
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

export default function ParticleNetwork({ paused = false, className }) {
  const canvasRef = useRef(null)
  const reduce = useReducedMotion()
  const controlsRef = useRef({ start: () => {}, stop: () => {} })
  const pausedRef = useRef(paused)

  useEffect(() => {
    pausedRef.current = paused
    if (paused) controlsRef.current.stop()
    else controlsRef.current.start()
  }, [paused])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return undefined

    const reduced = Boolean(reduce)
    let palette = readPalette()
    let width = 0
    let height = 0
    let dpr = 1
    let particles = []
    let raf = 0
    let idleId = null
    let timeoutId = null
    let running = false
    let visible = true
    let lastFrame = 0

    const pointer = { x: -9999, y: -9999, active: false }

    const getConfig = () => {
      const compact = width < 640
      return {
        count: compact ? 22 : width < 1024 ? 46 : 68,
        link: compact ? 88 : 120,
        mouse: compact ? 0 : 150,
        speed: 0.24,
      }
    }

    const seed = () => {
      const { count } = getConfig()
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.3 + 0.7,
        tone: Math.random(),
      }))
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = Math.max(1, Math.round(rect.width))
      height = Math.max(1, Math.round(rect.height))
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)

      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      seed()
      draw(false)
    }

    const draw = (update) => {
      if (!width || !height) return

      const config = getConfig()
      const linkAlpha = palette.dark ? 0.24 : 0.14
      const nodeAlpha = palette.dark ? 0.9 : 0.62
      const linkSquared = config.link * config.link

      ctx.clearRect(0, 0, width, height)

      if (update) {
        for (const particle of particles) {
          if (pointer.active && config.mouse > 0) {
            const dx = particle.x - pointer.x
            const dy = particle.y - pointer.y
            const distanceSquared = dx * dx + dy * dy

            if (distanceSquared > 1 && distanceSquared < config.mouse * config.mouse) {
              const distance = Math.sqrt(distanceSquared)
              const force = (1 - distance / config.mouse) * 0.05
              particle.vx += (dx / distance) * force
              particle.vy += (dy / distance) * force
            }
          }

          particle.vx = clamp(particle.vx + (Math.random() - 0.5) * 0.006, -0.6, 0.6)
          particle.vy = clamp(particle.vy + (Math.random() - 0.5) * 0.006, -0.6, 0.6)
          particle.x += particle.vx
          particle.y += particle.vy

          if (particle.x < -24) particle.x = width + 24
          else if (particle.x > width + 24) particle.x = -24
          if (particle.y < -24) particle.y = height + 24
          else if (particle.y > height + 24) particle.y = -24
        }
      }

      ctx.lineWidth = 1
      ctx.globalAlpha = 1

      for (let i = 0; i < particles.length; i += 1) {
        const source = particles[i]
        const tint = i % 4 === 0 ? palette.violet : i % 5 === 0 ? palette.cyan : palette.primary
        ctx.strokeStyle = rgb(tint)

        for (let j = i + 1; j < particles.length; j += 1) {
          const target = particles[j]
          const dx = source.x - target.x
          const dy = source.y - target.y
          const distanceSquared = dx * dx + dy * dy

          if (distanceSquared > linkSquared) continue

          ctx.globalAlpha = (1 - Math.sqrt(distanceSquared) / config.link) * linkAlpha
          ctx.beginPath()
          ctx.moveTo(source.x, source.y)
          ctx.lineTo(target.x, target.y)
          ctx.stroke()
        }
      }

      if (pointer.active && config.mouse > 0) {
        ctx.strokeStyle = rgb(palette.cyan)
        const mouseLink = config.mouse * 0.86
        const mouseSquared = mouseLink * mouseLink

        for (const particle of particles) {
          const dx = particle.x - pointer.x
          const dy = particle.y - pointer.y
          const distanceSquared = dx * dx + dy * dy

          if (distanceSquared > mouseSquared) continue

          ctx.globalAlpha = (1 - Math.sqrt(distanceSquared) / mouseLink) * (palette.dark ? 0.4 : 0.24)
          ctx.beginPath()
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(pointer.x, pointer.y)
          ctx.stroke()
        }
      }

      for (const particle of particles) {
        const tint =
          particle.tone < 0.5 ? palette.primary : particle.tone < 0.82 ? palette.cyan : palette.violet

        ctx.fillStyle = rgb(tint)
        ctx.globalAlpha = palette.dark ? 0.12 : 0.08
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius * 3.6, 0, TAU)
        ctx.fill()

        ctx.globalAlpha = nodeAlpha
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, TAU)
        ctx.fill()
      }

      ctx.globalAlpha = 1
    }

    const stop = () => {
      running = false
      if (raf) cancelAnimationFrame(raf)
      raf = 0
    }

    const step = (time) => {
      if (!running) return

      if (document.hidden) {
        running = false
        raf = 0
        return
      }

      raf = requestAnimationFrame(step)

      if (time - lastFrame < FRAME_INTERVAL) return
      lastFrame = time
      draw(true)
    }

    const start = () => {
      if (running || reduced || !visible || pausedRef.current) return
      running = true
      lastFrame = 0
      raf = requestAnimationFrame(step)
    }

    controlsRef.current = { start, stop }

    const onVisibilityChange = () => {
      if (document.hidden) stop()
      else start()
    }

    const onPointerMove = (event) => {
      if (reduced || getConfig().mouse === 0 || event.pointerType === 'touch') return

      const rect = canvas.getBoundingClientRect()
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom

      pointer.active = inside
      pointer.x = event.clientX - rect.left
      pointer.y = event.clientY - rect.top
    }

    const onPointerOut = (event) => {
      if (!event.relatedTarget) pointer.active = false
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) start()
        else stop()
      },
      { rootMargin: '120px 0px' },
    )
    intersectionObserver.observe(canvas)

    const themeObserver = new MutationObserver(() => {
      palette = readPalette()
      if (!running) draw(false)
    })
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    document.addEventListener('visibilitychange', onVisibilityChange)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerout', onPointerOut, { passive: true })

    resize()

    if (reduced) {
      draw(false)
    } else if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(() => {
        idleId = null
        start()
      }, { timeout: 1200 })
    } else {
      timeoutId = window.setTimeout(start, 320)
    }

    return () => {
      stop()
      controlsRef.current = { start: () => {}, stop: () => {} }
      if (idleId !== null && 'cancelIdleCallback' in window) window.cancelIdleCallback(idleId)
      if (timeoutId !== null) window.clearTimeout(timeoutId)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      themeObserver.disconnect()
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerout', onPointerOut)
    }
  }, [reduce])

  useEffect(() => () => controlsRef.current.stop(), [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
    />
  )
}
