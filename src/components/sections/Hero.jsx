import { motion, useInView, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { personalInfo } from '../../data/personalInfo'
import { usePointerFine } from '../../hooks/usePointerFine'
import AnimatedBackground from '../animations/AnimatedBackground'
import TextReveal from '../animations/TextReveal'
import Button from '../common/Button'
import SocialLinks from '../common/SocialLinks'
import Container from '../layout/Container'
import ProfilePortrait from '../hero/ProfilePortrait'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
}

const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
}

export default function Hero() {
  const { t } = useTranslation()
  const heroRef = useRef(null)
  const reduce = useReducedMotion()
  const pointerFine = usePointerFine()
  const inView = useInView(heroRef, { margin: '150px 0px 150px 0px' })
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const parallaxX = useSpring(rawX, { stiffness: 55, damping: 18, mass: 0.6 })
  const parallaxY = useSpring(rawY, { stiffness: 55, damping: 18, mass: 0.6 })
  const frameRef = useRef(0)
  const pointRef = useRef({ x: 0, y: 0 })
  const canParallax = pointerFine && !reduce && inView

  const handlePointerMove = (event) => {
    if (!canParallax) return

    pointRef.current.x = event.clientX / window.innerWidth - 0.5
    pointRef.current.y = event.clientY / window.innerHeight - 0.5

    if (frameRef.current) return
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = 0
      rawX.set(pointRef.current.x)
      rawY.set(pointRef.current.y)
    })
  }

  useEffect(() => () => cancelAnimationFrame(frameRef.current), [])

  const resetParallax = () => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current)
      frameRef.current = 0
    }
    rawX.set(0)
    rawY.set(0)
  }

  const [firstName, ...restName] = personalInfo.name.split(' ')
  const lastName = restName.join(' ')

  return (
    <section
      ref={heroRef}
      id="home"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetParallax}
      className={`relative isolate overflow-hidden pb-20 pt-28 sm:pt-36 lg:min-h-screen lg:pb-24 lg:pt-40${inView ? '' : ' anim-paused'}`}
    >
      <AnimatedBackground
        parallaxX={parallaxX}
        parallaxY={parallaxY}
        showMesh
        showSpotlight
        paused={!inView}
      />

      <Container className="relative z-10">
        <div className="grid items-center gap-14 sm:gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <motion.div
            variants={container}
            initial={reduce ? false : 'hidden'}
            animate="show"
            className="relative"
          >
            <motion.div variants={item} className="flex items-center gap-3">
              <span className="h-px w-10 bg-gradient-to-r from-primary to-transparent" />
              <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-primary/90">
                {t('hero.greeting')}
              </span>
            </motion.div>

            <motion.h1
              variants={item}
              className="mt-5 font-display text-5xl font-semibold leading-[0.95] tracking-tight text-ink sm:text-6xl lg:text-7xl"
            >
              <TextReveal text={firstName} as="span" className="inline-block" delay={0.1} stagger={0.045} />
              {lastName && (
                <>
                  {' '}
                  <TextReveal
                    text={lastName}
                    as="span"
                    className="text-gradient-animated inline-block"
                    delay={0.35}
                    stagger={0.045}
                  />
                </>
              )}
            </motion.h1>

            <motion.div variants={item} className="mt-6 flex items-center gap-3">
              <span className="h-8 w-[2px] rounded-full bg-gradient-to-b from-primary via-cyan to-violet" />
              <motion.p
                className="font-display text-lg text-[var(--text-soft)] sm:text-xl"
                initial={reduce ? false : { opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
              >
                {t('hero.role')}
              </motion.p>
            </motion.div>

            <motion.p
              variants={item}
              className="mt-6 max-w-xl text-sm leading-relaxed text-muted sm:text-[var(--text-soft)]"
            >
              {t('hero.description')}
            </motion.p>

            <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-3">
              <Button href="#contact" size="lg" icon={ArrowUpRight}>
                {t('hero.talk')}
              </Button>
              <Button href="#projects" size="lg" variant="outline" icon={ArrowDown}>
                {t('hero.explore')}
              </Button>
              {/* <Button
                href={personalInfo.cvUrl}
                download
                size="lg"
                variant="ghost"
                icon={Download}
                iconPosition="left"
                className="px-3"
              >
                {t('hero.downloadCV')}
              </Button> */}
            </motion.div>

            <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted/70">
                {t('hero.findMeOn')}
              </span>
              <span className="hidden h-px w-8 bg-[var(--overlay-border-soft)] sm:block" />
              <SocialLinks />
            </motion.div>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <ProfilePortrait
              parallaxX={parallaxX}
              parallaxY={parallaxY}
              parallax={canParallax}
              paused={!inView}
            />
          </motion.div>
        </div>
      </Container>

      <a
        href="#about"
        aria-label={t('a11y.scrollToAbout')}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-muted transition-colors hover:text-ink lg:flex"
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.3em]">{t('hero.scroll')}</span>
        <span className="relative flex h-8 w-5 justify-center rounded-full border border-[var(--overlay-border)] pt-1.5">
          <span className="animate-scroll-dot h-1 w-1 rounded-full bg-primary" />
        </span>
      </a>
    </section>
  )
}
