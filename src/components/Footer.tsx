import Link from 'next/link';
import { Logo } from '@/components/Logo';

export function Footer() {
  return (
    <footer className="border-t border-border py-8 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Logo size={20} />
            <span className="font-serif text-sm">Rooted</span>
          </div>
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} Rooted. Built for local businesses.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted">
            <Link href="/pricing" className="hover:text-primary transition-colors">
              Pricing
            </Link>
            <a href="mailto:hello@rooted.sbs" className="hover:text-primary transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
