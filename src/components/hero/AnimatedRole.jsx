import { useReducedMotion } from 'framer-motion'
import TextReveal from '../animations/TextReveal'

export default function AnimatedRole({ text, delay = 0 }) {
  const reduce = useReducedMotion()

  return (
    <div className="role-shine relative inline-flex max-w-full flex-wrap items-center gap-x-1">
      {reduce ? (
        <span className="text-[var(--text-soft)]">{text}</span>
      ) : (
        <TextReveal
          text={text}
          type="words"
          delay={delay}
          stagger={0.06}
          className="text-[var(--text-soft)]"
        />
      )}
      <span
        aria-hidden="true"
        className="animate-caret inline-block h-[1.05em] w-[2px] rounded-full bg-gradient-to-b from-primary via-cyan to-violet align-middle"
      />
    </div>
  )
}
