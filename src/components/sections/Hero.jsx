import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { ArrowDown, ArrowUpRight, Download } from 'lucide-react'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { personalInfo } from '../../data/personalInfo'
import AnimatedBackground from '../animations/AnimatedBackground'
import Button from '../common/Button'
import SocialLinks from '../common/SocialLinks'
import Container from '../layout/Container'
import ProfilePortrait from '../hero/ProfilePortrait'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

export default function Hero() {
  const { t } = useTranslation()
  const heroRef = useRef(null)
  const reduce = useReducedMotion()
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const parallaxX = useSpring(rawX, { stiffness: 55, damping: 16, mass: 0.5 })
  const parallaxY = useSpring(rawY, { stiffness: 55, damping: 16, mass: 0.5 })

  const handlePointerMove = (event) => {
    if (reduce || event.pointerType === 'touch') return

    const rect = heroRef.current?.getBoundingClientRect()
    if (!rect) return

    rawX.set((event.clientX - rect.left) / rect.width - 0.5)
    rawY.set((event.clientY - rect.top) / rect.height - 0.5)
  }

  const resetParallax = () => {
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
      className="relative isolate overflow-hidden pb-20 pt-28 sm:pt-36 lg:min-h-screen lg:pb-24 lg:pt-40"
    >
      <AnimatedBackground />

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
              {firstName}
              {lastName && (
                <>
                  {' '}
                  <span className="text-gradient">{lastName}</span>
                </>
              )}
            </motion.h1>

            <motion.div variants={item} className="mt-6 flex items-center gap-3">
              <span className="h-8 w-[2px] rounded-full bg-gradient-to-b from-primary via-cyan to-violet" />
              <p className="font-display text-lg text-[var(--text-soft)] sm:text-xl">
                {t('hero.role')}
              </p>
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
              <Button
                href={personalInfo.cvUrl}
                download
                size="lg"
                variant="ghost"
                icon={Download}
                iconPosition="left"
                className="px-3"
              >
                {t('hero.downloadCV')}
              </Button>
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
            initial={reduce ? false : { opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <ProfilePortrait parallaxX={parallaxX} parallaxY={parallaxY} />
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
