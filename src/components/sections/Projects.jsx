import { ExternalLink, ImageOff } from 'lucide-react'
import { FaGithub } from 'react-icons/fa'
import ScrollReveal from '../animations/ScrollReveal'
import SectionHeading from '../common/SectionHeading'
import Container from '../layout/Container'
import { projects } from '../../data/projects'
import { cn } from '../../utils/cn'

export default function Projects() {
  return (
    <section id="projects" className="relative py-16 sm:py-20">
      <Container>
        <ScrollReveal>
          <SectionHeading
            eyebrow="04 / Projects"
            title="Featured Projects"
            description="Selected work across contact management, learning platforms, POS systems, and secure APIs."
            align="center"
            className="mb-12 sm:mb-14"
          />
        </ScrollReveal>

        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project, idx) => {
            const hasGithub = Boolean(project.githubUrl)
            const hasLive = Boolean(project.liveUrl)

            return (
              <ScrollReveal key={project.id} delay={idx * 0.08}>
                <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_24px_80px_-35px_rgba(56,189,248,0.55)]">
                  <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-white/10 bg-gradient-to-br from-[#0b1120] via-[#0f172a] to-[#101a30]">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={`${project.name} thumbnail`}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-muted">
                        <div className="grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-primary/80">
                          <ImageOff className="h-6 w-6" aria-hidden="true" />
                        </div>
                        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted/70">
                          Project thumbnail
                        </span>
                      </div>
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050816]/70 via-transparent to-transparent opacity-80" />
                    {project.status && (
                      <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-amber-200/90 backdrop-blur-sm">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-300" />
                        {project.status}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-6 sm:p-7">
                    <h3 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
                      {project.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {project.description}
                    </p>

                    {project.highlights?.length > 0 && (
                      <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-300/90">
                        {project.highlights.map((h) => (
                          <li key={h} className="flex items-center gap-1.5">
                            <span className="h-1 w-1 rounded-full bg-primary/70" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-slate-200 transition-colors hover:border-primary/40 hover:text-ink"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3 pt-2">
                      <a
                        href={hasGithub ? project.githubUrl : undefined}
                        target={hasGithub ? '_blank' : undefined}
                        rel={hasGithub ? 'noreferrer noopener' : undefined}
                        aria-disabled={!hasGithub}
                        className={cn(
                          'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300',
                          hasGithub
                            ? 'border-white/15 bg-white/[0.03] text-ink hover:-translate-y-0.5 hover:border-primary/45 hover:bg-primary/10 hover:shadow-[0_10px_30px_-12px_rgba(56,189,248,0.6)]'
                            : 'pointer-events-none cursor-not-allowed border-white/5 bg-white/[0.02] text-muted/50',
                        )}
                      >
                        <FaGithub className="h-4 w-4" aria-hidden="true" />
                        GitHub
                      </a>
                      <a
                        href={hasLive ? project.liveUrl : undefined}
                        target={hasLive ? '_blank' : undefined}
                        rel={hasLive ? 'noreferrer noopener' : undefined}
                        aria-disabled={!hasLive}
                        className={cn(
                          'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300',
                          hasLive
                            ? 'border-primary/40 bg-primary/10 text-ink hover:-translate-y-0.5 hover:border-primary/60 hover:bg-primary/15 hover:shadow-[0_10px_30px_-12px_rgba(56,189,248,0.7)]'
                            : 'pointer-events-none cursor-not-allowed border-white/5 bg-white/[0.02] text-muted/50',
                        )}
                      >
                        <ExternalLink className="h-4 w-4" aria-hidden="true" />
                        Live Demo
                      </a>
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
