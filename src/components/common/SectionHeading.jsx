import { cn } from '../../utils/cn'

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
}) {
  const words = title.trim().split(' ')
  const last = words.length > 1 ? words.pop() : null

  return (
    <div className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow && (
        <div
          className={cn(
            'mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-primary/80',
            align === 'center' && 'justify-center',
          )}
        >
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-primary/70" />
          {eyebrow}
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-primary/70" />
        </div>
      )}
      <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        {words.join(' ')}
        {last && (
          <>
            {' '}
            <span className="text-gradient">{last}</span>
          </>
        )}
      </h2>
      {description && (
        <p className="mt-4 text-sm leading-relaxed text-muted sm:text-[var(--text-soft)]">{description}</p>
      )}
    </div>
  )
}
