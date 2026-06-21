'use client';

import { useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

export function TrackedLinks() {
  const supabase = createClient();
  const tracked = useRef<Set<string>>(new Set());

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const linkEl = target.closest('[data-link-id]') as HTMLElement | null;
      if (linkEl) {
        const linkId = linkEl.dataset.linkId;
        if (linkId && !tracked.current.has(linkId)) {
          tracked.current.add(linkId);
          supabase.from('link_clicks').insert({ link_id: linkId }).then(() => {});
        }
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  return null;
}
