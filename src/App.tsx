import { useEffect, useState } from 'react';
import type { PageId } from '@/types';
import { AppShell } from '@/components/layout/AppShell';
import { OverviewPage } from '@/pages/OverviewPage';
import { InferencePage } from '@/pages/InferencePage';
import { ModelsPage } from '@/pages/ModelsPage';
import { TransactionsPage } from '@/pages/TransactionsPage';
import { UsagePage } from '@/pages/UsagePage';
import { SettingsPage } from '@/pages/SettingsPage';
import { onNavigate } from '@/lib/navigation';

const pageMeta: Record<PageId, { title: string; subtitle: string }> = {
  overview: { title: 'Overview', subtitle: 'Your inference routing at a glance' },
  inference: { title: 'Inference', subtitle: 'Route a prompt to the best model and pay per use' },
  models: { title: 'Models', subtitle: 'Browse and compare inference providers' },
  transactions: { title: 'Transactions', subtitle: 'x402 payment history on Algorand TestNet' },
  usage: { title: 'Usage', subtitle: 'Analytics across requests, spend, and providers' },
  settings: { title: 'Settings', subtitle: 'Routing, network, and API configuration' },
};

function App() {
  const [page, setPage] = useState<PageId>('overview');
  const meta = pageMeta[page];

  useEffect(() => onNavigate(setPage), []);

  return (
    <AppShell current={page} onNavigate={setPage} title={meta.title} subtitle={meta.subtitle}>
      {page === 'overview' && <OverviewPage onNavigate={setPage} />}
      {page === 'inference' && <InferencePage />}
      {page === 'models' && <ModelsPage />}
      {page === 'transactions' && <TransactionsPage />}
      {page === 'usage' && <UsagePage />}
      {page === 'settings' && <SettingsPage />}
    </AppShell>
  );
}

export default App;
