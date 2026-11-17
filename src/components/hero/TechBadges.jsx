import { FaJava, FaReact } from 'react-icons/fa'
import { SiDocker, SiLaravel, SiMysql, SiSpringboot } from 'react-icons/si'
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
  {
    name: 'Docker',
    Icon: SiDocker,
    color: '#2496ed',
    position: 'left-0 top-[52%] sm:-translate-x-1/4',
    depth: 30,
    desktopOnly: true,
  },
  {
    name: 'Laravel',
    Icon: SiLaravel,
    color: '#ff2d20',
    position: 'right-0 top-[46%] sm:translate-x-1/4',
    depth: 36,
    desktopOnly: true,
  },
]

function TechBadge({ badge, index, parallaxX, parallaxY, active, reduce }) {
  const x = useTransform(parallaxX, [-0.5, 0.5], [badge.depth, -badge.depth])
  const y = useTransform(parallaxY, [-0.5, 0.5], [badge.depth * 0.7, -badge.depth * 0.7])
  const { Icon } = badge

  return (
    <motion.div
      style={{ x: active ? x : 0, y: active ? y : 0 }}
      initial={reduce ? false : { opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.65, delay: 0.7 + index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className={cn('absolute', badge.position, badge.desktopOnly && 'hidden sm:block')}
    >
      <div
        className="animate-float flex items-center gap-2 rounded-2xl border border-[var(--overlay-border)] bg-[var(--badge-bg)] px-2.5 py-2 shadow-[var(--shadow-glow)] backdrop-blur-md"
        style={{
          animationDuration: `${5 + index}s`,
          animationDelay: `${index * 0.4}s`,
        }}
      >
        <Icon aria-hidden="true" className="h-4 w-4 shrink-0" style={{ color: badge.color }} />
        <span className="whitespace-nowrap text-[11px] font-medium text-[var(--text-soft)]">
          {badge.name}
        </span>
      </div>
    </motion.div>
  )
}

export default function TechBadges({ parallaxX, parallaxY, parallax = true }) {
  const reduce = useReducedMotion()
  const active = parallax && !reduce

  return (
    <div className="pointer-events-none absolute inset-0 z-20" aria-hidden="true">
      {badges.map((badge, index) => (
        <TechBadge
          key={badge.name}
          badge={badge}
          index={index}
          parallaxX={parallaxX}
          parallaxY={parallaxY}
          active={active}
          reduce={reduce}
        />
      ))}
    </div>
  )
}
