import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'brand' | 'success' | 'warning' | 'error' | 'neutral' | 'accent';
  className?: string;
  dot?: boolean;
}

const variants: Record<NonNullable<BadgeProps['variant']>, string> = {
  brand: 'bg-brand-500/10 text-brand-200 border-brand-400/25',
  success: 'bg-success/10 text-success border-success/30',
  warning: 'bg-warning/10 text-warning border-warning/30',
  error: 'bg-error/10 text-error border-error/30',
  neutral: 'bg-white/[0.04] text-ink-300 border-white/10',
  accent: 'bg-accent-500/10 text-accent-400 border-accent-500/30',
};

export function Badge({ children, variant = 'neutral', className, dot }: BadgeProps) {
  return (
    <span className={cn('chip', variants[variant], className)}>
      {dot && <span className="dot bg-current" />}
      {children}
    </span>
  );
}
