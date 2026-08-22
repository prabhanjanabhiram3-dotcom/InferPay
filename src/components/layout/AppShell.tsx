import { useState, type ReactNode } from 'react';
import type { PageId } from '@/types';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

interface AppShellProps {
  current: PageId;
  onNavigate: (page: PageId) => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function AppShell({ current, onNavigate, title, subtitle, children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavigate = (page: PageId) => {
    onNavigate(page);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-ink-950 text-ink-100">
      <div
        className="pointer-events-none fixed inset-0 bg-grid-faint bg-grid opacity-60"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed -top-40 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-brand-500/10 blur-[120px]"
        aria-hidden
      />

      <Sidebar
        current={current}
        onNavigate={handleNavigate}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:pl-[260px]">
        <Header
          title={title}
          subtitle={subtitle}
          onToggleSidebar={() => setSidebarOpen((s) => !s)}
        />
        <main className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
