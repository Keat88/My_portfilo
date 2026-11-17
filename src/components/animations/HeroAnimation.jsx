import { motion, useReducedMotion } from 'framer-motion'

export default function HeroAnimation() {
  const reduce = useReducedMotion()

  if (reduce) return null

  return (
    <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden" aria-hidden="true">
      <motion.div
        initial={{ opacity: 0, scale: 0.82 }}
        animate={{ opacity: [0, 0.9, 0], scale: [0.82, 1.04, 1.14] }}
        transition={{ duration: 1.9, times: [0, 0.28, 1], ease: 'easeOut' }}
        className="absolute left-1/2 top-[42%] h-[44rem] w-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--primary)_18%,transparent)_0%,color-mix(in_srgb,var(--violet)_10%,transparent)_42%,transparent_68%)]"
      />

      <motion.div
        initial={{ x: '-130%', opacity: 0 }}
        animate={{ x: '130%', opacity: [0, 0.55, 0] }}
        transition={{ duration: 1.7, delay: 0.12, ease: [0.65, 0, 0.35, 1] }}
        className="absolute inset-y-[-20%] left-0 w-1/3 rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent [html[data-theme='light']_&]:via-primary/10"
      />

      <motion.div
        initial={{ opacity: 0.42 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.4, delay: 0.15, ease: 'easeOut' }}
        className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--primary)_10%,transparent)_0%,transparent_48%)]"
      />

      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: [0, 0.65, 0] }}
        transition={{ duration: 1.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-0 top-[22%] h-px w-full origin-left bg-gradient-to-r from-transparent via-primary/45 to-transparent"
      />
    </div>
  )
}
