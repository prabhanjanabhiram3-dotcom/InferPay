import { useEffect, useRef, useState } from 'react';
import {
  Menu,
  Network,
  Wallet,
  ChevronDown,
  Bell,
  Check,
  Settings as SettingsIcon,
  User,
  LogOut,
  Sparkles,
  CircleDot,
  ArrowUpRight,
} from 'lucide-react';
import type { PageId } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useClickOutside } from '@/hooks/useClickOutside';
import { navigateTo } from '@/lib/navigation';
import { cn } from '@/lib/utils';
import { useWallet } from "@txnlab/use-wallet-react";
import { x402Client, wrapFetchWithPayment } from "@x402/fetch";
import { ExactAvmScheme } from "@x402/avm/exact/client";
import type { ClientAvmSigner } from "@x402/avm";


interface HeaderProps {
  title: string;
  subtitle?: string;
  onToggleSidebar: () => void;
}

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  kind: 'info' | 'success' | 'warning';
}

const notifications: NotificationItem[] = [
  {
    id: 'n1',
    title: 'InferPro availability at 99.5%',
    body: 'Quality score updated for infer-pro-3 after the latest benchmark run.',
    time: '2m ago',
    unread: true,
    kind: 'info',
  },
  {
    id: 'n2',
    title: 'x402 payment verified',
    body: 'Transaction x402_9f2a settled on Algorand TestNet for $0.0084.',
    time: '14m ago',
    unread: true,
    kind: 'success',
  },
  {
    id: 'n3',
    title: 'Budget threshold approaching',
    body: 'You have used 78% of your default $0.01 per-request budget this week.',
    time: '1h ago',
    unread: true,
    kind: 'warning',
  },
  {
    id: 'n4',
    title: 'MCP Tool Routing preview',
    body: 'Coming soon — let agents discover and pay for external tools through x402.',
    time: 'Yesterday',
    unread: false,
    kind: 'info',
  },
];

const kindColor: Record<NotificationItem['kind'], string> = {
  info: 'text-brand-300 bg-brand-500/10 ring-brand-400/20',
  success: 'text-success bg-success/10 ring-success/25',
  warning: 'text-warning bg-warning/10 ring-warning/25',
};

export function Header({ title, subtitle, onToggleSidebar }: HeaderProps) {
  const [networkOpen, setNetworkOpen] = useState(false);
  const [network, setNetwork] = useState<'algorand-testnet' | 'algorand-mainnet'>('algorand-testnet');
  const [notifOpen, setNotifOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { wallets, activeAccount, signTransactions } = useWallet();

  const peraWallet = wallets[0];

  const handleConnectWallet = async () => {
    try {
      await peraWallet.connect();
    } catch (error) {
      console.error("Wallet connection failed:", error);
    }
  };

  const handleDisconnectWallet = async () => {
  try {
    await peraWallet.disconnect();
    setWalletOpen(false);
  } catch (error) {
    console.error("Wallet disconnect failed:", error);
  }
};
  
  const handleTestPayment = async () => {
  try {
    if (!activeAccount) {
      alert("Connect your Pera wallet first.");
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
  new ExactAvmScheme(signer)
);

const fetchWithPayment = wrapFetchWithPayment(fetch, client);
    const response = await fetchWithPayment(
      "http://localhost:3001/api/paid-test",
      {
        method: "GET",
      },
    );

    const data = await response.json();

    console.log("x402 payment response:", data);

    if (response.ok) {
      alert("Payment successful! x402 resource unlocked.");
    } else {
      alert(`Payment failed: ${response.status}`);
    }
  } catch (error) {
    console.error("x402 payment failed:", error);
    alert("x402 payment failed. Check browser console.");
  }
};

  const networkRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useClickOutside(networkRef, { onTrigger: () => setNetworkOpen(false) });
  useClickOutside(notifRef, { onTrigger: () => setNotifOpen(false) });
  useClickOutside(profileRef, { onTrigger: () => setProfileOpen(false) });

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleProfileNavigate = (page: PageId) => {
    setProfileOpen(false);
    navigateTo(page);
  };

  

  // Close popovers on resize to avoid stray open state on mobile <-> desktop transitions.
  useEffect(() => {
    const onResize = () => {
      setNetworkOpen(false);
      setNotifOpen(false);
      setProfileOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-white/[0.06] bg-ink-950/70 px-4 backdrop-blur-xl sm:px-6">
      <button
        onClick={onToggleSidebar}
        className="grid h-9 w-9 place-items-center rounded-lg text-ink-300 hover:bg-white/[0.06] hover:text-ink-100 lg:hidden"
        aria-label="Toggle navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-base font-semibold text-ink-50 sm:text-lg">{title}</h1>
        {subtitle && <p className="truncate text-xs text-ink-400">{subtitle}</p>}
      </div>

      {/* Network selector dropdown */}
      <div ref={networkRef} className="relative hidden md:block">
        <button
          onClick={() => setNetworkOpen((s) => !s)}
          className={cn(
            'btn-ghost h-9 px-3 text-xs',
            networkOpen && 'bg-white/[0.08] text-ink-50'
          )}
          aria-haspopup="menu"
          aria-expanded={networkOpen}
        >
          <Network className="h-3.5 w-3.5 text-brand-300" />
          {network === 'algorand-testnet' ? 'Algorand TestNet' : 'Algorand MainNet'}
          <ChevronDown
            className={cn('h-3.5 w-3.5 text-ink-400 transition-transform', networkOpen && 'rotate-180')}
          />
        </button>
        {networkOpen && (
          <div
            role="menu"
            className="absolute right-0 top-11 z-30 w-60 rounded-xl border border-white/[0.08] bg-ink-900/95 p-1.5 shadow-2xl backdrop-blur-xl animate-fade-up"
          >
            <p className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-500">
              Network
            </p>
            <NetworkOption
              active={network === 'algorand-testnet'}
              label="Algorand TestNet"
              hint="Sandbox · no real value"
              onClick={() => {
                setNetwork('algorand-testnet');
                setNetworkOpen(false);
              }}
            />
            <NetworkOption
              disabled
              label="Algorand MainNet"
              hint="Coming soon"
              badge="Coming soon"
            />
            <div className="mx-2 my-1.5 h-px bg-white/[0.06]" />
            <p className="px-2.5 py-1.5 text-[11px] leading-relaxed text-ink-500">
              Network selection is currently limited to Algorand TestNet.
            </p>
          </div>
        )}
      </div>

      {/* Notifications */}
      <div ref={notifRef} className="relative">
        <button
          onClick={() => setNotifOpen((s) => !s)}
          className={cn(
            'relative grid h-9 w-9 place-items-center rounded-lg text-ink-300 hover:bg-white/[0.06] hover:text-ink-100',
            notifOpen && 'bg-white/[0.06] text-ink-100'
          )}
          aria-label="Notifications"
          aria-expanded={notifOpen}
        >
          <Bell className="h-4.5 w-4.5" />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand-500 px-1 text-[9px] font-bold text-ink-950">
              {unreadCount}
            </span>
          )}
        </button>
        {notifOpen && (
          <div
            role="menu"
            className="absolute right-0 top-11 z-30 w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-white/[0.08] bg-ink-900/95 shadow-2xl backdrop-blur-xl animate-fade-up"
          >
            <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
              <p className="text-sm font-semibold text-ink-50">Notifications</p>
              <Badge variant="neutral" className="text-[10px]">
                {unreadCount} unread
              </Badge>
            </div>
            <div className="max-h-80 overflow-y-auto p-1.5">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    'flex gap-3 rounded-lg p-3 transition-colors hover:bg-white/[0.03]',
                    n.unread && 'bg-white/[0.02]'
                  )}
                >
                  <span
                    className={cn(
                      'mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg ring-1',
                      kindColor[n.kind]
                    )}
                  >
                    {n.kind === 'info' && <Sparkles className="h-3.5 w-3.5" />}
                    {n.kind === 'success' && <Check className="h-3.5 w-3.5" />}
                    {n.kind === 'warning' && <CircleDot className="h-3.5 w-3.5" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-xs font-semibold text-ink-100">{n.title}</p>
                      {n.unread && <span className="dot bg-brand-400" />}
                    </div>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-ink-400">{n.body}</p>
                    <p className="mt-1 text-[10px] text-ink-500">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-white/[0.06] p-2">
              <p className="px-2 py-1 text-[10px] text-ink-500">
                Demo notifications — no real events were triggered.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Connect Wallet */}
     <button
  onClick={() => {
  if (activeAccount) {
    setWalletOpen(true);
  } else {
    handleConnectWallet();
  }
}}
  className="btn-ghost h-9 px-3 text-xs"
>
  <Wallet className="h-3.5 w-3.5 text-ink-300" />
  <span className="hidden sm:inline">
    {activeAccount
      ? `${activeAccount.address.slice(0, 6)}...${activeAccount.address.slice(-4)}`
      : "Connect Wallet"}
  </span>
</button>

<button
  onClick={handleTestPayment}
  className="btn-ghost h-9 px-3 text-xs"
>
  Test x402 Payment
</button>

      {/* Profile / avatar */}
      <div ref={profileRef} className="relative">
        <button
          onClick={() => setProfileOpen((s) => !s)}
          className={cn(
            'grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brand-400/25 to-brand-600/10 text-xs font-semibold text-brand-100 ring-1 ring-brand-400/20 transition-all hover:ring-brand-400/40',
            profileOpen && 'ring-brand-400/50'
          )}
          aria-label="Account menu"
          aria-expanded={profileOpen}
        >
  {activeAccount ? activeAccount.address.slice(0, 2) : 'IP'}
</button>
        {profileOpen && (
          <div
            role="menu"
            className="absolute right-0 top-11 z-30 w-60 rounded-xl border border-white/[0.08] bg-ink-900/95 p-1.5 shadow-2xl backdrop-blur-xl animate-fade-up"
          >
            <div className="flex items-center gap-3 rounded-lg p-2.5">
  <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brand-400/25 to-brand-600/10 text-xs font-semibold text-brand-100 ring-1 ring-brand-400/20">
    {activeAccount ? activeAccount.address.slice(0, 2) : 'IP'}
  </div>

  <div className="min-w-0">
    <p className="truncate text-sm font-semibold text-ink-50">
      {activeAccount ? 'Pera Wallet' : 'InferPay'}
    </p>

    <p className="truncate font-mono text-[11px] text-ink-500">
      {activeAccount
        ? `${activeAccount.address.slice(0, 8)}...${activeAccount.address.slice(-6)}`
        : 'Wallet not connected'}
    </p>
  </div>
</div>
            <div className="mx-1.5 my-1 h-px bg-white/[0.06]" />
            <MenuItem
  icon={User}
  label="Wallet Profile"
  hint={activeAccount ? "Connected via Pera Wallet" : "Wallet not connected"}
  onClick={() => setProfileOpen(false)}
/>
            <MenuItem
              icon={SettingsIcon}
              label="Settings"
              onClick={() => handleProfileNavigate('settings')}
            />
            <div className="mx-1.5 my-1 h-px bg-white/[0.06]" />
            <MenuItem
              icon={LogOut}
              label="Sign out"
              hint="Demo only"
              onClick={() => setProfileOpen(false)}
            />
          </div>
        )}
      </div>

      <div className="hidden items-center pl-1 lg:flex">
        <Badge variant="accent" dot>
          x402 enabled
        </Badge>
      </div>

      {/* Wallet connection modal */}
      <Modal
  open={walletOpen}
  onClose={() => setWalletOpen(false)}
  title="Wallet"
  description="Pera Wallet connected to Algorand TestNet."
  footer={
    <>
      <button
        onClick={() => setWalletOpen(false)}
        className="btn-ghost h-9 px-4 text-xs"
      >
        Close
      </button>

      <button
        onClick={handleDisconnectWallet}
        className="btn-ghost h-9 px-4 text-xs"
      >
        <LogOut className="h-3.5 w-3.5" />
        Disconnect
      </button>
    </>
  }
>
  <div className="space-y-3">
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500/10 text-brand-300 ring-1 ring-brand-400/20">
        <Wallet className="h-5 w-5" />
      </span>

      <div className="min-w-0">
        <p className="text-sm font-semibold text-ink-100">
          Pera Wallet
        </p>

        <p className="truncate font-mono text-[11px] text-ink-500">
          {activeAccount?.address ?? "Not connected"}
        </p>
      </div>

      <Badge variant="brand" className="ml-auto">
        Connected
      </Badge>
    </div>

    <div className="flex items-start gap-2 rounded-xl border border-success/20 bg-success/[0.06] p-3">
      <CircleDot className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />

      <p className="text-[11px] leading-relaxed text-ink-300">
        x402 payments are signed with Pera Wallet and settled on
        Algorand TestNet through GoPlausible.
      </p>
    </div>

    <div className="flex items-center gap-2 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
      <Network className="h-3.5 w-3.5 text-brand-300" />

      <div>
        <p className="text-[10px] uppercase tracking-wider text-ink-500">
          Network
        </p>
        <p className="text-xs font-medium text-ink-200">
          Algorand TestNet
        </p>
      </div>
    </div>
  </div>
</Modal>
    </header>
  );
}

function NetworkOption({
  active,
  label,
  hint,
  badge,
  disabled,
  onClick,
}: {
  active?: boolean;
  label: string;
  hint?: string;
  badge?: string;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors',
        disabled
          ? 'cursor-not-allowed opacity-60'
          : active
            ? 'bg-brand-500/10 text-ink-50'
            : 'text-ink-200 hover:bg-white/[0.04]'
      )}
    >
      <Network className={cn('h-3.5 w-3.5', active ? 'text-brand-300' : 'text-ink-500')} />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium">{label}</p>
        {hint && <p className="text-[10px] text-ink-500">{hint}</p>}
      </div>
      {active && <Check className="h-3.5 w-3.5 text-brand-300" />}
      {badge && (
        <span className="chip border-white/10 bg-white/[0.04] text-[10px] text-ink-400">
          {badge}
        </span>
      )}
    </button>
  );
}

function MenuItem({
  icon: Icon,
  label,
  hint,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  hint?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-ink-200 transition-colors hover:bg-white/[0.04] hover:text-ink-50"
    >
      <Icon className="h-3.5 w-3.5 text-ink-400" />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium">{label}</p>
        {hint && <p className="text-[10px] text-ink-500">{hint}</p>}
      </div>
    </button>
  );
}
