import { useState } from 'react';
import { Filter, Search, SlidersHorizontal } from 'lucide-react';
import type { Capability } from '@/types';
// ModelsPage.tsx
import { models } from '@/data/routerConfig';
import { ModelCard } from '@/components/ModelCard';
import { Badge } from '@/components/ui/Badge';
import { capabilityLabel, cn } from '@/lib/utils';

type SortKey = 'price' | 'quality' | 'speed' | 'capability';

const allCapabilities: Capability[] = [
  'reasoning',
  'coding',
  'summarization',
  'translation',
  'creative',
  'classification',
  'math',
  'vision',
  'tool-use',
];

export function ModelsPage() {
  const [sort, setSort] = useState<SortKey>('quality');
  const [query, setQuery] = useState('');
  const [activeCaps, setActiveCaps] = useState<Capability[]>([]);
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const filtered = models
    .filter((m) => {
      if (query && !`${m.provider} ${m.model}`.toLowerCase().includes(query.toLowerCase()))
        return false;
      if (onlyAvailable && !m.available) return false;
      if (activeCaps.length && !activeCaps.every((c) => m.capabilities.includes(c))) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === 'price') return a.pricePerRequest - b.pricePerRequest;
      if (sort === 'quality') return b.quality - a.quality;
      if (sort === 'speed') return a.latencyMs - b.latencyMs;
      return b.capabilities.length - a.capabilities.length;
    });

  const toggleCap = (c: Capability) =>
    setActiveCaps((cur) => (cur.includes(c) ? cur.filter((x) => x !== c) : [...cur, c]));

  return (
    <div className="space-y-6">
      <div className="card p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-ink-50">Model Marketplace</h2>
            <p className="text-[11px] text-ink-500">
              Compare inference providers · prices are pay-per-use via x402
            </p>
          </div>
          <div className="relative max-w-xs flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search providers or models"
              className="input pl-9"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-ink-400">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Sort
          </div>
          {(
            [
              ['price', 'Price'],
              ['quality', 'Quality'],
              ['speed', 'Speed'],
              ['capability', 'Capability'],
            ] as [SortKey, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSort(key)}
              className={cn(
                'rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all',
                sort === key
                  ? 'border-brand-400/40 bg-brand-500/10 text-brand-200'
                  : 'border-white/[0.06] bg-white/[0.02] text-ink-300 hover:bg-white/[0.05]'
              )}
            >
              {label}
            </button>
          ))}
          <div className="mx-1 h-5 w-px bg-white/[0.08]" />
          <label className="flex cursor-pointer items-center gap-2 text-xs text-ink-300">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
              className="h-3.5 w-3.5 accent-brand-400"
            />
            Available only
          </label>
        </div>

        <div className="mt-4">
          <div className="mb-2 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-ink-400">
            <Filter className="h-3.5 w-3.5" /> Capability filter
          </div>
          <div className="flex flex-wrap gap-1.5">
            {allCapabilities.map((c) => (
              <button
                key={c}
                onClick={() => toggleCap(c)}
                className={cn(
                  'rounded-md px-2 py-1 text-[11px] transition-all',
                  activeCaps.includes(c)
                    ? 'bg-brand-500/15 text-brand-200 ring-1 ring-brand-400/30'
                    : 'bg-white/[0.04] text-ink-400 hover:bg-white/[0.08]'
                )}
              >
                {capabilityLabel(c)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((m) => (
          <ModelCard key={m.id} model={m} actionLabel="View Details" />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="card grid place-items-center py-12 text-center">
          <p className="text-sm text-ink-400">No models match the current filters.</p>
        </div>
      )}

      <div className="flex justify-center">
        <Badge variant="neutral">
          {filtered.length} of {models.length} models shown · live routing catalog
        </Badge>
      </div>
    </div>
  );
}
