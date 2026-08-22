import { useState } from 'react';
import { Save, Wallet, KeyRound, Network, Gauge, Boxes, Info } from 'lucide-react';
import type { Priority } from '@/types';
import { priorityLabels } from '@/data/mockData';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

export function SettingsPage() {
  const [defaultBudget, setDefaultBudget] = useState(0.01);
  const [strategy, setStrategy] = useState<Priority>('balanced');
  const [network, setNetwork] = useState<'algorand-testnet' | 'algorand-mainnet'>('algorand-testnet');
  const [autoRoute, setAutoRoute] = useState(true);
  const [fallback, setFallback] = useState(true);

  return (
    <div className="space-y-6">
      <Card>
        <SectionHeader
          title="Routing Preferences"
          description="Defaults applied to every new inference request"
        />
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-ink-400">
              <Wallet className="h-3.5 w-3.5" /> Default budget (USD)
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink-500">
                $
              </span>
              <input
                type="number"
                min={0}
                step={0.001}
                value={defaultBudget}
                onChange={(e) => setDefaultBudget(Number(e.target.value))}
                className="input pl-6"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-ink-400">
              <Gauge className="h-3.5 w-3.5" /> Preferred strategy
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {priorityLabels().map((p) => (
                <button
                  key={p.value}
                  onClick={() => setStrategy(p.value)}
                  title={p.hint}
                  className={cn(
                    'rounded-lg border px-2.5 py-2 text-xs font-medium transition-all',
                    strategy === p.value
                      ? 'border-brand-400/40 bg-brand-500/10 text-brand-200'
                      : 'border-white/[0.06] bg-white/[0.02] text-ink-300 hover:bg-white/[0.05]'
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <Toggle
            label="Automatic routing"
            description="Let the router select the best provider without manual confirmation."
            checked={autoRoute}
            onChange={setAutoRoute}
          />
          <Toggle
            label="Fallback to next-best provider"
            description="If the selected provider fails, retry with the next-best option."
            checked={fallback}
            onChange={setFallback}
          />
        </div>
      </Card>

      <Card>
        <SectionHeader
          title="Network & Wallet"
          description="Backend integration coming in Phase 2"
        />
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-ink-400">
              <Network className="h-3.5 w-3.5" /> Network
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {(
                [
                  ['algorand-testnet', 'Algorand TestNet'],
                  ['algorand-mainnet', 'Algorand MainNet'],
                ] as const
              ).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setNetwork(val)}
                  disabled={val === 'algorand-mainnet'}
                  className={cn(
                    'rounded-lg border px-2.5 py-2 text-xs font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50',
                    network === val
                      ? 'border-brand-400/40 bg-brand-500/10 text-brand-200'
                      : 'border-white/[0.06] bg-white/[0.02] text-ink-300'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-ink-400">
              <Wallet className="h-3.5 w-3.5" /> Wallet connection
            </label>
            <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
              <div>
                <p className="text-sm font-medium text-ink-200">No wallet connected</p>
                <p className="text-[11px] text-ink-500">Algorand wallet pairing lands in Phase 2</p>
              </div>
              <button disabled className="btn-ghost h-9 px-3 text-xs">
                <Wallet className="h-3.5 w-3.5" />
                Connect
              </button>
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-start gap-2 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-500" />
          <p className="text-[11px] leading-relaxed text-ink-400">
            Payments are settled through x402 on Algorand TestNet.
          </p>
        </div>
      </Card>

      <Card>
        <SectionHeader
          title="API Configuration"
          description="Connect provider and x402 endpoints in Phase 2"
        />
        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-ink-400">
              <KeyRound className="h-3.5 w-3.5" /> InferPay API key
            </label>
            <input
              type="password"
              placeholder="sk-••••••••••••••••"
              disabled
              className="input opacity-60"
            />
            <p className="mt-1 text-[11px] text-ink-500">
              API keys are never stored in the browser. Backend key vault integration is planned.
            </p>
          </div>
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-ink-400">
              <KeyRound className="h-3.5 w-3.5" /> x402 facilitator endpoint
            </label>
            <input
              type="text"
              placeholder="https://facilitator.example-x402.net"
              disabled
              className="input opacity-60"
            />
          </div>
        </div>
      </Card>

      <Card className="relative overflow-hidden">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent-500/10 text-accent-400 ring-1 ring-accent-500/20">
            <Boxes className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-ink-50">MCP Tool Routing</h3>
            <p className="text-[11px] text-ink-500">Coming soon — Phase 2 roadmap</p>
          </div>
          <Badge variant="neutral" className="ml-auto">
            Disabled
          </Badge>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-ink-400">
          Let agents discover and pay for external tools through x402. MCP integration is not
          implemented in this phase.
        </p>
      </Card>

      <div className="flex items-center justify-end gap-2">
        <Badge variant="neutral">Frontend-only · no backend calls</Badge>
        <button className="btn-primary h-10 px-5 text-sm">
          <Save className="h-4 w-4" />
          Save preferences
        </button>
      </div>
    </div>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3.5">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-ink-100">{label}</p>
        <p className="mt-0.5 text-[11px] leading-relaxed text-ink-500">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-6 w-11 shrink-0 self-center rounded-full transition-colors',
          checked ? 'bg-brand-500' : 'bg-white/[0.08]'
        )}
        role="switch"
        aria-checked={checked}
      >
        <span
          className={cn(
            'absolute left-0.5 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white transition-transform',
            checked ? 'translate-x-[22px]' : 'translate-x-0'
          )}
        />
      </button>
    </div>
  );
}
