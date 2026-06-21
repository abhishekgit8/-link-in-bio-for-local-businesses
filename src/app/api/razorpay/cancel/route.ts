import { getRazorpay } from '@/lib/razorpay';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('razorpay_subscription_id')
    .eq('id', user.id)
    .single();

  if (!profile?.razorpay_subscription_id) {
    return NextResponse.json({ error: 'No active subscription' }, { status: 400 });
  }

  const razorpay = getRazorpay();

  await razorpay.subscriptions.cancel(profile.razorpay_subscription_id, true);

  await supabase
    .from('profiles')
    .update({ subscription_status: 'cancelling' })
    .eq('id', user.id);

  return NextResponse.json({ success: true });
}
