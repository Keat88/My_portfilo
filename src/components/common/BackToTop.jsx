import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useScrolled } from '../../hooks/useScrolled'

export default function BackToTop() {
  const { t } = useTranslation()
  const visible = useScrolled(640)

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.8, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 12 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label={t('a11y.scrollToTop')}
          className="fixed bottom-5 right-5 z-40 grid h-11 w-11 place-items-center rounded-full border border-primary/35 bg-[var(--overlay-strong)] text-primary shadow-[0_12px_40px_-16px_rgba(56,189,248,0.9)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-0.5 hover:scale-105"
        >
          <ArrowUp className="h-4 w-4" aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
