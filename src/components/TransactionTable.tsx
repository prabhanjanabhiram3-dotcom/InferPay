import { Fragment, useEffect, useState } from 'react';
import { ChevronDown, ArrowUpDown, Network, Coins } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { cn, formatCurrency} from '@/lib/utils';
import { API_BASE_URL } from '@/lib/api';

interface InferenceRecord {
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
  paymentStatus?: string;
  transactionId?: string;
  paymentNetwork?: string;
}

export function TransactionTable() {

  const [records, setRecords] = useState<InferenceRecord[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
  const loadRecords = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/usage`);

      if (!response.ok) {
        throw new Error('Failed to load inference records');
      }

      const data = await response.json();
      setRecords(data.recent || []);
    } catch (error) {
      console.error('Transaction history load error:', error);
    }
  };

  loadRecords();
}, []);

  const toggle = (id: string) => setExpanded((cur) => (cur === id ? null : id));

  return (
    <div className="card overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/[0.06] text-[11px] uppercase tracking-wider text-ink-500">
              <th className="px-4 py-3 font-medium" />
              <th className="px-4 py-3 font-medium">
                <span className="inline-flex items-center gap-1">
                  Request ID <ArrowUpDown className="h-3 w-3" />
                </span>
              </th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Service</th>
              <th className="px-4 py-3 font-medium">Model</th>
              <th className="px-4 py-3 font-medium text-right">Amount</th>
              <th className="px-4 py-3 font-medium">Router</th>
              <th className="px-4 py-3 font-medium">Payment</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((tx) => {
              const open = expanded === tx.id;
              return (
                <Fragment key={tx.id}>
                  <tr
                    onClick={() => toggle(tx.id)}
                    className={cn(
                      'cursor-pointer border-b border-white/[0.04] transition-colors hover:bg-white/[0.02]',
                      open && 'bg-white/[0.02]'
                    )}
                  >
                    <td className="px-4 py-3">
                      <ChevronDown
                        className={cn(
                          'h-4 w-4 text-ink-500 transition-transform',
                          open && 'rotate-180'
                        )}
                      />
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-ink-200">{tx.id}</td>
                    <td className="px-4 py-3 text-xs text-ink-400">{new Date(tx.timestamp).toLocaleString()}</td>
                    <td className="px-4 py-3 text-xs text-ink-300">{tx.taskType}</td>
                    <td className="px-4 py-3 font-mono text-xs text-ink-200">{tx.actualModel}</td>
                    <td className="px-4 py-3 text-right font-semibold text-ink-100">
                      {formatCurrency(tx.cost, 6)}
                    </td>
                    <td className="px-4 py-3 text-xs text-ink-300">
                      <span className="inline-flex items-center gap-1">
                        <Network className="h-3 w-3 text-brand-300" />
                        {tx.routerTier}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {tx.paymentStatus === 'Settled' && tx.transactionId ? (
  <div className="space-y-1">
    <Badge>Settled</Badge>

    <div className="text-[11px] text-ink-400">
      {tx.transactionId.slice(0, 8)}...{tx.transactionId.slice(-6)}
    </div>

    <a
      href={`https://lora.algokit.io/testnet/transaction/${tx.transactionId}`}
      target="_blank"
      rel="noreferrer"
      className="text-[11px] text-brand-400 hover:underline"
    >
      View in Lora
    </a>
  </div>
) : (
  <Badge>Not settled</Badge>
)}
                    </td>
                    <td className="px-4 py-3">
                      <span
  className={cn(
    'chip text-xs',
    tx.status === 'Complete' &&
      'bg-success/10 text-success border-success/30',
    tx.status === 'Running' &&
      'bg-brand-500/10 text-brand-200 border-brand-400/25',
    tx.status === 'Failed' &&
      'bg-error/10 text-error border-error/30'
  )}
>
  {tx.status}
</span>
                    </td>
                  </tr>
                  {open && (
                    <tr className="bg-ink-950/40">
                      <td colSpan={9} className="px-4 py-4">
                        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
  <Detail label="Router tier" value={tx.routerTier} />

  <Detail label="Task type" value={tx.taskType} />

  <Detail
    label="Tokens"
    value={tx.totalTokens.toLocaleString()}
  />

  <Detail
    label="Inference cost"
    value={formatCurrency(tx.cost, 6)}
    icon={Coins}
  />

  <Detail
    label="Fallback"
    value={tx.fallbackUsed ? 'Yes' : 'No'}
  />
</div>

<p className="mt-3 text-[11px] text-ink-500">
  Real inference record · x402 payment has not been settled yet.
</p>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Detail({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-3">
      <div className="flex items-center gap-1.5 text-ink-500">
        {Icon && <Icon className="h-3 w-3" />}
        <span className="text-[10px] uppercase tracking-wider">{label}</span>
      </div>
      <p className="mt-1 text-sm font-medium text-ink-100">{value}</p>
    </div>
  );
}
