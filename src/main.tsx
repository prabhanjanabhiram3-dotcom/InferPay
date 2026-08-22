import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import {
  WalletProvider,
  WalletManager,
} from "@txnlab/use-wallet-react";

import { pera } from "@txnlab/use-wallet-pera";


const walletManager = new WalletManager({
  wallets: [pera()],
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WalletProvider manager={walletManager}>
  <App />
</WalletProvider>
  </StrictMode>
);
