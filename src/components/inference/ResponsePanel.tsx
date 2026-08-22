import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, RefreshCw, Check, Cpu, Clock, Coins, Hash } from 'lucide-react';
import type { InferenceResponse } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { cn, formatCurrency, formatNumber } from '@/lib/utils';

interface ResponsePanelProps {
  response: InferenceResponse | null;
  running: boolean;
  onRegenerate?: () => void;
}

export function ResponsePanel({ response, running, onRegenerate }: ResponsePanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard?.writeText(response.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent-500/10 text-accent-400 ring-1 ring-accent-500/20">
            <Cpu className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-ink-50">Inference Response</h3>
            <p className="text-[11px] text-ink-500">
              {running ? 'Generating response…' : response ? 'Real LLM response' : 'No response yet'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {response && (
            <>
              <button onClick={handleCopy} className="btn-subtle h-8 px-2.5 text-xs">
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-success" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {copied ? 'Copied' : 'Copy'}
              </button>
              {onRegenerate && (
                <button
                  onClick={onRegenerate}
                  disabled={running}
                  className="btn-subtle h-8 px-2.5 text-xs"
                >
                  <RefreshCw className={cn('h-3.5 w-3.5', running && 'animate-spin')} />
                  Regenerate
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {response ? (
        <>
          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <Stat icon={Cpu} label="Model" value={response.model} mono />
            <Stat icon={Clock} label="Response time" value={`${response.responseTimeMs}ms`} />
            <Stat icon={Hash} label="Tokens" value={formatNumber(response.tokenUsage)} />
            <Stat icon={Coins} label="Cost" value={formatCurrency(response.cost)} />
          </div>

          {response.routing && (
  <div className="mt-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
    <div className="grid gap-2 text-xs sm:grid-cols-3">
      <div>
        <p className="text-ink-500">Router selected</p>
        <p className="mt-1 font-medium text-ink-100">
          {response.routing.selectedProvider}
        </p>
      </div>

      <div>
        <p className="text-ink-500">Preferred model</p>
        <p className="mt-1 font-mono text-ink-100">
          {response.routing.preferredModel}
        </p>
      </div>

      <div>
        <p className="text-ink-500">Fallback used</p>
        <p className="mt-1 font-medium text-ink-100">
          {response.routing.fallbackUsed ? 'Yes' : 'No'}
        </p>
      </div>
    </div>
  </div>
)}

          <div className="mt-4 rounded-xl border border-white/[0.05] bg-ink-950/50 p-4">
            <div className="text-sm leading-relaxed text-ink-200">
  <ReactMarkdown>
    {response.text}
  </ReactMarkdown>
</div>
          </div>

          <div className="mt-3">
            <Badge variant="success">Live Gemini inference</Badge>
          </div>
        </>
      ) : (
        <div className="mt-6 grid place-items-center rounded-xl border border-dashed border-white/[0.08] bg-white/[0.01] py-10 text-center">
          <Cpu className="h-6 w-6 text-ink-600" />
          <p className="mt-2 text-sm text-ink-400">
            {running ? 'Awaiting response…' : 'Run an inference to see the response here'}
          </p>
        </div>
      )}
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  mono,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
      <div className="flex items-center gap-1.5 text-ink-500">
        <Icon className="h-3.5 w-3.5" />
        <span className="text-[10px] uppercase tracking-wider">{label}</span>
      </div>
      <p className={cn('mt-1.5 truncate text-sm font-semibold text-ink-100', mono && 'font-mono text-xs')}>
        {value}
      </p>
    </div>
  );
}
