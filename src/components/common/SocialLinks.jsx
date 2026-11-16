import { Link2 } from 'lucide-react'
import { FaFacebook, FaGithub, FaLinkedin, FaTelegram } from 'react-icons/fa'
import { socialLinks } from '../../data/socialLinks'
import { cn } from '../../utils/cn'

const iconMap = {
  github: FaGithub,
  linkedin: FaLinkedin,
  facebook: FaFacebook,
  telegram: FaTelegram,
}

export default function SocialLinks({ className, size = 'md' }) {
  return (
    <ul className={cn('flex items-center gap-2.5', className)}>
      {socialLinks.map((link) => {
        const Icon = iconMap[link.icon] ?? Link2
        return (
          <li key={link.id}>
            <a
              href={link.href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={link.label}
              title={link.label}
              className={cn(
                'group relative grid place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/10 hover:text-primary hover:shadow-[0_8px_30px_-12px_rgba(56,189,248,0.7)]',
                size === 'sm' ? 'h-9 w-9' : 'h-10 w-10',
              )}
            >
              <Icon aria-hidden="true" className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
            </a>
          </li>
        )
      })}
    </ul>
  )
}
