import type { UsagePoint, ModelUsageShare } from '@/types';
import { cn, formatCurrency } from '@/lib/utils';

interface BarChartProps {
  data: UsagePoint[];
  mode: 'requests' | 'spend';
  height?: number;
}

export function BarChart({ data, mode, height = 180 }: BarChartProps) {
  const values = data.map((d) =>
    mode === 'requests' ? d.requests : d.spend
  );

  const actualMax = Math.max(...values, 0);
  const max = actualMax > 0 ? actualMax : 1;

  return (
    <div className="flex gap-2" style={{ height }}>
      {data.map((d, i) => {
        const value =
          mode === 'requests' ? d.requests : d.spend;

        const pct = (value / max) * 100;

        return (
          <div
            key={i}
            className="group flex min-w-0 flex-1 flex-col items-center"
          >
            <span className="h-5 text-[10px] font-medium text-ink-400 opacity-0 transition-opacity group-hover:opacity-100">
              {mode === 'requests'
                ? d.requests
                : formatCurrency(d.spend, 6)}
            </span>

            <div className="flex w-full flex-1 items-end justify-center">
              <div
                className="w-full max-w-[36px] rounded-t-md bg-gradient-to-t from-brand-600/40 to-brand-400/80 transition-all duration-300 group-hover:from-brand-500/60 group-hover:to-brand-300"
                style={{
                  height:
                    value > 0
                      ? `${Math.max(pct, 5)}%`
                      : '0%',
                }}
              />
            </div>

            <span className="mt-2 text-[10px] text-ink-500">
              {d.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

interface LineChartProps {
  data: UsagePoint[];
  height?: number;
}

export function LineChart({ data, height = 160 }: LineChartProps) {
  const values = data.map((d) => d.spend);

  const actualMax = Math.max(...values, 0);
  const max = actualMax > 0 ? actualMax * 1.15 : 1;

  const min = 0;
  const range = max - min || 1;

  const w = 100;
  const h = 82;
  const step = w / (data.length - 1 || 1);

  const points = values.map((v, i) => {
    const x = i * step;
    const y = h - ((v - min) / range) * h;
    return [x, y] as const;
  });

  const path = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`)
    .join(' ');

  const area = `${path} L${w},${h} L0,${h} Z`;

  return (
    <div style={{ height }} className="relative">
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-[85%] w-full">
        <defs>
          <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1cc4f0" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#1cc4f0" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#lineFill)" />
        <path d={path} fill="none" stroke="#1cc4f0" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        {points.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r="1.6" fill="#0b1120" stroke="#1cc4f0" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
      <div className="absolute inset-x-0 bottom-0 flex justify-between pt-2">
        {data.map((d, i) => (
          <span key={i} className="text-[10px] text-ink-500">
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

interface DonutChartProps {
  data: ModelUsageShare[];
  size?: number;
}

export function DonutChart({ data, size = 160 }: DonutChartProps) {
  const total = data.reduce((s, d) => s + d.share, 0) || 1;
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 40 40" style={{ width: size, height: size }} className="-rotate-90">
        <circle cx="20" cy="20" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
        {data.map((d, i) => {
          const len = (d.share / total) * circumference;
          const seg = (
            <circle
              key={i}
              cx="20"
              cy="20"
              r={radius}
              fill="none"
              stroke={d.color}
              strokeWidth="6"
              strokeDasharray={`${len} ${circumference - len}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
            />
          );
          offset += len;
          return seg;
        })}
      </svg>
      <div className="space-y-2">
        {data.map((d) => (
          <div key={d.model} className="flex items-center gap-2 text-xs">
            <span className="dot" style={{ background: d.color }} />
            <span
  className="max-w-[145px] truncate font-mono text-ink-300"
  title={d.model}
>
  {d.model}
</span>

<span className="ml-auto whitespace-nowrap font-semibold text-ink-100">
  {d.share.toFixed(1)}%
</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface HBarChartProps {
  data: { provider: string; success: number; color: string }[];
}

export function HBarChart({ data }: HBarChartProps) {
  return (
    <div className="space-y-3">
      {data.map((d) => (
        <div key={d.provider}>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-ink-300">{d.provider}</span>
            <span className="font-semibold text-ink-100">{d.success}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.04]">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${d.success}%`, background: d.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function ChartCard({ title, description, children, className }: ChartCardProps) {
  return (
    <div className={cn('card p-5', className)}>
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-ink-50">{title}</h3>
        {description && <p className="text-[11px] text-ink-500">{description}</p>}
      </div>
      {children}
    </div>
  );
}
