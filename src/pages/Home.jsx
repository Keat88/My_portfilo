import { useTranslation } from 'react-i18next'
import Hero from '../components/sections/Hero'
import SectionStub from '../components/sections/SectionStub'
import Skills from '../components/sections/Skills'
import Services from '../components/sections/Services'
import Projects from '../components/sections/Projects'
import Contact from '../components/sections/Contact'
import Navbar from '../components/layout/Navbar'

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
      </main>
    </>
  )
}
