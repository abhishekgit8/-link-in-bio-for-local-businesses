'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export function ProfileTracker({ profileId }: { profileId: string }) {
  const supabase = createClient();

  useEffect(() => {
    supabase.from('page_views').insert({ profile_id: profileId }).then(() => {});
  }, []);

  return null;
}
