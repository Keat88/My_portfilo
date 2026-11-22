import { motion, useReducedMotion } from 'framer-motion'

export default function SkillBar({ name, level, delay = 0 }) {
  const reduce = useReducedMotion()
  const scale = level / 100

  return (
    <div className="group">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-ink/90">{name}</span>
        <span className="font-mono text-xs text-primary/90">{level}%</span>
      </div>
      <div
        role="progressbar"
        aria-label={name}
        aria-valuenow={level}
        aria-valuemin={0}
        aria-valuemax={100}
        className="relative h-2.5 overflow-hidden rounded-full border border-white/10 bg-white/[0.04]"
      >
        <motion.div
          className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-gradient-to-r from-primary via-cyan to-violet shadow-[0_0_18px_-4px_rgba(56,189,248,0.9)]"
          initial={reduce ? { scaleX: scale } : { scaleX: 0 }}
          whileInView={{ scaleX: scale }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay }}
        >
          <span className="absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.35),transparent)] opacity-60" />
        </motion.div>
      </div>
    </div>
  )
}
