import { useEffect, type RefObject } from 'react';

interface UseClickOutsideOptions {
  onTrigger: () => void;
  enabled?: boolean;
  onEscape?: boolean;
}

export function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  { onTrigger, enabled = true, onEscape = true }: UseClickOutsideOptions
) {
  useEffect(() => {
    if (!enabled) return;
    const handlePointer = (e: MouseEvent | TouchEvent) => {
      const el = ref.current;
      if (el && !el.contains(e.target as Node)) onTrigger();
    };
    const handleKey = (e: KeyboardEvent) => {
      if (onEscape && e.key === 'Escape') onTrigger();
    };
    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('touchstart', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('touchstart', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [ref, onTrigger, enabled, onEscape]);
}
