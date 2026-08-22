import { Zap, Clock, ShieldCheck, Cpu } from 'lucide-react';
import type { ModelProvider } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { cn, capabilityLabel, formatCurrency} from '@/lib/utils';

interface ModelCardProps {
  model: ModelProvider;
  recommended?: boolean;
  reason?: string;
  onAction?: () => void;
  actionLabel?: string;
  compact?: boolean;
}

export function ModelCard({
  model,
  recommended,
  reason,
  onAction,
  actionLabel = 'View Details',
  compact,
}: ModelCardProps) {
  return (
    <div
      className={cn(
        'card relative flex flex-col p-5 transition-all',
        recommended
          ? 'border-brand-400/40 bg-brand-500/[0.04] shadow-glow-brand'
          : 'card-hover'
      )}
    >
      {recommended && (
  <div className="mb-3">
    <Badge
      variant="brand"
      dot
      className="bg-brand-500 text-ink-950 border-brand-400"
    >
      Recommended
    </Badge>
  </div>
)}

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br text-sm font-semibold ring-1',
              recommended
                ? 'from-brand-400/25 to-brand-600/10 text-brand-200 ring-brand-400/25'
                : 'from-white/[0.06] to-white/[0.02] text-ink-300 ring-white/10'
            )}
          >
            {model.provider.slice(0, 2)}
          </div>
          <div>
            <p className="text-sm font-semibold text-ink-50">{model.provider}</p>
            <p className="font-mono text-[11px] text-ink-400">{model.model}</p>
          </div>
        </div>
        <div className="text-right">
  <p className="text-sm font-semibold text-ink-50">
    {formatCurrency(model.inputPricePerMTok, 2)}/M
  </p>
  <p className="text-[10px] text-ink-500">input tokens</p>
</div>
      </div>

      {!compact && (
        <p className="mt-3 text-xs leading-relaxed text-ink-400">{model.description}</p>
      )}

      <div className="mt-4 grid grid-cols-3 gap-2.5">
        <Metric
  icon={ShieldCheck}
  label="Tier"
  value={
    model.id === 'inferlite'
      ? 'Lite'
      : model.id === 'infercore'
        ? 'Balanced'
        : 'Pro'
  }
/>
        <Metric
  icon={Clock}
  label="Latency"
  value={model.latencyMs > 0 ? `${model.latencyMs}ms` : 'Measured live'}
/>
        <Metric
  icon={Zap}
  label="Avail."
  value={model.availability > 0 ? `${model.availability}%` : 'Live'}
/>
      </div>

      {!compact && (
        <div className="mt-4">
          <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-ink-500">
            Capabilities
          </p>
          <div className="flex flex-wrap gap-1.5">
            {model.capabilities.map((c) => (
              <span
                key={c}
                className="rounded-md bg-white/[0.04] px-2 py-0.5 text-[11px] text-ink-300 ring-1 ring-white/[0.06]"
              >
                {capabilityLabel(c)}
              </span>
            ))}
          </div>
        </div>
      )}

      {!compact && (
        <div className="mt-4 flex items-center gap-2 text-[11px] text-ink-500">
          <Cpu className="h-3.5 w-3.5" />
          <span>
            {model.contextWindow.toLocaleString()} ctx ·{' '}
            <span className="text-ink-400">{formatCurrency(model.inputPricePerMTok, 2)}/M in</span>{' '}
            ·{' '}
            <span className="text-ink-400">{formatCurrency(model.outputPricePerMTok, 2)}/M out</span>
          </span>
        </div>
      )}

      {recommended && reason && (
        <div className="mt-4 rounded-xl border border-brand-400/20 bg-brand-500/[0.06] p-3">
          <p className="text-[11px] leading-relaxed text-brand-100">
            <span className="font-semibold">Selected because</span> {reason}
          </p>
        </div>
      )}

      {!recommended && (
        <p className="mt-4 text-[11px] text-ink-500">
          <span className="text-ink-400">Best for:</span> {model.bestFor}
        </p>
      )}

      {onAction && (
        <button
          onClick={onAction}
          className={cn(
            'mt-4 w-full',
            recommended ? 'btn-primary h-9 text-xs' : 'btn-ghost h-9 text-xs'
          )}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  valueClass,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="rounded-lg bg-white/[0.03] p-2.5">
      <div className="flex items-center gap-1 text-ink-500">
        <Icon className="h-3 w-3" />
        <span className="text-[10px] uppercase tracking-wider">{label}</span>
      </div>
      <p className={cn('mt-1 text-xs font-semibold text-ink-100', valueClass)}>{value}</p>
    </div>
  );
}

type LucideIcon = React.ComponentType<{ className?: string }>;
