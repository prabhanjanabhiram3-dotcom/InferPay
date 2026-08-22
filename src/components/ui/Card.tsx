import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  as?: 'div' | 'section' | 'article';
}

export function Card({ children, className, hover, as: Tag = 'div' }: CardProps) {
  return (
    <Tag className={cn('card p-5', hover && 'card-hover', className)}>{children}</Tag>
  );
}
