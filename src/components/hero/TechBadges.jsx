import { FaJava, FaReact } from 'react-icons/fa'
import { SiMysql, SiSpringboot } from 'react-icons/si'
import { motion, useReducedMotion, useTransform } from 'framer-motion'
import { cn } from '../../utils/cn'

const badges = [
  {
    name: 'Java',
    Icon: FaJava,
    color: '#f89820',
    position: 'left-0 top-[18%] sm:-translate-x-1/4',
    depth: 26,
  },
  {
    name: 'Spring Boot',
    Icon: SiSpringboot,
    color: '#6db33f',
    position: 'right-0 top-[10%] sm:translate-x-1/4',
    depth: 38,
  },
  {
    name: 'React',
    Icon: FaReact,
    color: '#61dafb',
    position: 'bottom-[16%] left-0 sm:-translate-x-1/4',
    depth: 32,
  },
  {
    name: 'MySQL',
    Icon: SiMysql,
    color: '#4479a1',
    position: 'bottom-[8%] right-0 sm:translate-x-1/4',
    depth: 22,
  },
]

function TechBadge({ badge, index, parallaxX, parallaxY, reduce }) {
  const x = useTransform(parallaxX, [-0.5, 0.5], [badge.depth, -badge.depth])
  const y = useTransform(parallaxY, [-0.5, 0.5], [badge.depth * 0.7, -badge.depth * 0.7])
  const { Icon } = badge

  return (
    <motion.div
      style={{ x: reduce ? 0 : x, y: reduce ? 0 : y }}
      className={cn('absolute', badge.position)}
    >
      <motion.div
        animate={reduce ? undefined : { y: [0, -7, 0] }}
        transition={{
          duration: 5 + index,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: index * 0.4,
        }}
        className="flex items-center gap-2 rounded-2xl border border-[var(--overlay-border)] bg-[var(--badge-bg)] px-2.5 py-2 shadow-[var(--shadow-glow)] backdrop-blur-md"
      >
        <Icon aria-hidden="true" className="h-4 w-4 shrink-0" style={{ color: badge.color }} />
        <span className="whitespace-nowrap text-[11px] font-medium text-[var(--text-soft)]">
          {badge.name}
        </span>
      </motion.div>
    </motion.div>
  )
}

export default function TechBadges({ parallaxX, parallaxY }) {
  const reduce = useReducedMotion()

  return (
    <div className="pointer-events-none absolute inset-0 z-20" aria-hidden="true">
      {badges.map((badge, index) => (
        <TechBadge
          key={badge.name}
          badge={badge}
          index={index}
          parallaxX={parallaxX}
          parallaxY={parallaxY}
          reduce={reduce}
        />
      ))}
    </div>
  )
}
