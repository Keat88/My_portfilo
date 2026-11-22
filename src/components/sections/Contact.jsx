import { Check, Copy, Loader2, Mail, MapPin, Send } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import ScrollReveal from '../animations/ScrollReveal'
import SectionHeading from '../common/SectionHeading'
import Container from '../layout/Container'
import { personalInfo } from '../../data/personalInfo'
import { socialLinks } from '../../data/socialLinks'

const emptyValues = { name: '', email: '', subject: '', message: '' }

export default function Contact() {
  const { t } = useTranslation()
  const github = socialLinks.find((s) => s.id === 'github')
  const linkedin = socialLinks.find((s) => s.id === 'linkedin')
  const [values, setValues] = useState(emptyValues)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [copied, setCopied] = useState(false)
  const timers = useRef([])

  useEffect(
    () => () => {
      timers.current.forEach((timer) => window.clearTimeout(timer))
    },
    [],
  )

  const validate = () => {
    const next = {}
    if (!values.name.trim()) next.name = t('contact.form.validation.required')
    if (!values.email.trim()) next.email = t('contact.form.validation.required')
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = t('contact.form.validation.email')
    if (!values.subject.trim()) next.subject = t('contact.form.validation.required')
    if (!values.message.trim()) next.message = t('contact.form.validation.required')
    else if (values.message.trim().length < 10) next.message = t('contact.form.validation.minMessage')
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    if (errors[name]) setErrors((current) => ({ ...current, [name]: '' }))
    if (status) setStatus(null)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setStatus(null)
    if (!validate()) return

    setSubmitting(true)
    const timer = window.setTimeout(() => {
      setSubmitting(false)
      setStatus('success')
      setValues(emptyValues)
    }, 400)
    timers.current.push(timer)
  }

  const handleCopyEmail = async () => {
    const fallbackCopy = () => {
      const input = document.createElement('textarea')
      input.value = personalInfo.email
      input.style.position = 'fixed'
      input.style.opacity = '0'
      document.body.appendChild(input)
      input.select()
      const success = document.execCommand('copy')
      input.remove()
      return success
    }

    try {
      let success = fallbackCopy()
      if (!success && navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(personalInfo.email)
          success = true
        } catch {
          success = false
        }
      }
      if (!success) throw new Error('Copy failed')
      setCopied(true)
      const timer = window.setTimeout(() => setCopied(false), 1800)
      timers.current.push(timer)
    } catch {
      setCopied(false)
    }
  }

  const inputClass = (hasError) =>
    `w-full rounded-xl border bg-[var(--input-bg)] px-4 py-3 text-sm text-ink placeholder:text-muted/60 transition-colors focus:bg-[var(--input-bg-focus)] focus:outline-none focus:ring-1 ${
      hasError
        ? 'border-red-400/50 focus:border-red-400/60 focus:ring-red-400/30'
        : 'border-[var(--input-border)] focus:border-primary/50 focus:ring-primary/40'
    }`

  return (
    <section id="contact" className="relative py-16 sm:py-20">
      <Container>
        <ScrollReveal>
          <SectionHeading
            eyebrow={t('contact.eyebrow')}
            title={t('contact.title')}
            description={t('contact.description')}
            align="center"
            className="mb-12 sm:mb-14"
          />
        </ScrollReveal>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <ScrollReveal>
            <div className="relative h-full overflow-hidden rounded-3xl border border-[var(--card-border)] bg-[var(--card-surface)] p-6 backdrop-blur-xl sm:p-8">
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
              <form onSubmit={handleSubmit} noValidate className="relative space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="flex flex-col gap-2 text-sm">
                    <span className="font-medium text-[var(--text-soft)]">{t('contact.form.name')}</span>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      autoComplete="name"
                      value={values.name}
                      onChange={handleChange}
                      placeholder={t('contact.form.namePlaceholder')}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? 'contact-name-error' : undefined}
                      className={inputClass(errors.name)}
                    />
                    {errors.name && (
                      <span id="contact-name-error" role="alert" className="text-xs text-red-500 [html[data-theme='dark']_&]:text-red-300">
                        {errors.name}
                      </span>
                    )}
                  </label>

                  <label className="flex flex-col gap-2 text-sm">
                    <span className="font-medium text-[var(--text-soft)]">{t('contact.form.email')}</span>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      autoComplete="email"
                      value={values.email}
                      onChange={handleChange}
                      placeholder={t('contact.form.emailPlaceholder')}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? 'contact-email-error' : undefined}
                      className={inputClass(errors.email)}
                    />
                    {errors.email && (
                      <span id="contact-email-error" role="alert" className="text-xs text-red-500 [html[data-theme='dark']_&]:text-red-300">
                        {errors.email}
                      </span>
                    )}
                  </label>
                </div>

                <label className="flex flex-col gap-2 text-sm">
                  <span className="font-medium text-[var(--text-soft)]">{t('contact.form.subject')}</span>
                  <input
                    id="contact-subject"
                    type="text"
                    name="subject"
                    value={values.subject}
                    onChange={handleChange}
                    placeholder={t('contact.form.subjectPlaceholder')}
                    aria-invalid={Boolean(errors.subject)}
                    aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
                    className={inputClass(errors.subject)}
                  />
                  {errors.subject && (
                    <span id="contact-subject-error" role="alert" className="text-xs text-red-500 [html[data-theme='dark']_&]:text-red-300">
                      {errors.subject}
                    </span>
                  )}
                </label>

                <label className="flex flex-col gap-2 text-sm">
                  <span className="font-medium text-[var(--text-soft)]">{t('contact.form.message')}</span>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={6}
                    value={values.message}
                    onChange={handleChange}
                    placeholder={t('contact.form.messagePlaceholder')}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? 'contact-message-error' : undefined}
                    className={`${inputClass(errors.message)} resize-y`}
                  />
                  {errors.message && (
                    <span id="contact-message-error" role="alert" className="text-xs text-red-500 [html[data-theme='dark']_&]:text-red-300">
                      {errors.message}
                    </span>
                  )}
                </label>

                <div aria-live="polite" role="status" className="min-h-0">
                  {status === 'success' && (
                    <p className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-2.5 text-sm text-emerald-700 [html[data-theme='dark']_&]:text-emerald-200">
                      {t('contact.form.success')}
                    </p>
                  )}
                  {status === 'error' && (
                    <p className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-2.5 text-sm text-red-700 [html[data-theme='dark']_&]:text-red-200">
                      {t('contact.form.error')}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary via-cyan to-violet px-6 py-3 text-sm font-semibold text-[var(--btn-primary-fg)] shadow-[0_12px_45px_-14px_rgba(56,189,248,0.85)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_55px_-14px_rgba(56,189,248,0.95)] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                  )}
                  {submitting ? t('contact.form.sending') : t('contact.form.send')}
                </button>
              </form>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <div className="flex h-full flex-col gap-4">
              <div className="relative overflow-hidden rounded-3xl border border-[var(--card-border)] bg-[var(--card-surface)] p-6 backdrop-blur-xl">
                <div className="pointer-events-none absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-violet/10 blur-2xl" />

                <div className="relative flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary/80">
                      {t('contact.availability.label')}
                    </p>
                    <h3 className="mt-2 font-display text-lg font-semibold text-ink">
                      {t('contact.availability.title')}
                    </h3>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-emerald-600 [html[data-theme='dark']_&]:text-emerald-200">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" aria-hidden="true" />
                    {t('a11y.availability')}
                  </span>
                </div>
                <p className="relative mt-3 text-sm leading-relaxed text-muted">{t('contact.availability.description')}</p>
              </div>

              <div className="relative overflow-hidden rounded-3xl border border-[var(--card-border)] bg-[var(--card-surface)] p-6 backdrop-blur-xl">
                <div className="pointer-events-none absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
                <h3 className="relative font-display text-lg font-semibold text-ink">{t('contact.details.title')}</h3>
                <ul className="relative mt-5 space-y-4 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
                      <Mail className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted/70">{t('contact.details.emailLabel')}</p>
                      <a href={`mailto:${personalInfo.email}`} className="mt-1 block break-all text-[var(--text-soft)] transition-colors hover:text-primary">
                        {personalInfo.email}
                      </a>
                      <button
                        type="button"
                        onClick={handleCopyEmail}
                        className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-[var(--overlay-border-soft)] bg-[var(--overlay-softer)] px-3 py-1 text-xs text-muted transition-colors hover:border-primary/40 hover:text-ink"
                      >
                        {copied ? (
                          <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                        )}
                        {copied ? t('contact.copied') : t('contact.copyEmail')}
                      </button>
                      <span className="sr-only" aria-live="polite">
                        {copied ? t('a11y.emailCopied') : ''}
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
                      <MapPin className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted/70">{t('contact.details.locationLabel')}</p>
                      <p className="mt-1 text-[var(--text-soft)]">{t('contact.details.locationValue')}</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="relative overflow-hidden rounded-3xl border border-[var(--card-border)] bg-[var(--card-surface)] p-6 backdrop-blur-xl">
                <h3 className="font-display text-lg font-semibold text-ink">{t('contact.links.title')}</h3>
                <div className="mt-5 flex flex-wrap gap-3">
                  {github && (
                    <a
                      href={github.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-2 rounded-full border border-[var(--overlay-border)] bg-[var(--overlay-soft)] px-4 py-2.5 text-sm font-medium text-[var(--text-soft)] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/10 hover:text-ink"
                    >
                      <FaGithub className="h-4 w-4" aria-hidden="true" />
                      {t('contact.links.github')}
                    </a>
                  )}
                  {linkedin && (
                    <a
                      href={linkedin.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-2 rounded-full border border-[var(--overlay-border)] bg-[var(--overlay-soft)] px-4 py-2.5 text-sm font-medium text-[var(--text-soft)] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/10 hover:text-ink"
                    >
                      <FaLinkedin className="h-4 w-4" aria-hidden="true" />
                      {t('contact.links.linkedin')}
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
