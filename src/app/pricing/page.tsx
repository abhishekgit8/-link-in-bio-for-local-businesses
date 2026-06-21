'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { UpgradeButton } from '@/components/UpgradeButton';
import { Check } from 'lucide-react';

export default function PricingPage() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl sm:text-5xl tracking-[-0.02em] mb-4">
              Simple, transparent pricing
            </h1>
            <p className="text-muted max-w-md mx-auto">
              Start free. Upgrade when you outgrow the basics.
            </p>

            {/* Billing toggle */}
            <div className="flex items-center justify-center gap-3 mt-8">
              <button
                onClick={() => setBilling('monthly')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  billing === 'monthly'
                    ? 'bg-primary text-white'
                    : 'bg-border text-muted hover:text-primary'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBilling('yearly')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  billing === 'yearly'
                    ? 'bg-primary text-white'
                    : 'bg-border text-muted hover:text-primary'
                }`}
              >
                Yearly <span className="text-accent text-xs ml-1">Save 30%</span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Free */}
            <Card>
              <h3 className="font-medium text-lg mb-1">Free</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-semibold">₹0</span>
                <span className="text-sm text-muted">forever</span>
              </div>
              <ul className="space-y-3 mb-8">
                {freeFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted">
                    <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup">
                <Button variant="secondary" className="w-full">
                  Get started free
                </Button>
              </Link>
            </Card>

            {/* Pro */}
            <Card className="relative border-accent ring-1 ring-accent/30">
              <Badge variant="pro" className="absolute -top-3 right-6">
                Popular
              </Badge>
              <h3 className="font-medium text-lg mb-1">Pro</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-3xl font-semibold">
                  {billing === 'monthly' ? '₹299' : '₹2,499'}
                </span>
                <span className="text-sm text-muted">
                  {billing === 'monthly' ? '/month' : '/year'}
                </span>
              </div>
              {billing === 'yearly' && (
                <p className="text-xs text-muted mb-6">
                  ₹208/month — save ₹1,089 (2 free months)
                </p>
              )}
              {billing === 'monthly' && <div className="mb-6" />}
              <ul className="space-y-3 mb-8">
                {proFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted">
                    <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <UpgradeButton plan={billing} />
            </Card>
          </div>

          <div className="mt-16 max-w-3xl mx-auto">
            <h2 className="font-serif text-2xl tracking-[-0.02em] text-center mb-8">
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <Card key={faq.q}>
                  <h3 className="font-medium text-sm mb-1">{faq.q}</h3>
                  <p className="text-sm text-muted">{faq.a}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

const freeFeatures = [
  '1 beautiful profile page',
  'Up to 5 links',
  'Basic themes (Classic, Warm)',
  'WhatsApp, Instagram, Maps links',
  'QR code for your page',
  '"Made with Rooted" badge',
];

const proFeatures = [
  'Unlimited links',
  'All 4 themes including Dark & Minimal',
  'Analytics dashboard',
  'Remove "Made with Rooted" badge',
  'Custom button colors',
  'Priority email support',
  'Early access to new features',
];

const faqs = [
  {
    q: 'Do I need a website?',
    a: 'No. Your Rooted page IS your website. Share it everywhere.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Cancel from settings, keeps Pro until billing period ends.',
  },
  {
    q: 'Do you support UPI?',
    a: 'Yes — UPI, cards, net banking, wallets via Razorpay.',
  },
  {
    q: 'Can I switch plans anytime?',
    a: 'Yes. Upgrade or downgrade at any time. If you downgrade, you\'ll keep Pro features until the end of your billing period.',
  },
];
