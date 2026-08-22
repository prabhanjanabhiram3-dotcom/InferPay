import { Download, Network } from 'lucide-react';
import { TransactionTable } from '@/components/TransactionTable';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

export function TransactionsPage() {
  return (
    <div className="space-y-6">
      <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-ink-50">Transaction History</h2>
          <p className="text-[11px] text-ink-500">
            Real inference activity · x402 settlement not yet enabled
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="brand" dot>
            <Network className="h-3 w-3" /> Algorand TestNet
          </Badge>
          <Badge variant="accent" dot>
            x402
          </Badge>
          <button className="btn-ghost h-9 px-3 text-xs">
            <Download className="h-3.5 w-3.5" />
            Export
          </button>
        </div>
      </Card>

      <TransactionTable />

      <p className="text-center text-[11px] text-ink-500">
        Inference records are real. Payment settlement will be enabled with the x402 + Algorand integration.
      </p>
    </div>
  );
}
