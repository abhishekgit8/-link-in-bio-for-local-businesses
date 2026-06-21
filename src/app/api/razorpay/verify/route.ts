import crypto from 'crypto';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature, plan } =
    await req.json();

  const body = razorpay_payment_id + '|' + razorpay_subscription_id;
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest('hex');

  const isValid = crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(razorpay_signature)
  );

  if (!isValid) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const daysToAdd = plan === 'yearly' ? 365 : 30;
  await supabase
    .from('profiles')
    .update({
      subscription_tier: 'pro',
      subscription_status: 'active',
      razorpay_subscription_id,
      subscription_end_date: new Date(
        Date.now() + daysToAdd * 24 * 60 * 60 * 1000
      ).toISOString(),
    })
    .eq('id', user.id);

  return NextResponse.json({ success: true });
}
