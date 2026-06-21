import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="font-serif text-6xl text-muted mb-4">404</h1>
        <p className="text-lg text-muted mb-8">
          This page doesn&apos;t exist.
        </p>
        <Link href="/">
          <Button>Go back home</Button>
        </Link>
      </div>
    </div>
  );
}
