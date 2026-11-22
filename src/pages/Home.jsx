import { lazy, Suspense } from 'react'
import About from '../components/sections/About'
import Hero from '../components/sections/Hero'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/sections/Footer'
import BackToTop from '../components/common/BackToTop'

const Skills = lazy(() => import('../components/sections/Skills'))
const Services = lazy(() => import('../components/sections/Services'))
const Projects = lazy(() => import('../components/sections/Projects'))
const Journey = lazy(() => import('../components/sections/Journey'))
const Contact = lazy(() => import('../components/sections/Contact'))

function SectionFallback({ id, className }) {
  return <div id={id} aria-hidden="true" className={className} />
}

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <About />

        <Suspense fallback={<SectionFallback id="skills" className="min-h-[70vh]" />}>
          <Skills />
        </Suspense>
        <Suspense fallback={<SectionFallback id="services" className="min-h-[45vh]" />}>
          <Services />
        </Suspense>
        <Suspense fallback={<SectionFallback id="projects" className="min-h-[85vh]" />}>
          <Projects />
        </Suspense>
        <Suspense fallback={<SectionFallback id="journey" className="min-h-[65vh]" />}>
          <Journey />
        </Suspense>
        <Suspense fallback={<SectionFallback id="contact" className="min-h-[70vh]" />}>
          <Contact />
        </Suspense>
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}
