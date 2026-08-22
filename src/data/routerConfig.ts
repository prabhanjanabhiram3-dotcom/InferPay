import type {
  ModelProvider,
  RouterAnalysis,
  ProviderComparison,
  PipelineStage,
  Priority,
} from '@/types';

export const models: ModelProvider[] = [
  {
    id: 'inferlite',
    provider: 'InferLite',
    model: 'gemini-3.5-flash-lite',
    description:
      'Lightweight Gemini model routed for simple, cost-sensitive and high-throughput requests.',
    pricePerRequest: 0,
    inputPricePerMTok: 0.30,
    outputPricePerMTok: 2.50,
    quality: 7.8,
    latencyMs: 0,
    contextWindow: 1000000,
    capabilities: [
      'summarization',
      'classification',
      'translation',
    ],
    availability: 0,
    bestFor: 'Low-cost simple tasks',
    available: true,
  },

  {
    id: 'infercore',
    provider: 'InferCore',
    model: 'gemini-3.5-flash',
    description:
      'General-purpose Gemini model routed for balanced quality, speed and cost.',
    pricePerRequest: 0,
    inputPricePerMTok: 1.50,
    outputPricePerMTok: 9.00,
    quality: 8.8,
    latencyMs: 0,
    contextWindow: 1000000,
    capabilities: [
      'reasoning',
      'coding',
      'summarization',
      'classification',
      'translation',
    ],
    availability: 0,
    bestFor: 'Balanced general tasks',
    available: true,
  },

  {
    id: 'inferpro',
    provider: 'InferPro',
    model: 'gemini-3.7-flash',
    description:
      'High-capability Gemini model preferred for complex reasoning and demanding tasks.',
    pricePerRequest: 0,
    inputPricePerMTok: 0.75,
    outputPricePerMTok: 3.75,
    quality: 9.5,
    latencyMs: 0,
    contextWindow: 1000000,
    capabilities: [
      'reasoning',
      'coding',
      'math',
      'creative',
      'tool-use',
    ],
    availability: 0,
    bestFor: 'Complex reasoning',
    available: true,
  },
];

export const defaultRouterAnalysis: RouterAnalysis = {
  taskType: 'General',
  complexity: 'Medium',
  estimatedTokens: 0,
  budget: 0.01,
  strategy: 'Best price/quality ratio',
};

export const pipelineStages: PipelineStage[] = [
  { id: 'request', label: 'Request', status: 'waiting' },
  { id: 'router', label: 'Router Decision', status: 'waiting' },
  { id: 'payment-required', label: 'Payment Required', status: 'waiting' },
  { id: 'x402-payment', label: 'x402 Payment', status: 'waiting' },
  { id: 'inference', label: 'Inference', status: 'waiting' },
  { id: 'response', label: 'Response', status: 'waiting' },
];



export function analyzePrompt(
  prompt: string,
  priority: Priority,
  budget: number
): RouterAnalysis {
  const text = prompt.toLowerCase();
  let taskType: RouterAnalysis['taskType'] = 'General';
  if (/code|function|bug|api|class|compile|refactor/.test(text)) taskType = 'Coding';
  else if (/summar|tldr|shorten|condense/.test(text)) taskType = 'Summarization';
  else if (/translate|in (spanish|french|german|japanese)/.test(text)) taskType = 'Translation';
  else if (/poem|story|creative|write a|lyrics/.test(text)) taskType = 'Creative';
  else if (/classify|category|label|sentiment/.test(text)) taskType = 'Classification';
  else if (/prove|equation|solve|calculate|integral|matrix/.test(text)) taskType = 'Math';
  else if (/why|reason|analyze|explain|compare|deduce/.test(text)) taskType = 'Reasoning';

  const tokens = Math.max(120, Math.round(prompt.length / 4) + 220);
  let complexity: RouterAnalysis['complexity'] = 'Medium';
  if (tokens < 350) complexity = 'Low';
  else if (tokens > 900) complexity = 'High';

  const strategyMap: Record<Priority, string> = {
    'lowest-cost': 'Lowest cost within budget',
    balanced: 'Best price/quality ratio',
    'highest-quality': 'Highest quality within budget',
    'lowest-latency': 'Lowest latency available',
  };

  return {
    taskType,
    complexity,
    estimatedTokens: tokens,
    budget,
    strategy: strategyMap[priority],
  };
}

export function selectProviders(
  analysis: RouterAnalysis,
  priority: Priority
): ProviderComparison[] {
  const available = models.filter((m) => m.available);
  const budget = analysis.budget;

  const scored = available.map((m) => {
    let score = 0;
    const withinBudget = m.pricePerRequest <= budget || budget === 0;
    if (priority === 'lowest-cost') score = -m.pricePerRequest;
    else if (priority === 'highest-quality') score = m.quality - (withinBudget ? 0 : 3);
    else if (priority === 'lowest-latency') score = -m.latencyMs / 1000 + m.quality / 10;
    else
      score =
        m.quality / 2 -
        m.pricePerRequest * 100 -
        m.latencyMs / 2000 -
        (withinBudget ? 0 : 2);
    return { provider: m, score, withinBudget };
  });

  scored.sort((a, b) => b.score - a.score);
  const recommendedId = scored[0]?.provider.id;

  return available
    .map((m) => {
      const rec = m.id === recommendedId;
      let reason = 'Available provider for this task.';
      if (rec) {
        if (priority === 'lowest-cost')
          reason = `Lowest cost option at $${m.pricePerRequest.toFixed(4)} per request.`;
        else if (priority === 'highest-quality')
          reason = `Highest quality score (${m.quality}/10) within your $${budget.toFixed(2)} budget.`;
        else if (priority === 'lowest-latency')
          reason = `Fastest provider at ${m.latencyMs}ms with strong quality.`;
        else
          reason = `Best quality within your $${budget.toFixed(2)} budget.`;
      }
      return { provider: m, recommended: rec, reason };
    })
    .sort((a, b) => Number(b.recommended) - Number(a.recommended));
}

export function priorityLabels(): { value: Priority; label: string; hint: string }[] {
  return [
    { value: 'lowest-cost', label: 'Lowest Cost', hint: 'Minimize spend per request' },
    { value: 'balanced', label: 'Balanced', hint: 'Best price/quality ratio' },
    { value: 'highest-quality', label: 'Highest Quality', hint: 'Prefer top-tier models' },
    { value: 'lowest-latency', label: 'Lowest Latency', hint: 'Fastest response time' },
  ];
}
