'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="15" fill="#C8F135" />
            <path
              d="M16 8C14 8 10 9.5 10 14c0 3 2 4.5 2 4.5l2 6h4l2-6s2-1.5 2-4.5c0-4.5-4-6-6-6z"
              fill="#1A1A1A"
            />
            <circle cx="16" cy="13" r="1.5" fill="#C8F135" />
          </svg>
          <span className="font-serif text-xl tracking-tight text-primary">
            Rooted
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-muted hover:text-primary transition-colors duration-200"
          >
            Sign in
          </Link>
          <Link href="/signup">
            <Button size="sm">Get started free</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
