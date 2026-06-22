'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/Logo';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo size={28} />
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
