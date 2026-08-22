import { Activity, Brain, Coins, Gauge, Target, Wallet } from 'lucide-react';
import type { RouterAnalysis } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { cn, complexityColor, formatCurrency, formatNumber } from '@/lib/utils';

interface RouterAnalysisProps {
  analysis: RouterAnalysis;
  hasPrompt: boolean;
}

export function RouterAnalysis({ analysis, hasPrompt }: RouterAnalysisProps) {
  const rows = [
    { icon: Target, label: 'Task type', value: analysis.taskType },
    { icon: Activity, label: 'Complexity', value: analysis.complexity, badge: true },
    { icon: Brain, label: 'Estimated tokens', value: `${formatNumber(analysis.estimatedTokens)} tokens` },
    { icon: Wallet, label: 'Budget', value: formatCurrency(analysis.budget, 2) },
    { icon: Gauge, label: 'Strategy', value: analysis.strategy },
    { icon: Coins, label: 'Routing mode', value: 'x402 pay-per-use' },
  ];

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-500/10 text-brand-300 ring-1 ring-brand-400/20">
            <Brain className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-ink-50">Router Analysis</h3>
            <p className="text-[11px] text-ink-500">
              {hasPrompt ? 'Live analysis of your request' : 'Enter a prompt to analyze'}
            </p>
          </div>
        </div>
        <Badge variant="brand" dot>
          {hasPrompt ? 'Analyzed' : 'Idle'}
        </Badge>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {rows.map((r) => {
          const Icon = r.icon;
          return (
            <div
              key={r.label}
              className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3"
            >
              <div className="flex items-center gap-1.5 text-ink-500">
                <Icon className="h-3.5 w-3.5" />
                <span className="text-[10px] uppercase tracking-wider">{r.label}</span>
              </div>
              {r.badge ? (
                <span
                  className={cn(
                    'chip mt-2 text-xs',
                    complexityColor(analysis.complexity)
                  )}
                >
                  {r.value}
                </span>
              ) : (
                <p className="mt-1.5 text-sm font-semibold text-ink-100">{r.value}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
