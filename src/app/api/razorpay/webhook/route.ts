import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('x-razorpay-signature')!;

  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(body)
    .digest('hex');

  if (expected !== signature) {
    return NextResponse.json({ error: 'Invalid webhook' }, { status: 400 });
  }

  const event = JSON.parse(body);
  const supabase = createAdminClient();

  if (
    event.event === 'subscription.activated' ||
    event.event === 'subscription.charged'
  ) {
    const sub = event.payload.subscription.entity;
    const userId = sub.notes?.userId;
    if (userId) {
      await supabase.from('profiles').update({
        subscription_tier: 'pro',
        subscription_status: 'active',
        razorpay_subscription_id: sub.id,
        subscription_end_date: new Date(sub.current_end * 1000).toISOString(),
      }).eq('id', userId);
    }
  }

  if (
    event.event === 'subscription.cancelled' ||
    event.event === 'subscription.expired' ||
    event.event === 'subscription.completed'
  ) {
    const sub = event.payload.subscription.entity;
    const userId = sub.notes?.userId;
    if (userId) {
      await supabase.from('profiles').update({
        subscription_tier: 'free',
        subscription_status: 'inactive',
        razorpay_subscription_id: null,
      }).eq('id', userId);
    }
  }

  return NextResponse.json({ received: true });
}
