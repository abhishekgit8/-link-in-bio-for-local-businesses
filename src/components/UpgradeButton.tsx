'use client';

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_subscription_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  subscription_id: string;
  name: string;
  description: string;
  image: string;
  prefill: { name: string | null; email: string | null };
  theme: { color: string };
  handler: (response: RazorpayResponse) => void;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
      on: (event: string, handler: (res: { error: { description: string } }) => void) => void;
    };
  }
}

interface Props {
  plan: 'monthly' | 'yearly';
}

export function UpgradeButton({ plan }: Props) {
  const handleUpgrade = async () => {
    const res = await fetch('/api/razorpay/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    });
    const { subscriptionId, keyId, userName, userEmail } = await res.json();

    const options: RazorpayOptions = {
      key: keyId,
      subscription_id: subscriptionId,
      name: 'Rooted',
      description:
        plan === 'yearly' ? 'Pro Plan — ₹2,499/year' : 'Pro Plan — ₹299/month',
      image: '/logo.png',
      prefill: { name: userName, email: userEmail },
      theme: { color: '#C8F135' },
      handler: async (response: RazorpayResponse) => {
        const verify = await fetch('/api/razorpay/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...response, plan }),
        });
        const result = await verify.json();
        if (result.success) window.location.href = '/dashboard?upgraded=true';
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', (res) => {
      alert('Payment failed: ' + res.error.description);
    });
    rzp.open();
  };

  return (
    <button
      onClick={handleUpgrade}
      className="bg-[#C8F135] text-[#1A1A1A] font-semibold px-6 py-3 rounded-full hover:scale-[0.98] active:scale-95 transition-transform text-sm"
    >
      {plan === 'yearly'
        ? 'Upgrade to Pro — ₹2,499/yr'
        : 'Upgrade to Pro — ₹299/mo'}
    </button>
  );
}
