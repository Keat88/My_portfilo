import { useState } from 'react'
import { Mail, MapPin, Send } from 'lucide-react'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import ScrollReveal from '../animations/ScrollReveal'
import SectionHeading from '../common/SectionHeading'
import Container from '../layout/Container'
import { personalInfo } from '../../data/personalInfo'
import { socialLinks } from '../../data/socialLinks'

export default function Contact() {
  const { t } = useTranslation()
  const github = socialLinks.find((s) => s.id === 'github')
  const linkedin = socialLinks.find((s) => s.id === 'linkedin')
  const [values, setValues] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState(null)
  const [submitting, setSubmitting] = useState(false)

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

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
    if (status) setStatus(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setStatus(null)
    if (!validate()) return
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setStatus('success')
      setValues({ name: '', email: '', subject: '', message: '' })
    }, 400)
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
            <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8">
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
              <form onSubmit={handleSubmit} noValidate className="relative space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="flex flex-col gap-2 text-sm">
                    <span className="font-medium text-[var(--text-soft)]">{t('contact.form.name')}</span>
                    <input
                      type="text"
                      name="name"
                      autoComplete="name"
                      value={values.name}
                      onChange={handleChange}
                      placeholder={t('contact.form.namePlaceholder')}
                      className={inputClass(errors.name)}
                    />
                    {errors.name && <span className="text-xs text-red-500 [html[data-theme='dark']_&]:text-red-300">{errors.name}</span>}
                  </label>
                  <label className="flex flex-col gap-2 text-sm">
                    <span className="font-medium text-[var(--text-soft)]">{t('contact.form.email')}</span>
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      value={values.email}
                      onChange={handleChange}
                      placeholder={t('contact.form.emailPlaceholder')}
                      className={inputClass(errors.email)}
                    />
                    {errors.email && <span className="text-xs text-red-500 [html[data-theme='dark']_&]:text-red-300">{errors.email}</span>}
                  </label>
                </div>
                <label className="flex flex-col gap-2 text-sm">
                  <span className="font-medium text-[var(--text-soft)]">{t('contact.form.subject')}</span>
                  <input
                    type="text"
                    name="subject"
                    value={values.subject}
                    onChange={handleChange}
                    placeholder={t('contact.form.subjectPlaceholder')}
                    className={inputClass(errors.subject)}
                  />
                  {errors.subject && <span className="text-xs text-red-500 [html[data-theme='dark']_&]:text-red-300">{errors.subject}</span>}
                </label>
                <label className="flex flex-col gap-2 text-sm">
                  <span className="font-medium text-[var(--text-soft)]">{t('contact.form.message')}</span>
                  <textarea
                    name="message"
                    rows={6}
                    value={values.message}
                    onChange={handleChange}
                    placeholder={t('contact.form.messagePlaceholder')}
                    className={`${inputClass(errors.message)} resize-y`}
                  />
                  {errors.message && <span className="text-xs text-red-500 [html[data-theme='dark']_&]:text-red-300">{errors.message}</span>}
                </label>

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

                <button
                  type="submit"
                  disabled={submitting}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary via-cyan to-violet px-6 py-3 text-sm font-semibold text-[var(--btn-primary-fg)] shadow-[0_12px_45px_-14px_rgba(56,189,248,0.85)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_55px_-14px_rgba(56,189,248,0.95)] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                >
                  <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                  {submitting ? t('contact.form.sending') : t('contact.form.send')}
                </button>
              </form>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <div className="flex h-full flex-col gap-4">
              <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6">
                <div className="pointer-events-none absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-violet/10 blur-2xl" />
                <h3 className="relative font-display text-lg font-semibold text-ink">{t('contact.details.title')}</h3>
                <ul className="relative mt-5 space-y-4 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
                      <Mail className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted/70">{t('contact.details.emailLabel')}</p>
                      <a href={`mailto:${personalInfo.email}`} className="mt-1 block text-[var(--text-soft)] transition-colors hover:text-primary">
                        {personalInfo.email}
                      </a>
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

              <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6">
                <h3 className="font-display text-lg font-semibold text-ink">{t('contact.links.title')}</h3>
                <div className="mt-5 flex flex-wrap gap-3">
                  {github && (
                    <a
                      href={github.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-[var(--text-soft)] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/10 hover:text-ink"
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
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-[var(--text-soft)] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/10 hover:text-ink"
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
