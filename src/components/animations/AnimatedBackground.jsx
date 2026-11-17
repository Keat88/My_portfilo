import { motion, useReducedMotion, useTransform } from 'framer-motion'
import { cn } from '../../utils/cn'
import ParticleNetwork from './ParticleNetwork'

export default function AnimatedBackground({
  parallaxX,
  parallaxY,
  showMesh = false,
  showSpotlight = false,
  paused = false,
}) {
  const reduce = useReducedMotion()
  const spotX = useTransform(parallaxX ?? 0, [-0.5, 0.5], [-260, 260])
  const spotY = useTransform(parallaxY ?? 0, [-0.5, 0.5], [-200, 200])
  const meshX = useTransform(parallaxX ?? 0, [-0.5, 0.5], [-18, 18])
  const meshY = useTransform(parallaxY ?? 0, [-0.5, 0.5], [-12, 12])
  const gridX = useTransform(parallaxX ?? 0, [-0.5, 0.5], [-8, 8])
  const gridY = useTransform(parallaxY ?? 0, [-0.5, 0.5], [-6, 6])
  const parallaxActive = !reduce && !paused
  const spotlightActive = showSpotlight && !reduce && !paused

  return (
    <div
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', paused && 'anim-paused')}
      aria-hidden="true"
    >
      <motion.div
        style={{ x: parallaxActive ? gridX : 0, y: parallaxActive ? gridY : 0 }}
        className="absolute inset-[-3%]"
      >
        <div className="bg-grid absolute inset-0 opacity-70 [html[data-theme='light']_&]:opacity-40" />
      </motion.div>

      {showMesh && (
        <motion.div
          style={{ x: parallaxActive ? meshX : 0, y: parallaxActive ? meshY : 0 }}
          className="absolute inset-[-10%]"
        >
          <div className="bg-mesh absolute inset-0" />
          <div className="bg-mesh bg-mesh--deep absolute inset-0" />
        </motion.div>
      )}

      <div className="absolute left-1/2 top-[-24%] h-[32rem] w-[64rem] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--primary)_12%,transparent)_0%,transparent_66%)] blur-2xl" />

      <div
        className="aurora-blob -left-28 top-[-18%] h-[26rem] w-[26rem] bg-primary/25 sm:h-[38rem] sm:w-[38rem]"
        style={{ '--duration': '22s' }}
      />
      <div
        className="aurora-blob right-[-18%] top-[4%] h-[24rem] w-[24rem] bg-violet/25 sm:h-[34rem] sm:w-[34rem]"
        style={{ '--duration': '26s', '--delay': '-7s' }}
      />
      <div
        className="aurora-blob aurora-blob--soft bottom-[-24%] left-[26%] h-[22rem] w-[22rem] bg-cyan/15 sm:h-[30rem] sm:w-[30rem]"
        style={{ '--duration': '30s', '--delay': '-14s' }}
      />

      <ParticleNetwork
        paused={paused}
        className="opacity-70 [html[data-theme='light']_&]:opacity-45"
      />

      <div className="bg-noise absolute inset-0" />

      {showSpotlight && (
        <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_32%,color-mix(in_srgb,var(--primary)_5%,transparent)_50%,transparent_68%)] opacity-70" />
      )}

      {spotlightActive && (
        <div className="absolute inset-0 mix-blend-screen [html[data-theme='light']_&]:mix-blend-multiply [html[data-theme='light']_&]:opacity-50">
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              style={{
                x: spotX,
                y: spotY,
                background:
                  'radial-gradient(circle, color-mix(in srgb, var(--primary) 22%, transparent) 0%, transparent 58%)',
              }}
              className="h-[70rem] w-[70rem] shrink-0 rounded-full"
            />
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,var(--hero-fade)_88%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--overlay-border)] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-base to-transparent" />
    </div>
  )
}
