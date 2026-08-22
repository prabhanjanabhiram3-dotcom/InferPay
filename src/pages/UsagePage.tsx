import { Activity, DollarSign, Percent, Cpu, TrendingUp } from 'lucide-react';
import { StatCard } from '@/components/StatCard';
import { ChartCard, BarChart, LineChart, DonutChart} from '@/components/UsageChart';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/lib/api';

interface UsageData {
  totalRequests: number;
  totalSpend: number;
  averageCost: number;
  mostUsedModel: string;
  successRate: number;
  fallbackCount: number;

  modelUsageDistribution: {
  model: string;
  share: number;
  color: string;
}[];

  requestsOverTime: {
  label: string;
  requests: number;
  spend: number;
}[];

spendOverTime: {
  label: string;
  requests: number;
  spend: number;
}[];

costPerInference: {
  label: string;
  requests: number;
  spend: number;
}[];
}

export function UsagePage() {
const [usage, setUsage] = useState<UsageData>({
  requestsOverTime: [
  { label: 'Mon', requests: 0, spend: 0 },
  { label: 'Tue', requests: 0, spend: 0 },
  { label: 'Wed', requests: 0, spend: 0 },
  { label: 'Thu', requests: 0, spend: 0 },
  { label: 'Fri', requests: 0, spend: 0 },
  { label: 'Sat', requests: 0, spend: 0 },
  { label: 'Sun', requests: 0, spend: 0 },
],

spendOverTime: [
  { label: 'Mon', requests: 0, spend: 0 },
  { label: 'Tue', requests: 0, spend: 0 },
  { label: 'Wed', requests: 0, spend: 0 },
  { label: 'Thu', requests: 0, spend: 0 },
  { label: 'Fri', requests: 0, spend: 0 },
  { label: 'Sat', requests: 0, spend: 0 },
  { label: 'Sun', requests: 0, spend: 0 },
],

costPerInference: [
  { label: 'Mon', requests: 0, spend: 0 },
  { label: 'Tue', requests: 0, spend: 0 },
  { label: 'Wed', requests: 0, spend: 0 },
  { label: 'Thu', requests: 0, spend: 0 },
  { label: 'Fri', requests: 0, spend: 0 },
  { label: 'Sat', requests: 0, spend: 0 },
  { label: 'Sun', requests: 0, spend: 0 },
],
  totalRequests: 0,
  totalSpend: 0,
  averageCost: 0,
  mostUsedModel: 'None',
  successRate: 0,
  fallbackCount: 0,
  modelUsageDistribution: [],
});

useEffect(() => {
  const loadUsage = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/usage`);

      if (!response.ok) {
        throw new Error('Failed to load usage data');
      }

      const data = await response.json();
      setUsage(data);
    } catch (error) {
      console.error('Usage load error:', error);
    }
  };

  loadUsage();
}, []);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
  label="Total Requests"
  value={formatNumber(usage.totalRequests)}
  icon={Activity}
  accent="brand"
/>

<StatCard
  label="Total Spend"
  value={formatCurrency(usage.totalSpend, 6)}
  icon={DollarSign}
  accent="accent"
/>

<StatCard
  label="Avg Inference Cost"
  value={formatCurrency(usage.averageCost, 6)}
  icon={Percent}
  accent="neutral"
/>

<StatCard
  label="Most-used Model"
  value={usage.mostUsedModel}
  icon={Cpu}
  sub="by recorded request volume"
  accent="brand"
/>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Requests Over Time"
          description="Daily routed requests (last 7 days)"
        >
          <BarChart data={usage.requestsOverTime} mode="requests" />
        </ChartCard>
        <ChartCard
          title="Spending Over Time"
          description="Weekly spend in USD via x402"
        >
          <LineChart data={usage.spendOverTime} />
        </ChartCard>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <ChartCard
          title="Cost per Inference"
          description="Average USD per request over time"
        >
          <BarChart
  data={usage.costPerInference}
  mode="spend"
  height={150}
/>
        </ChartCard>
        <ChartCard
          title="Model Usage Distribution"
          description="Share of total requests by model"
        >
          <DonutChart data={usage.modelUsageDistribution} />
        </ChartCard>
        <ChartCard
  title="Fallback Rate"
  description="Share of requests that required a fallback model"
>
  <div className="flex h-[180px] items-center justify-center">
    <div className="text-center">
      <p className="text-3xl font-semibold text-ink-50">
        {usage.totalRequests > 0
          ? ((usage.fallbackCount / usage.totalRequests) * 100).toFixed(1)
          : '0.0'}
        %
      </p>

      <p className="mt-2 text-xs text-ink-500">
        {usage.fallbackCount} of {usage.totalRequests} requests
      </p>
    </div>
  </div>
</ChartCard>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
  label="Fallback Requests"
  value={formatNumber(usage.fallbackCount)}
  icon={TrendingUp}
  sub="requests that required another model"
  accent="accent"
/>
        <StatCard
  label="Success Rate"
  value={`${usage.successRate.toFixed(1)}%`}
  icon={Cpu}
  sub="recorded inference requests"
  accent="brand"
/>
        <StatCard
  label="Avg Inference Cost"
  value={formatCurrency(usage.averageCost, 6)}
  icon={Percent}
  sub="based on recorded requests"
  accent="neutral"
/>

      </section>
    </div>
  );
}
