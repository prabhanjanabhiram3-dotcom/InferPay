import { Check, Loader2, Minus } from 'lucide-react';
import type { PipelineStage, PipelineStageStatus } from '@/types';
import { cn } from '@/lib/utils';

interface PaymentPipelineProps {
  stages: PipelineStage[];
  currentStage: PipelineStage['id'] | null;
  running: boolean;
}

const statusMeta: Record<
  PipelineStageStatus,
  { ring: string; bg: string; text: string; label: string }
> = {
  waiting: { ring: 'ring-white/10', bg: 'bg-white/[0.04]', text: 'text-ink-400', label: 'Waiting' },
  active: { ring: 'ring-brand-400/50', bg: 'bg-brand-500/15', text: 'text-brand-200', label: 'In progress' },
  done: { ring: 'ring-brand-400/30', bg: 'bg-brand-500/10', text: 'text-brand-200', label: 'Done' },
  skipped: { ring: 'ring-white/10', bg: 'bg-white/[0.02]', text: 'text-ink-500', label: 'Skipped' },
};

export function PaymentPipeline({ stages, currentStage, running }: PaymentPipelineProps) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink-50">Payment &amp; Inference Pipeline</h3>
        <span
          className={cn(
            'chip',
            running
              ? 'bg-brand-500/10 text-brand-200 border-brand-400/25'
              : 'bg-white/[0.04] text-ink-400 border-white/10'
          )}
        >
          {running ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <span className="dot bg-current" />
          )}
          {running ? 'Running' : 'Idle'}
        </span>
      </div>

      <p className="mt-1 text-[11px] text-ink-500">
        Live x402 payments are processed on Algorand TestNet.
      </p>

      <div className="mt-5 flex flex-col gap-0">
        {stages.map((stage, i) => {
          const meta = statusMeta[stage.status];
          const isLast = i === stages.length - 1;
          const Icon =
            stage.status === 'done' ? Check : stage.status === 'active' ? Loader2 : Minus;
          return (
            <div key={stage.id} className="flex items-stretch gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'grid h-8 w-8 shrink-0 place-items-center rounded-full ring-1 transition-all',
                    meta.bg,
                    meta.ring,
                    stage.status === 'active' && 'animate-pulse-soft'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-3.5 w-3.5',
                      meta.text,
                      stage.status === 'active' && 'animate-spin'
                    )}
                  />
                </div>
                {!isLast && (
                  <div
                    className={cn(
                      'my-1 w-px flex-1',
                      stage.status === 'done' ? 'bg-brand-400/40' : 'bg-white/[0.08]'
                    )}
                  />
                )}
              </div>
              <div className={cn('pb-4', isLast && 'pb-0')}>
                <p
                  className={cn(
                    'text-sm font-medium',
                    stage.status === 'waiting' ? 'text-ink-400' : 'text-ink-100'
                  )}
                >
                  {stage.label}
                </p>
                <p className={cn('text-[11px]', meta.text)}>{meta.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-2 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
        <p className="text-[11px] leading-relaxed text-ink-400">
          <span className="font-semibold text-ink-300">Current stage:</span>{' '}
          {currentStage
            ? stages.find((s) => s.id === currentStage)?.label
            : 'Awaiting inference request'}
        </p>
      </div>
    </div>
  );
}
