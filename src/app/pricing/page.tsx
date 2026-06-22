import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Check } from 'lucide-react';

export default function PricingPage() {
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
              Everything is free. Build your page, share your link, grow your business.
            </p>
          </div>

          <div className="max-w-lg mx-auto">
            <Card className="border-accent ring-1 ring-accent/30">
              <h3 className="font-medium text-lg mb-1">Free Forever</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-semibold">₹0</span>
                <span className="text-sm text-muted">forever</span>
              </div>
              <ul className="space-y-3 mb-8">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted">
                    <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup">
                <Button className="w-full">
                  Get started free
                </Button>
              </Link>
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

const features = [
  '1 beautiful profile page',
  'Unlimited links',
  'All 4 themes (Classic, Dark, Warm, Minimal)',
  'All 3 fonts (Inter, Instrument Serif, Poppins)',
  'WhatsApp, Instagram, Maps links',
  'Analytics dashboard',
  'QR code for your page',
  'Custom button styles',
];

const faqs = [
  {
    q: 'Do I need a website?',
    a: 'No. Your Rooted page IS your website. Share it everywhere.',
  },
  {
    q: 'Is it really free?',
    a: 'Yes. No hidden charges, no credit card needed. Build and share your page for free.',
  },
  {
    q: 'Can I use my own domain?',
    a: 'Not yet, but your page lives at rooted.sbs/yourname which is clean and professional.',
  },
  {
    q: 'How do I share my page?',
    a: 'Copy your link (rooted.sbs/yourname) and add it to your Instagram bio, WhatsApp status, visiting card, or anywhere.',
  },
];
