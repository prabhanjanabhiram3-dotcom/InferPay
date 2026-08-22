import {
  LayoutDashboard,
  Sparkles,
  Boxes,
  Receipt,
  BarChart3,
  Settings,
  ChevronRight,
} from 'lucide-react';
import type { PageId } from '@/types';
import { Logo } from '@/components/Logo';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { useWallet } from "@txnlab/use-wallet-react";

interface SidebarProps {
  current: PageId;
  onNavigate: (page: PageId) => void;
  open: boolean;
  onClose: () => void;
}

const navItems: { id: PageId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'inference', label: 'Inference', icon: Sparkles },
  { id: 'models', label: 'Models', icon: Boxes },
  { id: 'transactions', label: 'Transactions', icon: Receipt },
  { id: 'usage', label: 'Usage', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
  
];



export function Sidebar({ current, onNavigate, open, onClose }: SidebarProps) {
  const { activeAccount } = useWallet();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-ink-950/70 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r border-white/[0.06] bg-ink-950/80 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Logo />
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-500">
            Workspace
          </p>
          <ul className="space-y-1">
            {navItems.map((item) => {
              const active = current === item.id;
              const Icon = item.icon;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigate(item.id)}
                    className={cn(
                      'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all',
                      active
                        ? 'bg-brand-500/10 text-ink-50 ring-1 ring-brand-400/25'
                        : 'text-ink-300 hover:bg-white/[0.04] hover:text-ink-100'
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-4.5 w-4.5 shrink-0 transition-colors',
                        active ? 'text-brand-300' : 'text-ink-400 group-hover:text-ink-200'
                      )}
                    />
                    <span className="flex-1 text-left font-medium">{item.label}</span>
                    {active && <ChevronRight className="h-3.5 w-3.5 text-brand-300" />}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 px-3">
            <p className="pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-500">
              Roadmap
            </p>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-accent-500/10 text-accent-400 ring-1 ring-accent-500/20">
                  <Boxes className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-ink-100">MCP Tool Routing</p>
                  <p className="text-[10px] text-ink-500">Coming soon</p>
                </div>
              </div>
              <p className="mt-2.5 text-[11px] leading-relaxed text-ink-400">
                Let agents discover and pay for external tools through x402.
              </p>
            </div>
          </div>
        </nav>

        <div className="border-t border-white/[0.06] p-4">
          <div className="rounded-xl border border-white/[0.06] bg-ink-900/60 p-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-pulse-soft rounded-full bg-success/60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                </span>
                <span className="text-xs font-medium text-ink-200">TestNet</span>
              </div>
              <Badge variant="accent" dot>
                x402
              </Badge>
            </div>
            <div className="mt-3 flex items-center gap-2.5">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-400/20 to-brand-600/10 text-[11px] font-semibold text-brand-200 ring-1 ring-brand-400/20">
                PW
              </div>
              <div className="min-w-0 flex-1">
  <p className="truncate text-xs font-medium text-ink-200">
    Pera Wallet
  </p>

  <p className="truncate text-[10px] text-ink-500">
    {activeAccount
      ? `${activeAccount.address.slice(0, 6)}...${activeAccount.address.slice(-4)} · connected`
      : "Not connected"}
  </p>
</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
