import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '../../utils/cn'

const MOTION_TAGS = {
  span: motion.span,
  div: motion.div,
  p: motion.p,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
}

const graphemeSegmenter =
  typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function'
    ? new Intl.Segmenter(undefined, { granularity: 'grapheme' })
    : null

function splitText(text, type) {
  if (type === 'words') return text.split(/(\s+)/)
  if (graphemeSegmenter) return Array.from(graphemeSegmenter.segment(text), (entry) => entry.segment)
  return Array.from(text)
}

export default function TextReveal({
  text,
  as: Tag = 'span',
  className,
  delay = 0,
  stagger = 0.035,
  type = 'chars',
}) {
  const reduce = useReducedMotion()
  const MotionTag = MOTION_TAGS[Tag] ?? motion.span

  if (reduce) {
    return <MotionTag className={className}>{text}</MotionTag>
  }

  const tokens = splitText(text, type)

  return (
    <MotionTag
      className={cn('inline-block', className)}
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      <span className="sr-only">{text}</span>
      <motion.span aria-hidden="true" className="inline-block" style={{ perspective: 800 }}>
        {tokens.map((token, i) => (
          <motion.span
            key={`${token}-${i}`}
            className="inline-block"
            style={{
              whiteSpace: token.trim() === '' ? 'pre' : undefined,
              transformOrigin: '50% 100%',
              transformStyle: 'preserve-3d',
            }}
            variants={{
              hidden: { opacity: 0, y: '0.55em', rotateX: -62, filter: 'blur(7px)' },
              show: {
                opacity: 1,
                y: 0,
                rotateX: 0,
                filter: 'blur(0px)',
                transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] },
              },
            }}
          >
            {token === ' ' ? '\u00A0' : token}
          </motion.span>
        ))}
      </motion.span>
    </MotionTag>
  )
}
