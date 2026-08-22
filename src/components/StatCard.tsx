import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
  accent?: 'brand' | 'accent' | 'warning' | 'neutral';
}

const accents: Record<NonNullable<StatCardProps['accent']>, string> = {
  brand: 'from-brand-400/20 to-brand-600/5 text-brand-300 ring-brand-400/20',
  accent: 'from-accent-500/20 to-accent-600/5 text-accent-400 ring-accent-500/20',
  warning: 'from-warning/20 to-warning/5 text-warning ring-warning/20',
  neutral: 'from-white/[0.06] to-white/[0.02] text-ink-300 ring-white/10',
};

export function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  trend,
  accent = 'brand',
}: StatCardProps) {
  return (
    <div className="card card-hover group p-5">
      <div className="flex items-start justify-between">
        <div
          className={cn(
            'grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ring-1 transition-transform group-hover:scale-105',
            accents[accent]
          )}
        >
          <Icon className="h-4.5 w-4.5" />
        </div>
        {trend && (
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium',
              trend.positive
                ? 'bg-success/10 text-success'
                : 'bg-error/10 text-error'
            )}
          >
            {trend.positive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {trend.value}
          </span>
        )}
      </div>
      <p className="mt-4 text-[11px] font-medium uppercase tracking-wider text-ink-400">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-ink-50">{value}</p>
      {sub && <p className="mt-1 text-xs text-ink-500">{sub}</p>}
    </div>
  );
}
