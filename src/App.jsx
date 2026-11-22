import { useEffect, lazy, Suspense } from 'react'
import { MotionConfig } from 'framer-motion'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Home from './pages/Home'
import { personalInfo } from './data/personalInfo'

const AdminApp = lazy(() => import('./components/admin/AdminApp'))

function useDocumentLanguage() {
  const { i18n, t } = useTranslation()

  useEffect(() => {
    const lang = i18n.resolvedLanguage || i18n.language || 'en'
    document.documentElement.lang = lang
    document.documentElement.dir = 'ltr'

    document.title = t('meta.title')

    const setMeta = (selector, attr, value) => {
      if (!value) return
      let element = document.querySelector(selector)

      if (!element) {
        element = document.createElement('meta')
        const match = selector.match(/(name|property)="([^"]+)"/)
        if (!match) return
        element.setAttribute(match[1], match[2])
        document.head.appendChild(element)
      }

      element.setAttribute(attr, value)
    }

    const pageUrl = `${window.location.origin}${window.location.pathname}`

    setMeta('meta[name="description"]', 'content', t('meta.description'))
    setMeta('meta[name="author"]', 'content', personalInfo.name)
    setMeta('meta[property="og:title"]', 'content', t('meta.ogTitle'))
    setMeta('meta[property="og:description"]', 'content', t('meta.ogDescription'))
    setMeta('meta[property="og:site_name"]', 'content', t('meta.ogSiteName'))
    setMeta('meta[property="og:image"]', 'content', `${window.location.origin}/og-image.png`)
    setMeta('meta[property="og:image:alt"]', 'content', t('meta.ogImageAlt'))
    setMeta('meta[property="og:url"]', 'content', pageUrl)
    setMeta('meta[name="twitter:title"]', 'content', t('meta.ogTitle'))
    setMeta('meta[name="twitter:description"]', 'content', t('meta.ogDescription'))
    setMeta('meta[name="twitter:image"]', 'content', `${window.location.origin}/og-image.png`)
  }, [i18n, i18n.resolvedLanguage, t])
}

function PortfolioApp() {
  const { t } = useTranslation()

  return (
    <>
      <div className="app-bg" aria-hidden="true" />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-primary focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-[var(--btn-primary-fg)]"
      >
        {t('a11y.skipToContent')}
      </a>
      <Home />
    </>
  )
}

export default function App() {
  useDocumentLanguage()

  return (
    <MotionConfig reducedMotion="user">
      <Suspense fallback={<div className="min-h-screen bg-[var(--background)]" />}>
        <Routes>
          <Route path="/" element={<PortfolioApp />} />
          <Route path="/admin/*" element={<AdminApp />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </MotionConfig>
  )
}
