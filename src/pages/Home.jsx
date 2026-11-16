import Hero from '../components/sections/Hero'
import SectionStub from '../components/sections/SectionStub'
import Skills from '../components/sections/Skills'
import Services from '../components/sections/Services'
import Projects from '../components/sections/Projects'
import Contact from '../components/sections/Contact'
import Navbar from '../components/layout/Navbar'

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <SectionStub
          id="about"
          eyebrow="01 / About"
          title="About Me"
          description="Hello, my name is Keng Keat. I am a second-year Information Technology student studying on a 100% scholarship at The University of Cambodia. Alongside my degree, I gain hands-on industry experience working as a weekend student intern at ETEC Center. My ultimate career goal is to become a professional full-stack software engineer. I specialize in building full-stack web applications using React, Tailwind CSS, Laravel, Spring Boot, and MySQL. I love turning ideas into clean, functional user interfaces and robust backend systems, and I am always excited to tackle new technical challenges."
          phase="Phase 2"
        />
        <Skills />
        <Services />
        <Projects />
        <SectionStub
          id="journey"
          eyebrow="05 / Journey"
          title="Development Journey"
          description="A timeline of milestones, from first lines of code to production-ready systems."
          phase="Phase 3"
        />
        <Contact />
      </main>
    </>
  )
}
