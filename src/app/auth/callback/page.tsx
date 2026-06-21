'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { PageLoader } from '@/components/ui/PageLoader';

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handle = async () => {
      const code = searchParams.get('code');
      const next = searchParams.get('next') ?? '/dashboard';

      if (!code) {
        router.replace('/login?error=no_code');
        return;
      }

      const supabase = createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        router.replace(
          `/login?error=auth_failed&message=${encodeURIComponent(error.message)}`,
        );
        return;
      }

      router.replace(next);
    };

    handle();
  }, [router, searchParams]);

  return <PageLoader />;
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <CallbackHandler />
    </Suspense>
  );
}
