import { motion, useReducedMotion, useTransform } from 'framer-motion'

export default function AnimatedBackground({ parallaxX, parallaxY, showMesh = false, showSpotlight = false }) {
  const reduce = useReducedMotion()
  const spotX = useTransform(parallaxX ?? 0, (v) => `${50 + (v || 0) * 35}%`)
  const spotY = useTransform(parallaxY ?? 0, (v) => `${45 + (v || 0) * 35}%`)

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="bg-grid absolute inset-0 opacity-70 [html[data-theme='light']_&]:opacity-40" />
      {showMesh && <div className="bg-mesh absolute inset-[-10%]" />}

      <div
        className="aurora-blob -left-28 top-[-18%] h-[26rem] w-[26rem] bg-primary/25 sm:h-[38rem] sm:w-[38rem]"
        style={{ '--duration': '22s' }}
      />
      <div
        className="aurora-blob right-[-18%] top-[4%] h-[24rem] w-[24rem] bg-violet/25 sm:h-[34rem] sm:w-[34rem]"
        style={{ '--duration': '26s', '--delay': '-7s' }}
      />
      <div
        className="aurora-blob bottom-[-24%] left-[26%] h-[22rem] w-[22rem] bg-cyan/15 sm:h-[30rem] sm:w-[30rem]"
        style={{ '--duration': '30s', '--delay': '-14s' }}
      />

      {showSpotlight && !reduce && (
        <motion.div
          className="absolute inset-0 mix-blend-screen [html[data-theme='light']_&]:mix-blend-multiply [html[data-theme='light']_&]:opacity-50"
          style={{
            background: useTransform(
              [spotX, spotY],
              ([x, y]) =>
                `radial-gradient(520px circle at ${x} ${y}, color-mix(in srgb, var(--primary) 22%, transparent), transparent 60%)`,
            ),
          }}
        />
      )}

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,var(--hero-fade)_88%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--overlay-border)] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-base to-transparent" />
    </div>
  )
}
