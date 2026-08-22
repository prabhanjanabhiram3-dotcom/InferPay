import type { PageId } from '@/types';

const NAV_EVENT = 'inferpay:navigate';

export function navigateTo(page: PageId) {
  window.dispatchEvent(new CustomEvent(NAV_EVENT, { detail: page }));
}

export function onNavigate(handler: (page: PageId) => void): () => void {
  const listener = (e: Event) => {
    const ce = e as CustomEvent<PageId>;
    handler(ce.detail);
  };
  window.addEventListener(NAV_EVENT, listener);
  return () => window.removeEventListener(NAV_EVENT, listener);
}
