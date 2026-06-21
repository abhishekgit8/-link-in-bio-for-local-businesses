'use client';

import { Button } from '@/components/ui/Button';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
      <div className="text-center py-16">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <h2 className="text-lg font-medium mb-2">Something went wrong</h2>
        <p className="text-sm text-muted mb-6">
          An unexpected error occurred. Please try again.
        </p>
        <Button onClick={reset} size="sm">
          Try again
        </Button>
      </div>
    </div>
  );
}
