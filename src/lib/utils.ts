import type { Capability, Complexity, PipelineStageStatus, TxStatus } from '@/types';

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatCurrency(value: number, digits = 4): string {
  if (value === 0) return '$0.00';
  if (value < 0.01) return `$${value.toFixed(digits)}`;
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatNumber(value: number): string {
  return value.toLocaleString();
}

export function capabilityLabel(c: Capability): string {
  const map: Record<Capability, string> = {
    reasoning: 'Reasoning',
    coding: 'Coding',
    summarization: 'Summarization',
    translation: 'Translation',
    creative: 'Creative',
    classification: 'Classification',
    math: 'Math',
    vision: 'Vision',
    'tool-use': 'Tool use',
  };
  return map[c];
}

export function complexityColor(c: Complexity): string {
  if (c === 'Low') return 'text-success bg-success/10 border-success/30';
  if (c === 'Medium') return 'text-warning bg-warning/10 border-warning/30';
  return 'text-error bg-error/10 border-error/30';
}

export function statusColor(s: TxStatus): string {
  if (s === 'Payment verified') return 'text-success bg-success/10 border-success/30';
  if (s === 'Payment pending') return 'text-warning bg-warning/10 border-warning/30';
  if (s === 'Refunded') return 'text-ink-300 bg-white/[0.05] border-white/10';
  return 'text-error bg-error/10 border-error/30';
}

export function pipelineStatusColor(s: PipelineStageStatus): string {
  if (s === 'done') return 'bg-brand-400 text-ink-950';
  if (s === 'active') return 'bg-brand-500/20 text-brand-200 ring-2 ring-brand-400/40';
  if (s === 'skipped') return 'bg-white/[0.04] text-ink-500';
  return 'bg-white/[0.04] text-ink-400';
}

export function qualityColor(q: number): string {
  if (q >= 9) return 'text-success';
  if (q >= 8) return 'text-brand-300';
  if (q >= 7) return 'text-ink-200';
  return 'text-warning';
}

export function truncateAddr(addr: string, head = 6, tail = 4): string {
  if (addr.length <= head + tail) return addr;
  return `${addr.slice(0, head)}…${addr.slice(-tail)}`;
}
