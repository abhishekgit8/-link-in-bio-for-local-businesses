import { getRazorpay } from '@/lib/razorpay';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { plan } = await req.json();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('business_name, razorpay_subscription_id')
    .eq('id', user.id)
    .single();

  const planId =
    plan === 'yearly'
      ? process.env.RAZORPAY_PLAN_ID_YEARLY!
      : process.env.RAZORPAY_PLAN_ID_MONTHLY!;

  const razorpay = getRazorpay();

  const subscription = await razorpay.subscriptions.create({
    plan_id: planId,
    customer_notify: 1,
    quantity: 1,
    total_count: plan === 'yearly' ? 1 : 12,
    notes: { userId: user.id, email: user.email || '' },
  });

  return NextResponse.json({
    subscriptionId: subscription.id,
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    userName: profile?.business_name,
    userEmail: user.email,
  });
}
