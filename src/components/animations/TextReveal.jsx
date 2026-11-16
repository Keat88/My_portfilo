import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '../../utils/cn'

export default function TextReveal({
  text,
  as: Tag = 'span',
  className,
  delay = 0,
  stagger = 0.035,
  once = true,
  type = 'chars',
}) {
  const reduce = useReducedMotion()
  const MotionTag = motion.create(Tag)

  if (reduce) {
    return <Tag className={className}>{text}</Tag>
  }

  const tokens = type === 'words' ? text.split(/(\s+)/) : Array.from(text)

  return (
    <MotionTag
      className={cn('inline-block', className)}
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      aria-label={text}
    >
      {tokens.map((token, i) => (
        <motion.span
          key={`${token}-${i}`}
          className="inline-block"
          style={{ whiteSpace: token.trim() === '' ? 'pre' : undefined }}
          aria-hidden="true"
          variants={{
            hidden: { opacity: 0, y: '0.6em', filter: 'blur(8px)' },
            show: {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
            },
          }}
        >
          {token === ' ' ? '\u00A0' : token}
        </motion.span>
      ))}
    </MotionTag>
  )
}
