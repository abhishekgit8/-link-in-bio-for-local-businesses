import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function UsernameNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-surface">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-border flex items-center justify-center mx-auto mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6B6B6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h1 className="font-serif text-3xl tracking-[-0.02em] mb-2">Page not found</h1>
        <p className="text-sm text-muted mb-8">
          This business page doesn&apos;t exist yet.
        </p>
        <Link href="/">
          <Button>Create your own page</Button>
        </Link>
      </div>
    </div>
  );
}
