export type PageId =
  | 'overview'
  | 'inference'
  | 'models'
  | 'transactions'
  | 'usage'
  | 'settings';

export type Priority = 'lowest-cost' | 'balanced' | 'highest-quality' | 'lowest-latency';

export type TaskType =
  | 'Reasoning'
  | 'Coding'
  | 'Summarization'
  | 'Translation'
  | 'Creative'
  | 'Classification'
  | 'Math'
  | 'General';

export type Complexity = 'Low' | 'Medium' | 'High';

export type Capability =
  | 'reasoning'
  | 'coding'
  | 'summarization'
  | 'translation'
  | 'creative'
  | 'classification'
  | 'math'
  | 'vision'
  | 'tool-use';

export interface ModelProvider {
  id: string;
  provider: string;
  model: string;
  description: string;
  pricePerRequest: number;
  inputPricePerMTok: number;
  outputPricePerMTok: number;
  quality: number;
  latencyMs: number;
  contextWindow: number;
  capabilities: Capability[];
  availability: number;
  bestFor: string;
  available: boolean;
}

export interface RouterAnalysis {
  taskType: TaskType;
  complexity: Complexity;
  estimatedTokens: number;
  budget: number;
  strategy: string;
}

export interface ProviderComparison {
  provider: ModelProvider;
  recommended: boolean;
  reason: string;
}

export type PipelineStageId =
  | 'request'
  | 'router'
  | 'payment-required'
  | 'x402-payment'
  | 'inference'
  | 'response';

export type PipelineStageStatus =
  | 'waiting'
  | 'active'
  | 'done'
  | 'skipped';

export interface PipelineStage {
  id: PipelineStageId;
  label: string;
  status: PipelineStageStatus;
}

export interface InferenceResponse {
  model: string;
  responseTimeMs: number;
  tokenUsage: number;
  cost: number;
  text: string;

  routing?: {
    selectedProvider: string;
    preferredModel: string;
    fallbackUsed: boolean;
  };
}

export type TxStatus = 'Payment verified' | 'Payment pending' | 'Failed' | 'Refunded';
export type TxService = 'Inference' | 'Routing' | 'Tool access';

export interface Transaction {
  id: string;
  date: string;
  service: TxService;
  model: string;
  amount: number;
  network: string;
  protocol: 'x402';
  status: TxStatus;
  provider: string;
  taskType: TaskType;
  tokens: number;
}

export interface RecentInference {
  id: string;
  time: string;
  requestType: TaskType;
  model: string;
  cost: number;
  status: 'Complete' | 'Running' | 'Failed';
}

export interface ModelPerformance {
  model: string;
  cost: number;
  latencyMs: number;
  quality: number;
  availability: number;
}

export interface UsagePoint {
  label: string;
  requests: number;
  spend: number;
}

export interface ModelUsageShare {
  model: string;
  share: number;
  color: string;
}

export interface UsageSummary {
  totalRequests: number;
  totalSpend: number;
  averageCost: number;
  mostUsedModel: string;
  estimatedMonthlySpend: number;
  successRate: number;
  requestsOverTime: UsagePoint[];
  spendOverTime: UsagePoint[];
  costPerInference: UsagePoint[];
  modelUsageDistribution: ModelUsageShare[];
  providerSuccessRate: { provider: string; success: number; color: string }[];
}

export interface OverviewStats {
  totalRequests: number;
  totalSpent: number;
  averageCost: number;
  successRate: number;
}
