import { Moon, Sun } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../hooks/useTheme'
import { cn } from '../utils/cn'

export default function ThemeToggle({ className }) {
  const { theme, toggleTheme } = useTheme()
  const { t } = useTranslation()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? t('theme.switchToLight') : t('theme.switchToDark')}
      title={isDark ? t('theme.light') : t('theme.dark')}
      className={cn(
        'relative grid h-10 w-10 place-items-center overflow-hidden rounded-xl border transition-all duration-300',
        'border-white/10 bg-white/[0.03] text-ink hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/10 hover:text-primary hover:shadow-[0_8px_30px_-12px_rgba(56,189,248,0.45)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-base',
        '[html[data-theme="light"]_&]:border-slate-200 [html[data-theme="light"]_&]:bg-white [html[data-theme="light"]_&]:shadow-sm',
        className,
      )}
    >
      <span
        className={cn(
          'absolute transition-all duration-500',
          isDark ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0',
        )}
      >
        <Moon aria-hidden="true" className="h-4.5 w-4.5" />
      </span>
      <span
        className={cn(
          'absolute transition-all duration-500',
          !isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0',
        )}
      >
        <Sun aria-hidden="true" className="h-4.5 w-4.5" />
      </span>
    </button>
  )
}
