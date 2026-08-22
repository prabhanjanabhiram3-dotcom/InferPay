import type {
  ModelProvider,
  OverviewStats,
  RecentInference,
  ModelPerformance,
  Transaction,
  UsageSummary,
  RouterAnalysis,
  ProviderComparison,
  PipelineStage,
  InferenceResponse,
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

export const overviewStats: OverviewStats = {
  totalRequests: 18420,
  totalSpent: 142.86,
  averageCost: 0.0078,
  successRate: 99.4,
};

export const recentInferences: RecentInference[] = [
  { id: 'inf_8842', time: '14:32:08', requestType: 'Reasoning', model: 'infer-pro-3', cost: 0.0084, status: 'Complete' },
  { id: 'inf_8841', time: '14:28:51', requestType: 'Coding', model: 'infer-core-2', cost: 0.0031, status: 'Complete' },
  { id: 'inf_8840', time: '14:24:19', requestType: 'Summarization', model: 'infer-lite-1', cost: 0.0011, status: 'Complete' },
  { id: 'inf_8839', time: '14:19:02', requestType: 'Translation', model: 'infer-edge-1', cost: 0.0022, status: 'Complete' },
  { id: 'inf_8838', time: '14:12:44', requestType: 'Creative', model: 'infer-pro-3', cost: 0.0091, status: 'Running' },
  { id: 'inf_8837', time: '14:08:30', requestType: 'Classification', model: 'infer-lite-1', cost: 0.0009, status: 'Complete' },
  { id: 'inf_8836', time: '14:02:17', requestType: 'Math', model: 'infer-pro-3', cost: 0.0088, status: 'Failed' },
];

export const modelPerformance: ModelPerformance[] = [
  { model: 'infer-pro-3', cost: 0.008, latencyMs: 1100, quality: 9.6, availability: 99.5 },
  { model: 'infer-core-2', cost: 0.003, latencyMs: 680, quality: 8.7, availability: 99.8 },
  { model: 'infer-edge-1', cost: 0.002, latencyMs: 210, quality: 7.9, availability: 99.7 },
  { model: 'infer-lite-1', cost: 0.001, latencyMs: 420, quality: 7.4, availability: 99.9 },
];

export const transactions: Transaction[] = [
  {
    id: 'x402_9f2a',
    date: '2026-08-15 14:32:11',
    service: 'Inference',
    model: 'infer-pro-3',
    amount: 0.0084,
    network: 'Algorand TestNet',
    protocol: 'x402',
    status: 'Payment verified',
    provider: 'InferPro',
    taskType: 'Reasoning',
    tokens: 840,
  },
  {
    id: 'x402_8c11',
    date: '2026-08-15 14:28:55',
    service: 'Inference',
    model: 'infer-core-2',
    amount: 0.0031,
    network: 'Algorand TestNet',
    protocol: 'x402',
    status: 'Payment verified',
    provider: 'InferCore',
    taskType: 'Coding',
    tokens: 310,
  },
  {
    id: 'x402_7b08',
    date: '2026-08-15 14:24:22',
    service: 'Inference',
    model: 'infer-lite-1',
    amount: 0.0011,
    network: 'Algorand TestNet',
    protocol: 'x402',
    status: 'Payment verified',
    provider: 'InferLite',
    taskType: 'Summarization',
    tokens: 110,
  },
  {
    id: 'x402_6a55',
    date: '2026-08-15 14:19:06',
    service: 'Inference',
    model: 'infer-edge-1',
    amount: 0.0022,
    network: 'Algorand TestNet',
    protocol: 'x402',
    status: 'Payment pending',
    provider: 'InferEdge',
    taskType: 'Translation',
    tokens: 220,
  },
  {
    id: 'x402_5d33',
    date: '2026-08-15 14:02:20',
    service: 'Inference',
    model: 'infer-pro-3',
    amount: 0.0088,
    network: 'Algorand TestNet',
    protocol: 'x402',
    status: 'Failed',
    provider: 'InferPro',
    taskType: 'Math',
    tokens: 880,
  },
  {
    id: 'x402_4e21',
    date: '2026-08-14 22:48:03',
    service: 'Routing',
    model: 'infer-core-2',
    amount: 0.0003,
    network: 'Algorand TestNet',
    protocol: 'x402',
    status: 'Payment verified',
    provider: 'InferPay Router',
    taskType: 'General',
    tokens: 30,
  },
  {
    id: 'x402_3f10',
    date: '2026-08-14 19:12:41',
    service: 'Inference',
    model: 'infer-pro-3',
    amount: 0.0091,
    network: 'Algorand TestNet',
    protocol: 'x402',
    status: 'Refunded',
    provider: 'InferPro',
    taskType: 'Creative',
    tokens: 910,
  },
];

export const usageSummary: UsageSummary = {
  totalRequests: 18420,
  totalSpend: 142.86,
  averageCost: 0.0078,
  mostUsedModel: 'infer-core-2',
  estimatedMonthlySpend: 312.4,
  successRate: 99.4,
  requestsOverTime: [
    { label: 'Mon', requests: 1820, spend: 14.2 },
    { label: 'Tue', requests: 2410, spend: 19.1 },
    { label: 'Wed', requests: 2980, spend: 23.8 },
    { label: 'Thu', requests: 2640, spend: 20.6 },
    { label: 'Fri', requests: 3210, spend: 25.9 },
    { label: 'Sat', requests: 1980, spend: 15.4 },
    { label: 'Sun', requests: 3380, spend: 23.86 },
  ],
  spendOverTime: [
    { label: 'W1', requests: 9200, spend: 71.4 },
    { label: 'W2', requests: 11200, spend: 88.2 },
    { label: 'W3', requests: 12800, spend: 102.1 },
    { label: 'W4', requests: 14200, spend: 142.86 },
  ],
  costPerInference: [
    { label: 'Mon', requests: 0, spend: 0.0078 },
    { label: 'Tue', requests: 0, spend: 0.0079 },
    { label: 'Wed', requests: 0, spend: 0.0080 },
    { label: 'Thu', requests: 0, spend: 0.0076 },
    { label: 'Fri', requests: 0, spend: 0.0081 },
    { label: 'Sat', requests: 0, spend: 0.0078 },
    { label: 'Sun', requests: 0, spend: 0.0071 },
  ],
  modelUsageDistribution: [
    { model: 'infer-core-2', share: 42, color: '#1cc4f0' },
    { model: 'infer-pro-3', share: 28, color: '#34e2c0' },
    { model: 'infer-lite-1', share: 18, color: '#7c8ad4' },
    { model: 'infer-edge-1', share: 12, color: '#f0a040' },
  ],
  providerSuccessRate: [
    { provider: 'InferCore', success: 99.8, color: '#1cc4f0' },
    { provider: 'InferPro', success: 99.5, color: '#34e2c0' },
    { provider: 'InferLite', success: 99.9, color: '#7c8ad4' },
    { provider: 'InferEdge', success: 99.7, color: '#f0a040' },
  ],
};

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
