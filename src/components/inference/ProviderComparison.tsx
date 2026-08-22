import type { ProviderComparison } from '@/types';
import { ModelCard } from '@/components/ModelCard';

interface ProviderComparisonProps {
  providers: ProviderComparison[];
  onAction?: (providerId: string) => void;
}

export function ProviderComparison({ providers, onAction }: ProviderComparisonProps) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink-50">Available Providers</h3>
        <span className="text-[11px] text-ink-500">{providers.length} models evaluated</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {providers.map((p) => (
          <ModelCard
            key={p.provider.id}
            model={p.provider}
            recommended={p.recommended}
            reason={p.reason}
            onAction={onAction ? () => onAction(p.provider.id) : undefined}
            actionLabel={p.recommended ? 'Select & Continue' : 'View Details'}
          />
        ))}
      </div>
    </div>
  );
}
