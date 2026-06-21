import { cn } from '@/lib/utils';

type BadgeVariant = 'free' | 'pro' | 'new';

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  free: 'bg-surface text-muted border border-border',
  pro: 'bg-accent/20 text-primary border border-accent/30',
  new: 'bg-blue-100 text-blue-700 border border-blue-200',
};

export function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
