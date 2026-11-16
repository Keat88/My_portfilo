import { Mail, MapPin, Send } from 'lucide-react'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import ScrollReveal from '../animations/ScrollReveal'
import SectionHeading from '../common/SectionHeading'
import Container from '../layout/Container'
import { personalInfo } from '../../data/personalInfo'
import { socialLinks } from '../../data/socialLinks'

export default function Contact() {
  const github = socialLinks.find((s) => s.id === 'github')
  const linkedin = socialLinks.find((s) => s.id === 'linkedin')

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <section id="contact" className="relative py-16 sm:py-20">
      <Container>
        <ScrollReveal>
          <SectionHeading
            eyebrow="06 / Contact"
            title="Let's Work Together"
            description="Have a project, a role, or an idea worth building? Send a message and I’ll get back to you."
            align="center"
            className="mb-12 sm:mb-14"
          />
        </ScrollReveal>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <ScrollReveal>
            <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-sm sm:p-8">
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
              <form onSubmit={handleSubmit} className="relative space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="flex flex-col gap-2 text-sm">
                    <span className="font-medium text-slate-200">Name</span>
                    <input
                      type="text"
                      name="name"
                      autoComplete="name"
                      placeholder="Your name"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-ink placeholder:text-muted/60 transition-colors focus:border-primary/50 focus:bg-white/[0.05] focus:outline-none focus:ring-1 focus:ring-primary/40"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm">
                    <span className="font-medium text-slate-200">Email</span>
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-ink placeholder:text-muted/60 transition-colors focus:border-primary/50 focus:bg-white/[0.05] focus:outline-none focus:ring-1 focus:ring-primary/40"
                    />
                  </label>
                </div>
                <label className="flex flex-col gap-2 text-sm">
                  <span className="font-medium text-slate-200">Subject</span>
                  <input
                    type="text"
                    name="subject"
                    placeholder="How can I help?"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-ink placeholder:text-muted/60 transition-colors focus:border-primary/50 focus:bg-white/[0.05] focus:outline-none focus:ring-1 focus:ring-primary/40"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm">
                  <span className="font-medium text-slate-200">Message</span>
                  <textarea
                    name="message"
                    rows={6}
                    placeholder="Tell me about your project or idea..."
                    className="w-full resize-y rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-ink placeholder:text-muted/60 transition-colors focus:border-primary/50 focus:bg-white/[0.05] focus:outline-none focus:ring-1 focus:ring-primary/40"
                  />
                </label>
                <button
                  type="submit"
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary via-cyan to-violet px-6 py-3 text-sm font-semibold text-[#04101f] shadow-[0_12px_45px_-14px_rgba(56,189,248,0.85)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_55px_-14px_rgba(56,189,248,0.95)] sm:w-auto"
                >
                  <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                  Send Message
                </button>
              </form>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <div className="flex h-full flex-col gap-4">
              <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-sm">
                <div className="pointer-events-none absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-violet/10 blur-2xl" />
                <h3 className="relative font-display text-lg font-semibold text-ink">Contact details</h3>
                <ul className="relative mt-5 space-y-4 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
                      <Mail className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted/70">Email</p>
                      <a href={`mailto:${personalInfo.email}`} className="mt-1 block text-slate-200 transition-colors hover:text-primary">
                        {personalInfo.email}
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
                      <MapPin className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted/70">Location</p>
                      <p className="mt-1 text-slate-200">Cambodia</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-sm">
                <h3 className="font-display text-lg font-semibold text-ink">Links</h3>
                <div className="mt-5 flex flex-wrap gap-3">
                  {github && (
                    <a
                      href={github.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-slate-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/10 hover:text-ink"
                    >
                      <FaGithub className="h-4 w-4" aria-hidden="true" />
                      GitHub
                    </a>
                  )}
                  {linkedin && (
                    <a
                      href={linkedin.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-slate-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/10 hover:text-ink"
                    >
                      <FaLinkedin className="h-4 w-4" aria-hidden="true" />
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  )
}
