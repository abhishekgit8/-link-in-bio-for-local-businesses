import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { linkId } = await request.json();

  if (!linkId) {
    return NextResponse.json({ error: 'Missing linkId' }, { status: 400 });
  }

  const supabase = await createClient();

  await supabase.from('link_clicks').insert({ link_id: linkId });

  return NextResponse.json({ success: true });
}
