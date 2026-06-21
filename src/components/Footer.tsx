import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border py-8 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="15" fill="#C8F135" />
              <path
                d="M16 8C14 8 10 9.5 10 14c0 3 2 4.5 2 4.5l2 6h4l2-6s2-1.5 2-4.5c0-4.5-4-6-6-6z"
                fill="#1A1A1A"
              />
              <circle cx="16" cy="13" r="1.5" fill="#C8F135" />
            </svg>
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
