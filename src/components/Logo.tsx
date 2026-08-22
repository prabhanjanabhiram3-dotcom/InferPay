import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
}

export function Logo({ className, showWordmark = true }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div className="relative grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-400/20 to-brand-600/10 ring-1 ring-brand-400/30">
        <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" aria-hidden>
          <path
            d="M12 2.5l7.5 4.3v8.4L12 19.5l-7.5-4.3V6.8L12 2.5z"
            stroke="#1cc4f0"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <path d="M12 7.5l3.5 2v4L12 15.5l-3.5-2v-4L12 7.5z" fill="#1cc4f0" opacity="0.85" />
          <circle cx="12" cy="11.5" r="1.3" fill="#0b1120" />
        </svg>
      </div>
      {showWordmark && (
        <div className="leading-none">
          <span className="text-[15px] font-semibold tracking-tight text-ink-50">
            Infer<span className="text-brand-300">Pay</span>
          </span>
        </div>
      )}
    </div>
  );
}
