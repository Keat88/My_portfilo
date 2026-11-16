import { cn } from '../../utils/cn'

const variants = {
  primary:
    'bg-gradient-to-r from-primary via-cyan to-violet text-[#04101f] font-semibold shadow-[0_12px_45px_-14px_rgba(56,189,248,0.85)] hover:-translate-y-0.5 hover:shadow-[0_18px_55px_-14px_rgba(56,189,248,0.95)]',
  outline:
    'border border-white/15 bg-white/[0.03] text-ink backdrop-blur-md hover:-translate-y-0.5 hover:border-primary/45 hover:bg-primary/10 hover:text-white',
  ghost:
    'text-muted hover:bg-white/5 hover:text-ink',
}

const sizes = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-sm sm:text-[0.95rem]',
}

export default function Button({
  children,
  href,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'right',
  className,
  ...props
}) {
  const classes = cn(
    'group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-base',
    variants[variant],
    sizes[size],
    className,
  )

  const content = (
    <>
      {variant === 'primary' && (
        <span
          aria-hidden="true"
          className="absolute inset-y-0 -left-full w-1/2 skew-x-12 bg-white/25 blur-md transition-transform duration-700 group-hover:translate-x-[320%]"
        />
      )}
      {Icon && iconPosition === 'left' && (
        <Icon aria-hidden="true" className="relative h-4 w-4" />
      )}
      <span className="relative">{children}</span>
      {Icon && iconPosition === 'right' && (
        <Icon aria-hidden="true" className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      )}
    </>
  )

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {content}
      </a>
    )
  }

  return (
    <button type="button" className={classes} {...props}>
      {content}
    </button>
  )
}
