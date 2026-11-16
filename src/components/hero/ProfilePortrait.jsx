import { motion, useReducedMotion, useTransform } from 'framer-motion'
import { personalInfo } from '../../data/personalInfo'
import FloatingParticles from '../animations/FloatingParticles'
import NeonRings from '../animations/NeonRings'
import TechBadges from './TechBadges'

export default function ProfilePortrait({ parallaxX, parallaxY }) {
  const reduce = useReducedMotion()
  const ringsX = useTransform(parallaxX, [-0.5, 0.5], [18, -18])
  const ringsY = useTransform(parallaxY, [-0.5, 0.5], [14, -14])
  const portraitX = useTransform(parallaxX, [-0.5, 0.5], [-10, 10])
  const portraitY = useTransform(parallaxY, [-0.5, 0.5], [-8, 8])

  return (
    <div className="relative mx-auto w-full max-w-[19rem] sm:max-w-[24rem] lg:max-w-[29rem]">
      <div className="absolute inset-[8%] -z-10 rounded-full bg-gradient-to-br from-primary/25 via-cyan/10 to-violet/25 blur-3xl" />

      <motion.div
        style={{ x: reduce ? 0 : ringsX, y: reduce ? 0 : ringsY }}
        className="absolute inset-[-14%]"
      >
        <NeonRings />
      </motion.div>

      <FloatingParticles />

      <motion.div
        style={{ x: reduce ? 0 : portraitX, y: reduce ? 0 : portraitY }}
        className="relative z-10"
      >
        <motion.div
          animate={reduce ? undefined : { y: [0, -10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="relative aspect-square"
        >
          <div className="absolute -inset-3 rounded-full bg-[conic-gradient(from_140deg,rgba(56,189,248,0.45),rgba(34,211,238,0.1),rgba(168,85,247,0.45),rgba(56,189,248,0.1))] opacity-60 blur-2xl" />

          <div className="portrait-frame relative h-full w-full rounded-full p-[2px] shadow-[0_30px_90px_-30px_rgba(56,189,248,0.55),0_0_60px_-20px_rgba(168,85,247,0.5)]">
            <div className="h-full w-full rounded-full bg-base/90 p-[7px]">
              <div className="relative h-full w-full overflow-hidden rounded-full border border-white/10 bg-surface">
                <img
                  src={personalInfo.profileImage}
                  alt={personalInfo.profileImageAlt}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  className="h-full w-full object-cover object-center"
                />

                <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-t from-base/75 via-transparent to-transparent" />
                <div className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_0_70px_rgba(56,189,248,0.16),inset_0_0_34px_rgba(168,85,247,0.14)]" />
                <div className="pointer-events-none absolute inset-x-10 top-1 h-16 rounded-full bg-white/10 blur-2xl" />
              </div>
            </div>
          </div>

          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-[#070d1f]/90 px-4 py-1.5 font-mono text-[9px] uppercase tracking-[0.28em] text-slate-300 shadow-[0_10px_30px_-10px_rgba(2,6,23,1)] backdrop-blur-md">
            {personalInfo.role}
          </div>
        </motion.div>
      </motion.div>

      <TechBadges parallaxX={parallaxX} parallaxY={parallaxY} />
    </div>
  )
}
