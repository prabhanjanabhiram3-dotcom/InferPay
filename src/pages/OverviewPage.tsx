import { useEffect, useState } from 'react';
import { Sparkles, Activity, DollarSign, Percent, ArrowRight, Clock, Cpu } from 'lucide-react';
import type { PageId } from '@/types';
import { StatCard } from '@/components/StatCard';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Badge } from '@/components/ui/Badge';
import { cn, formatCurrency, formatNumber} from '@/lib/utils';

interface HistoryItem {
  id: string;
  timestamp: string;
  taskType: string;
  complexity: string;
  routerTier: string;
  preferredModel: string;
  actualModel: string;
  fallbackUsed: boolean;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  cost: number;
  status: string;
}

interface StatsData {
  totalRequests: number;
  totalSpent: number;
  averageCost: number;
  successRate: number;
  recentInferences: HistoryItem[];
}

interface OverviewPageProps {
  onNavigate: (page: PageId) => void;
}

export function OverviewPage({ onNavigate }: OverviewPageProps) { 

  const [stats, setStats] = useState<StatsData>({
  totalRequests: 0,
  totalSpent: 0,
  averageCost: 0,
  successRate: 0,
  recentInferences: [],
});

useEffect(() => {
  const loadStats = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/stats');

      if (!response.ok) {
        throw new Error('Failed to load stats');
      }

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Overview stats error:', error);
    }
  };

  loadStats();
}, []);
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-br from-ink-900/80 via-ink-900/40 to-ink-950 p-8 sm:p-10">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-500/15 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-24 right-1/3 h-56 w-56 rounded-full bg-accent-500/10 blur-[90px]" />
        <div className="relative max-w-2xl">
          <Badge variant="brand" dot>
            x402 · Algorand TestNet
          </Badge>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink-50 text-balance sm:text-4xl">
            AI inference, routed intelligently.
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-300">
            Choose the right model for every request and pay only for the intelligence you use.
            InferPay analyzes your prompt, compares providers, and routes to the best option —
            settled per request via the x402 payment protocol.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('inference')}
              className="btn-primary h-11 px-5 text-sm"
            >
              <Sparkles className="h-4 w-4" />
              New Inference
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => onNavigate('models')}
              className="btn-ghost h-11 px-5 text-sm"
            >
              Browse Models
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
  label="Total Requests"
  value={formatNumber(stats.totalRequests)}
  icon={Activity}
  sub="recorded inference requests"
  accent="brand"
/>

<StatCard
  label="Total Inference Cost"
  value={formatCurrency(stats.totalSpent, 6)}
  icon={DollarSign}
  sub="estimated provider cost"
  accent="accent"
/>

<StatCard
  label="Avg Cost / Request"
  value={formatCurrency(stats.averageCost, 6)}
  icon={Percent}
  sub="based on recorded requests"
  accent="neutral"
/>

<StatCard
  label="Success Rate"
  value={`${stats.successRate.toFixed(1)}%`}
  icon={Cpu}
  sub="recorded requests"
  accent="brand"
/>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2 p-0">
          <div className="p-5">
            <SectionHeader
              title="Recent Inference"
              description="Latest routed requests across providers"
              action={
                <button
                  onClick={() => onNavigate('transactions')}
                  className="btn-subtle h-8 px-2.5 text-xs"
                >
                  View all
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              }
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-y border-white/[0.06] text-[11px] uppercase tracking-wider text-ink-500">
                  <th className="px-5 py-2.5 font-medium">Time</th>
                  <th className="px-5 py-2.5 font-medium">Request type</th>
                  <th className="px-5 py-2.5 font-medium">Selected model</th>
                  <th className="px-5 py-2.5 font-medium text-right">Cost</th>
                  <th className="px-5 py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentInferences.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-white/[0.04] text-xs transition-colors hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-3 text-ink-400">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-3 w-3" />
                        {new Date(r.timestamp).toLocaleTimeString()}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-ink-200">{r.taskType}</td>
                    <td className="px-5 py-3 font-mono text-ink-200">{r.actualModel}</td>
                    <td className="px-5 py-3 text-right font-semibold text-ink-100">
                      {formatCurrency(r.cost)}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={cn(
                          'chip text-[11px]',
                          r.status === 'Complete' &&
                            'bg-success/10 text-success border-success/30',
                          r.status === 'Running' &&
                            'bg-brand-500/10 text-brand-200 border-brand-400/25',
                          r.status === 'Failed' &&
                            'bg-error/10 text-error border-error/30'
                        )}
                      >
                        {r.status === 'Running' && (
                          <span className="dot animate-pulse-soft bg-current" />
                        )}
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
  <SectionHeader
    title="Recent Model Usage"
    description="Models used by your latest real inference requests"
  />

  <div className="mt-4 space-y-3">
    {stats.recentInferences.length > 0 ? (
      stats.recentInferences.slice(0, 5).map((r) => (
        <div
          key={r.id}
          className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3.5"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-ink-200">
              {r.actualModel}
            </span>

            <span className="text-xs font-semibold text-ink-100">
              {formatCurrency(r.cost, 6)}
            </span>
          </div>

          <div className="mt-2.5 grid grid-cols-3 gap-2 text-[11px]">
            <div>
              <p className="text-ink-500">Tokens</p>
              <p className="font-medium text-ink-200">
                {formatNumber(r.totalTokens)}
              </p>
            </div>

            <div>
              <p className="text-ink-500">Tier</p>
              <p className="font-medium text-ink-200">
                {r.routerTier}
              </p>
            </div>

            <div>
              <p className="text-ink-500">Fallback</p>
              <p className="font-medium text-ink-200">
                {r.fallbackUsed ? 'Yes' : 'No'}
              </p>
            </div>
          </div>
        </div>
      ))
    ) : (
      <p className="py-6 text-center text-xs text-ink-500">
        No inference activity yet.
      </p>
    )}
  </div>
</Card>
      </section>
    </div>
  );
}
