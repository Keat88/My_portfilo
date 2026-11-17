import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import Hero from '../components/sections/Hero'
import SectionStub from '../components/sections/SectionStub'
import Navbar from '../components/layout/Navbar'

const Skills = lazy(() => import('../components/sections/Skills'))
const Services = lazy(() => import('../components/sections/Services'))
const Projects = lazy(() => import('../components/sections/Projects'))
const Contact = lazy(() => import('../components/sections/Contact'))

export default function Home() {
  const { t } = useTranslation()

  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <SectionStub
          id="about"
          eyebrow={t('about.eyebrow')}
          title={t('about.title')}
          description={t('about.description')}
          phase={t('about.phase')}
        />
        <Suspense fallback={null}>
          <Skills />
          <Services />
          <Projects />
          <SectionStub
            id="journey"
            eyebrow={t('journey.eyebrow')}
            title={t('journey.title')}
            description={t('journey.description')}
            phase={t('journey.phase')}
          />
          <Contact />
        </Suspense>
      </main>
    </>
  )
}
