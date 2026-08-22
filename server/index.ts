import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import { paymentMiddleware, x402ResourceServer } from "@x402/express";
import { ExactAvmScheme } from "@x402/avm/exact/server";
import { HTTPFacilitatorClient } from "@x402/core/server";
import { ALGORAND_TESTNET_CAIP2 } from "@x402/avm";
import {
  bazaarResourceServerExtension,
  declareDiscoveryExtension,
} from "@x402/extensions";
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

const app = express();
const PORT = Number(process.env.PORT) || 3001;



const DATA_DIR = path.join(process.cwd(), 'data');
const HISTORY_FILE = path.join(DATA_DIR, 'inference-history.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

if (!fs.existsSync(HISTORY_FILE)) {
  fs.writeFileSync(HISTORY_FILE, '[]', 'utf-8');
}

function readHistory() {
  try {
    const raw = fs.readFileSync(HISTORY_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveHistory(history: any[]) {
  fs.writeFileSync(
    HISTORY_FILE,
    JSON.stringify(history, null, 2),
    'utf-8'
  );
}

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://inferpay-dhb5.onrender.com",
    ],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: [
  "Content-Type",
  "PAYMENT-SIGNATURE",
  "Access-Control-Expose-Headers",
],
    exposedHeaders: [
      "PAYMENT-REQUIRED",
      "PAYMENT-RESPONSE",
    ],
  }),
);
app.use(express.json());

const PAY_TO = process.env.RESOURCE_PAY_TO!;
const FACILITATOR_URL = process.env.FACILITATOR_URL!;

const facilitatorClient = new HTTPFacilitatorClient({
  url: FACILITATOR_URL,
});

const resourceServer = new x402ResourceServer(facilitatorClient)
  .register("algorand:*", new ExactAvmScheme())
  .registerExtension(bazaarResourceServerExtension);

const inferenceDiscovery = declareDiscoveryExtension({
  bodyType: "json",

  input: {
    prompt: "Explain x402 in simple terms.",
    priority: "balanced",
    budget: 0.01,
  },

  inputSchema: {
    properties: {
      prompt: {
        type: "string",
        description: "Prompt to send through the InferPay LLM router",
      },

      priority: {
        type: "string",
        enum: ["cost", "balanced", "quality"],
        description: "Routing preference",
      },

      budget: {
        type: "number",
        description: "Maximum preferred inference budget in USD",
      },
    },

    required: ["prompt"],
  },

  output: {
    example: {
      text: "x402 is a payment protocol for HTTP resources.",
      model: "gemini-3.5-flash-lite",
      cost: 0.0001,

      routing: {
        taskType: "Reasoning",
        complexity: "Low",
        selectedProvider: {
          name: "InferLite",
          actualModel: "gemini-3.5-flash-lite",
        },
      },
    },
  },
});

const x402Routes = {
  "GET /api/paid-test": {
    accepts: {
      scheme: "exact",
      network: ALGORAND_TESTNET_CAIP2,
      payTo: PAY_TO,
      price: "$0.01",
    },
    description: "InferPay x402 test endpoint",
  },

  "POST /api/inference": {
  accepts: {
    scheme: "exact",
    network: ALGORAND_TESTNET_CAIP2,
    payTo: PAY_TO,
    price: "$0.01",
  },

  description:
    "InferPay intelligently routes AI prompts based on complexity, quality, latency, and budget, with x402 payments settled on Algorand.",

  mimeType: "application/json",

  extensions: {
    ...inferenceDiscovery,
  },
},
} as const;
app.use(
  paymentMiddleware(
    x402Routes,
    resourceServer
  )
);

// ADD TEST ROUTE HERE
app.get("/api/paid-test", (_req, res) => {
  res.json({
    success: true,
    message: "x402 payment verified — InferPay premium resource unlocked!",
  });
});


const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Test endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'InferPay backend is running',
  });
});
type Priority =
  | 'lowest-cost'
  | 'balanced'
  | 'highest-quality'
  | 'lowest-latency';

function routeRequest(
  prompt: string,
  priority: Priority,
  budget: number
) {
  const text = prompt.toLowerCase();

  let taskType = 'General';

if (
  /code|function|bug|api|class|compile|refactor|program|typescript|javascript|python/.test(
    text
  )
) {
  taskType = 'Coding';
} else if (
  /architecture|system design|design a system|scalable|infrastructure|marketplace|routing|distributed system/.test(
    text
  )
) {
  taskType = 'Reasoning';
} else if (/summar|tldr|shorten|condense/.test(text)) {
  taskType = 'Summarization';
} else if (/translate/.test(text)) {
  taskType = 'Translation';
} else if (
  /solve|calculate|equation|integral|matrix|proof|theorem/.test(text)
) {
  taskType = 'Math';
} else if (
  /why|reason|analyze|compare|evaluate|recommend|explain|justify/.test(text)
) {
  taskType = 'Reasoning';
}

  const estimatedTokens = Math.max(
  120,
  Math.round(prompt.length / 4) + 220
);

let complexityScore = 0;

// Prompt length
if (estimatedTokens > 350) complexityScore += 1;
if (estimatedTokens > 700) complexityScore += 1;

// Reasoning-heavy words
const reasoningSignals = [
  'analyze',
  'compare',
  'evaluate',
  'recommend',
  'reason',
  'explain why',
  'trade-off',
  'tradeoffs',
  'deduce',
  'justify',
  'prove',
];

for (const signal of reasoningSignals) {
  if (text.includes(signal)) {
    complexityScore += 1;
  }
}

// Technical / difficult tasks
if (
  /debug|refactor|algorithm|architecture|optimization|integral|matrix|equation|proof|theorem/.test(
    text
  )
) {
  complexityScore += 1;
}

// Multiple requirements
const requirementWords = [
  'and',
  'also',
  'then',
  'including',
  'consider',
  'based on',
];

let requirementCount = 0;

for (const word of requirementWords) {
  if (text.includes(word)) {
    requirementCount += 1;
  }
}

if (requirementCount >= 2) {
  complexityScore += 1;
}

// System design / architecture tasks are inherently more complex
if (
  /architecture|system design|scalable|distributed|infrastructure|marketplace|multi-provider|multiple llm|fallback routing/.test(
    text
  )
) {
  complexityScore += 2;
}

// Requests involving optimization or several competing goals
if (
  /minimize|maximize|optimize|latency|cost|reliability|failure|fallback|scalability/.test(
    text
  )
) {
  complexityScore += 1;
}

// Multi-part prompts
const separators =
  (text.match(/,| and | then | while | also | with /g) || []).length;

if (separators >= 3) {
  complexityScore += 1;
}

let complexity: 'Low' | 'Medium' | 'High' = 'Low';

if (complexityScore >= 2) {
  complexity = 'Medium';
}

if (complexityScore >= 4) {
  complexity = 'High';
}

  const providers = [
  {
    id: 'inferlite',
    model: 'InferLite',
    actualModel: 'gemini-3.5-flash-lite',
    price: 0.001,
    quality: 7.4,
    latency: 420,
  },
  {
    id: 'infercore',
    model: 'InferCore',
    actualModel: 'gemini-3.5-flash',
    price: 0.003,
    quality: 8.7,
    latency: 680,
  },
  {
  id: 'inferpro',
  model: 'InferPro',
  actualModel: 'gemini-3.7-flash',
  price: 0.008,
  quality: 9.6,
  latency: 1100,
},
];

  let candidates = providers.filter(
    (p) => p.price <= budget || budget === 0
  );

  if (candidates.length === 0) {
    candidates = providers;
  }

  let selected = candidates[0];

  if (priority === 'lowest-cost') {
    selected = [...candidates].sort(
      (a, b) => a.price - b.price
    )[0];
  }

  if (priority === 'highest-quality') {
    selected = [...candidates].sort(
      (a, b) => b.quality - a.quality
    )[0];
  }

  if (priority === 'lowest-latency') {
    selected = [...candidates].sort(
      (a, b) => a.latency - b.latency
    )[0];
  }

  if (priority === 'balanced') {
    if (complexity === 'Low') {
      selected =
        candidates.find((p) => p.id === 'inferlite') ??
        candidates[0];
    } else if (complexity === 'High') {
      selected =
        candidates.find((p) => p.id === 'inferpro') ??
        candidates[candidates.length - 1];
    } else {
      selected =
        candidates.find((p) => p.id === 'infercore') ??
        candidates[0];
    }
  }

  return {
    taskType,
    complexity,
    estimatedTokens,
    selectedProvider: selected,
    reason:
      priority === 'balanced'
        ? `${selected.model} selected for ${complexity.toLowerCase()} complexity with a balanced price/quality strategy.`
        : `${selected.model} selected using ${priority} routing priority.`,
  };
}
app.get('/api/models', async (_req, res) => {
  try {
    const result = await ai.models.list({
      config: {
        pageSize: 100,
      },
    });

    const models = [];

    for await (const model of result) {
      models.push({
        name: model.name,
        displayName: model.displayName,
      });
    }

    return res.json(models);
  } catch (error) {
    console.error('Model list error:', error);

    return res.status(500).json({
      error: 'Failed to list Gemini models',
    });
  }
});

app.get('/api/stats', async (_req, res) => {
  const { data: rows, error } = await supabase
    .from('inference_history')
    .select('*')
    .order('timestamp', { ascending: false });

  if (error) {
    console.error('Supabase stats read error:', error);

    return res.status(500).json({
      error: 'Failed to load stats data',
    });
  }

  const history = (rows || []).map((item: any) => ({
    id: item.id,
    timestamp: item.timestamp,
    taskType: item.task_type,
    complexity: item.complexity,
    routerTier: item.router_tier,
    preferredModel: item.preferred_model,
    actualModel: item.actual_model,
    fallbackUsed: item.fallback_used,
    inputTokens: item.input_tokens,
    outputTokens: item.output_tokens,
    totalTokens: item.total_tokens,
    cost: Number(item.cost || 0),
    status: item.status,
    paymentStatus: item.payment_status,
    transactionId: item.transaction_id,
    paymentNetwork: item.payment_network,
  }));

  const totalRequests = history.length;
  const totalSpent = history.reduce(
    (sum: number, item: any) => sum + (item.cost || 0),
    0
  );

  const successful = history.filter(
    (item: any) => item.status === 'Complete'
  ).length;

  const averageCost =
    totalRequests > 0 ? totalSpent / totalRequests : 0;

  const successRate =
    totalRequests > 0
      ? (successful / totalRequests) * 100
      : 0;

  return res.json({
    totalRequests,
    totalSpent,
    averageCost,
    successRate,
    recentInferences: history.slice(0, 10),
  });
});

app.get('/api/usage', async (_req, res) => {
  const { data: rows, error } = await supabase
    .from('inference_history')
    .select('*')
    .order('timestamp', { ascending: false });

  if (error) {
    console.error('Supabase usage read error:', error);

    return res.status(500).json({
      error: 'Failed to load usage data',
    });
  }

  const history = (rows || []).map((item: any) => ({
    id: item.id,
    timestamp: item.timestamp,
    taskType: item.task_type,
    complexity: item.complexity,
    routerTier: item.router_tier,
    preferredModel: item.preferred_model,
    actualModel: item.actual_model,
    fallbackUsed: item.fallback_used,
    inputTokens: item.input_tokens,
    outputTokens: item.output_tokens,
    totalTokens: item.total_tokens,
    cost: Number(item.cost || 0),
    status: item.status,
    paymentStatus: item.payment_status,
    transactionId: item.transaction_id,
    paymentNetwork: item.payment_network,
  }));

  const totalRequests = history.length;
  const totalSpend = history.reduce(
    (sum: number, item: any) => sum + (item.cost || 0),
    0
  );

  const averageCost =
    totalRequests > 0 ? totalSpend / totalRequests : 0;

  const modelCounts = history.reduce(
    (acc: Record<string, number>, item: any) => {
      const model = item.actualModel || 'Unknown';
      acc[model] = (acc[model] || 0) + 1;
      return acc;
    },
    {}
  );

  const mostUsedModel =
    Object.entries(modelCounts).sort(
      (a, b) => Number(b[1]) - Number(a[1])
    )[0]?.[0] ?? 'None';

  const successRate =
    totalRequests > 0
      ? (history.filter((item: any) => item.status === 'Complete').length /
          totalRequests) *
        100
      : 0;

  const fallbackCount = history.filter(
    (item: any) => item.fallbackUsed
  ).length;

  const chartColors = ['#1cc4f0', '#34e2c0', '#7c8ad4', '#f0a040'];

const modelUsageDistribution = Object.entries(modelCounts).map(
  ([model, count], index) => ({
    model,
    share:
      totalRequests > 0
        ? (Number(count) / totalRequests) * 100
        : 0,
    color: chartColors[index % chartColors.length],
  })
);

  const requestsByDay: Record<string, number> = {};
const spendByDay: Record<string, number> = {};
const costByDay: Record<string, { total: number; count: number }> = {};

history.forEach((item: any) => {
  const day = new Date(item.timestamp).toLocaleDateString('en-US', {
    weekday: 'short',
  });

  requestsByDay[day] = (requestsByDay[day] || 0) + 1;
  spendByDay[day] = (spendByDay[day] || 0) + (item.cost || 0);

  if (!costByDay[day]) {
    costByDay[day] = {
      total: 0,
      count: 0,
    };
  }

  costByDay[day].total += item.cost || 0;
  costByDay[day].count += 1;
});

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const requestsOverTime = days.map((day) => ({
  label: day,
  requests: requestsByDay[day] || 0,
  spend: spendByDay[day] || 0,
}));

const spendOverTime = days.map((day) => ({
  label: day,
  requests: requestsByDay[day] || 0,
  spend: spendByDay[day] || 0,
}));

const costPerInference = days.map((day) => ({
  label: day,
  requests: 0,
  spend: costByDay[day]
    ? costByDay[day].total / costByDay[day].count
    : 0,
}));

  return res.json({
    requestsOverTime,
    spendOverTime,
    costPerInference,
    totalRequests,
    totalSpend,
    averageCost,
    mostUsedModel,
    successRate,
    fallbackCount,
    modelUsageDistribution,
    recent: history.slice(0, 20),
  });
});

// Real LLM inference endpoint
app.post('/api/inference', async (req, res) => {
  try {
    const {
      prompt,
      priority = 'balanced',
      budget = 0.01,
    } = req.body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({
        error: 'Prompt is required',
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'Gemini API key is not configured',
      });
    }

    console.log('Inference request received');

    const routing = routeRequest(
      prompt,
      priority as Priority,
      Number(budget)
    );

    console.log(
      `Router selected ${routing.selectedProvider.model} for ${routing.complexity} complexity`
    );

    const fallbackModels =
  routing.selectedProvider.id === 'inferpro'
    ? [
        routing.selectedProvider.actualModel,
        'gemini-3.5-flash',
        'gemini-flash-latest',
      ]
    : [
        routing.selectedProvider.actualModel,
        'gemini-flash-latest',
      ];

let response;
let modelUsed = routing.selectedProvider.actualModel;

for (const model of fallbackModels) {
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      console.log(`Trying model: ${model}`);

      response = await ai.models.generateContent({
        model,
        contents: prompt,
      });

      console.log('Usage metadata:', response.usageMetadata);

      modelUsed = model;
      break;
    } catch (error: any) {
      const status = error?.status;

      if (status === 503 && attempt < 2) {
        console.log(`${model} busy. Retry ${attempt}/2...`);

        await new Promise((resolve) =>
          setTimeout(resolve, attempt * 1500)
        );

        continue;
      }

      if (status === 503 || status === 429) {
        console.log(`${model} unavailable. Trying fallback...`);
        break;
      }

      throw error;
    }
  }

  if (response) {
    break;
  }
}

if (!response) {
  return res.status(503).json({
    error: 'All available Gemini models are currently unavailable.',
  });
}

const usage = response.usageMetadata;

const inputTokens = usage?.promptTokenCount ?? 0;
const outputTokens = usage?.candidatesTokenCount ?? 0;
const totalTokens = usage?.totalTokenCount ?? 0;

const modelPricing: Record<
  string,
  { input: number; output: number }
> = {
  'gemini-3.5-flash-lite': {
    input: 0.30,
    output: 2.50,
  },
  'gemini-3.5-flash': {
    input: 1.50,
    output: 9.00,
  },
  'gemini-3.7-flash': {
    input: 0.75,
    output: 3.75,
  },
};

const pricing = modelPricing[modelUsed];

const cost = pricing
  ? (inputTokens / 1_000_000) * pricing.input +
    (outputTokens / 1_000_000) * pricing.output
  : 0;

    const history = readHistory();

const inferenceId = `inf_${Date.now()}`;

const historyRecord = {
  id: inferenceId,
  timestamp: new Date().toISOString(),
  taskType: routing.taskType,
  complexity: routing.complexity,
  routerTier: routing.selectedProvider.model,
  preferredModel: routing.selectedProvider.actualModel,
  actualModel: modelUsed,
  fallbackUsed:
    routing.selectedProvider.actualModel !== modelUsed,
  inputTokens,
  outputTokens,
  totalTokens,
  cost,
  status: 'Complete',
};

history.unshift(historyRecord);

const { error: supabaseError } = await supabase
  .from('inference_history')
  .insert({
    id: historyRecord.id,
    timestamp: historyRecord.timestamp,
    task_type: historyRecord.taskType,
    complexity: historyRecord.complexity,
    router_tier: historyRecord.routerTier,
    preferred_model: historyRecord.preferredModel,
    actual_model: historyRecord.actualModel,
    fallback_used: historyRecord.fallbackUsed,
    input_tokens: historyRecord.inputTokens,
    output_tokens: historyRecord.outputTokens,
    total_tokens: historyRecord.totalTokens,
    cost: historyRecord.cost,
    status: historyRecord.status,
  });

if (supabaseError) {
  console.error('Supabase inference save error:', supabaseError);
}

saveHistory(history.slice(0, 500));

    return res.json({
      inferenceId,

      text: response?.text,

      provider: 'Google',
      model: modelUsed,
      cost,

      usage: {
  inputTokens,
  outputTokens,
  totalTokens,
},

      routing: {
        taskType: routing.taskType,
        complexity: routing.complexity,
        estimatedTokens: routing.estimatedTokens,

        selectedProvider: {
          id: routing.selectedProvider.id,
          name: routing.selectedProvider.model,
          actualModel: routing.selectedProvider.actualModel,
          price: routing.selectedProvider.price,
          quality: routing.selectedProvider.quality,
          latency: routing.selectedProvider.latency,
        },

        reason: routing.reason,
      },
    });
  } catch (error) {
    console.error('Inference error:', error);

    return res.status(500).json({
      error: 'Inference failed',
    });
  }
});

app.get("/api/paid-test", (_req, res) => {
  res.json({
    success: true,
    message: "x402 payment verified — InferPay premium resource unlocked!",
  });
});

app.post('/api/inference/:id/payment', async (req, res) => {
  const { id } = req.params;
  const { transactionId, network } = req.body;

  if (!transactionId) {
    return res.status(400).json({
      error: 'transactionId is required',
    });
  }

  const history = readHistory();

  const index = history.findIndex((item: any) => item.id === id);

  if (index === -1) {
    return res.status(404).json({
      error: 'Inference record not found',
    });
  }

  history[index] = {
    ...history[index],
    paymentStatus: 'Settled',
    transactionId,
    paymentNetwork: network ?? 'Algorand TestNet',
  };

  saveHistory(history.slice(0, 500));

  const { error: paymentUpdateError } = await supabase
  .from('inference_history')
  .update({
    payment_status: 'Settled',
    transaction_id: transactionId,
    payment_network: network ?? 'Algorand TestNet',
  })
  .eq('id', id);

if (paymentUpdateError) {
  console.error('Supabase payment update error:', paymentUpdateError);
}

  return res.json({
    success: true,
    record: history[index],
  });
});

app.get('/.well-known/x402', (_req, res) => {
  res.json({
    name: 'InferPay',
    description:
      'Pay-per-use intelligent LLM routing with x402 payments settled on Algorand TestNet.',
    x402Version: 2,
    resource: 'https://inferpay-api.onrender.com/api/inference',
    method: 'POST',
    network: ALGORAND_TESTNET_CAIP2,
    scheme: 'exact',
    price: '$0.01',
    asset: 'USDC',
    input: {
      type: 'json',
      example: {
        prompt: 'Explain x402 in simple terms.',
        priority: 'balanced',
        budget: 0.01,
      },
    },
    output: {
      type: 'json',
      example: {
        text: '...',
        model: 'gemini-3.5-flash-lite',
        cost: 0.0001,
        routing: {
          taskType: 'Reasoning',
          complexity: 'Low',
        },
      },
    },
  });
});

app.get('/llms.txt', (_req, res) => {
  res.type('text/plain').send(
`# InferPay

InferPay is a pay-per-use AI inference router powered by x402 on Algorand TestNet.

Endpoint:
POST https://inferpay-api.onrender.com/api/inference

Payment:
- Protocol: x402
- Network: Algorand TestNet
- Asset: USDC
- Price: $0.01 per request
- Facilitator: GoPlausible

Example request:
{
  "prompt": "Explain x402 in simple terms.",
  "priority": "balanced",
  "budget": 0.01
}

InferPay analyzes each request, selects an appropriate LLM routing tier, processes the x402 payment, and returns the model response with usage and routing metadata.
`
  );
});

app.listen(PORT, () => {
  console.log(`InferPay backend running on port ${PORT}`);
});

