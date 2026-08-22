import { useEffect, useState } from 'react';
import { Play, Sparkles, Wallet, Gauge, Eraser } from 'lucide-react';
import type { Priority, ProviderComparison, RouterAnalysis, PipelineStage, InferenceResponse } from '@/types';
import {
  analyzePrompt,
  selectProviders,
  defaultRouterAnalysis,
  pipelineStages as defaultStages,
  priorityLabels,
} from '@/data/mockData';
import { RouterAnalysis as RouterAnalysisPanel } from '@/components/inference/RouterAnalysis';
import { ProviderComparison as ProviderComparisonPanel } from '@/components/inference/ProviderComparison';
import { PaymentPipeline } from '@/components/inference/PaymentPipeline';
import { ResponsePanel } from '@/components/inference/ResponsePanel';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { useWallet } from "@txnlab/use-wallet-react";
import { x402Client, wrapFetchWithPayment } from "@x402/fetch";
import { ExactAvmScheme } from "@x402/avm/exact/client";
import { API_BASE_URL } from '@/lib/api';


const MAX_CHARS = 4000;

export function InferencePanel() {
  const [prompt, setPrompt] = useState('');
  const [priority, setPriority] = useState<Priority>('balanced');
  const [budget, setBudget] = useState(0.01);
  const [analysis, setAnalysis] = useState<RouterAnalysis>(defaultRouterAnalysis);
  const [providers, setProviders] = useState<ProviderComparison[]>([]);
  const [stages, setStages] = useState<PipelineStage[]>(defaultStages);
  const [response, setResponse] = useState<InferenceResponse | null>(null);
  const [running, setRunning] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const { activeAccount, signTransactions } = useWallet();

  useEffect(() => {
    if (!prompt.trim()) {
      setAnalysis(defaultRouterAnalysis);
      setProviders([]);
      setHasAnalyzed(false);
      return;
    }
    const a = analyzePrompt(prompt, priority, budget);
    setAnalysis(a);
    setProviders(selectProviders(a, priority));
    setHasAnalyzed(true);
  }, [prompt, priority, budget]);

  const runInference = async () => {
  if (!prompt.trim() || running) return;

  setRunning(true);
  setResponse(null);

  setStages(
    defaultStages.map((s) => ({
      ...s,
      status: 'waiting',
    }))
  );

  const startTime = Date.now();

  try {
    setStages((prev) =>
      prev.map((s) =>
        s.id === 'request'
          ? { ...s, status: 'active' }
          : s
      )
    );

    setStages((prev) =>
      prev.map((s) => {
        if (s.id === 'request') return { ...s, status: 'done' };
        if (s.id === 'router') return { ...s, status: 'active' };
        return s;
      })
    );

    setStages((prev) =>
      prev.map((s) => {
        if (s.id === 'router') return { ...s, status: 'done' };
        if (s.id === 'payment-required') return { ...s, status: 'done' };
        if (s.id === 'x402-payment') return { ...s, status: 'done' };
        if (s.id === 'inference') return { ...s, status: 'active' };

        return s;
      })
    );

    if (!activeAccount) {
  alert("Connect your Pera wallet first.");
  setRunning(false);
  return;
}

const signer = {
  address: activeAccount.address,
  signTransactions: async (
    txns: Uint8Array[],
    indexesToSign?: number[],
  ) => {
    return signTransactions(txns, indexesToSign);
  },
};

const client = new x402Client();

client.setSpendControls(false);

client.register(
  "algorand:*",
  new ExactAvmScheme(signer),
);

const fetchWithPayment = wrapFetchWithPayment(fetch, client);

const apiResponse = await fetchWithPayment(
  `${API_BASE_URL}/api/inference`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      priority,
      budget,
    }),
  },
);

    if (!apiResponse.ok) {
      throw new Error(`Inference failed: ${apiResponse.status}`);
    }

    const data = await apiResponse.json();

    const paymentResponseHeader =
  apiResponse.headers.get("PAYMENT-RESPONSE");

let paymentTransaction: string | null = null;
let paymentNetwork: string | null = null;

if (paymentResponseHeader) {
  try {
    const decodedPayment = JSON.parse(atob(paymentResponseHeader));

    paymentTransaction = decodedPayment.transaction ?? null;
    paymentNetwork = decodedPayment.network ?? null;

    console.log("x402 settlement:", decodedPayment);
  } catch (error) {
    console.error("Failed to decode PAYMENT-RESPONSE:", error);
  }
}

if (data.inferenceId && paymentTransaction) {
  try {
    await fetch(
      `${API_BASE_URL}/api/inference/${data.inferenceId}/payment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transactionId: paymentTransaction,
          network: paymentNetwork,
        }),
      },
    );
  } catch (error) {
    console.error("Failed to save payment transaction:", error);
  }
}

    if (data.routing) {
  setAnalysis({
    taskType: data.routing.taskType,
    complexity: data.routing.complexity,
    estimatedTokens: data.routing.estimatedTokens,
    budget,
    strategy: data.routing.reason,
  });
}

if (data.routing?.selectedProvider) {
  setProviders((prev) =>
    prev.map((p) => ({
      ...p,
      recommended:
        p.provider.id === data.routing.selectedProvider.id,
      reason:
        p.provider.id === data.routing.selectedProvider.id
          ? data.routing.reason
          : p.reason,
    }))
  );
}

    const responseTimeMs = Date.now() - startTime;

    setStages((prev) =>
      prev.map((s) => {
        if (s.id === 'inference') return { ...s, status: 'done' };
        if (s.id === 'response') return { ...s, status: 'active' };

        return s;
      })
    );

    setResponse({
  text: data.text,
  model: data.model,
  responseTimeMs,
  tokenUsage: data.usage?.totalTokens ?? analysis.estimatedTokens,
  cost: data.cost ?? 0,

  routing: {
    selectedProvider: data.routing?.selectedProvider?.name ?? 'Unknown',
    preferredModel: data.routing?.selectedProvider?.actualModel ?? data.model,
    fallbackUsed:
      data.routing?.selectedProvider?.actualModel !== data.model,
  },
});

    setStages((prev) =>
      prev.map((s) => ({
        ...s,
        status: 'done',
      }))
    );
  } catch (error) {
    console.error('Inference request failed:', error);

    setStages(
      defaultStages.map((s) => ({
        ...s,
        status: 'waiting',
      }))
    );

    alert('Inference failed. Check the backend terminal.');
  } finally {
    setRunning(false);
  }
};

    
  const reset = () => {
    setPrompt('');
    setResponse(null);
    setStages(defaultStages.map((s) => ({ ...s, status: 'waiting' })));
    setRunning(false);
  };

  const currentStage = running
    ? stages.find((s) => s.status === 'active')?.id ?? null
    : null;

  return (
    <div className="space-y-6">
      <div className="card p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-500/10 text-brand-300 ring-1 ring-brand-400/20">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-ink-50">Inference Request</h2>
              <p className="text-[11px] text-ink-500">
                Submit a prompt — the router analyzes and selects the best provider.
              </p>
            </div>
          </div>
          <Badge variant="neutral">Live LLM · x402 enabled</Badge>
        </div>

        <div className="mt-4">
          <label htmlFor="prompt" className="sr-only">
            Prompt
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value.slice(0, MAX_CHARS))}
            placeholder="e.g. Explain the trade-offs between proof-of-stake and proof-of-work consensus, and summarize which is better suited for high-throughput payment networks."
            rows={5}
            className="input resize-y font-mono text-sm leading-relaxed"
          />
          <div className="mt-2 flex items-center justify-between text-[11px] text-ink-500">
            <span>≈ {Math.max(0, Math.round(prompt.length / 4))} tokens</span>
            <span>
              {prompt.length} / {MAX_CHARS}
            </span>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-ink-400">
              <Wallet className="h-3.5 w-3.5" /> Budget per request (USD)
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink-500">
                $
              </span>
              <input
                type="number"
                min={0}
                step={0.001}
                value={budget}
                onChange={(e) => setBudget(Math.max(0, Number(e.target.value)))}
                className="input pl-6"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-ink-400">
              <Gauge className="h-3.5 w-3.5" /> Routing priority
            </label>
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
              {priorityLabels().map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPriority(p.value)}
                  title={p.hint}
                  className={cn(
                    'rounded-lg border px-2.5 py-2 text-xs font-medium transition-all',
                    priority === p.value
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

        <div className="mt-4 flex items-center gap-2.5">
          <button
            onClick={runInference}
            disabled={!prompt.trim() || running}
            className="btn-primary h-10 px-5 text-sm"
          >
            <Play className="h-4 w-4" />
            {running ? 'Running…' : 'Run Inference'}
          </button>
          <button onClick={reset} className="btn-ghost h-10 px-4 text-sm" disabled={running}>
            <Eraser className="h-4 w-4" />
            Clear
          </button>
          <span className="ml-auto text-[11px] text-ink-500">
            Real LLM inference is enabled. x402 payment is still in demo mode.
          </span>
        </div>
      </div>

      <ResponsePanel
  response={response}
  running={running}
  onRegenerate={runInference}
/>

<RouterAnalysisPanel
  analysis={analysis}
  hasPrompt={hasAnalyzed}
/>

{hasAnalyzed && providers.length > 0 && (
  <ProviderComparisonPanel providers={providers} />
)}

<PaymentPipeline
  stages={stages}
  currentStage={currentStage}
  running={running}
/>
</div>
  );
}
