import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PhoneFrame } from '@/components/ui/PhoneFrame';
import { CheckCircle } from 'lucide-react';

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 px-4 relative overflow-hidden">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-6xl mx-auto relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge variant="new" className="mb-4">
                  Launching soon
                </Badge>
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.1] tracking-[-0.02em] text-primary mb-4">
                  Your business deserves a home online.
                </h1>
                <p className="text-lg text-muted mb-8 max-w-md leading-relaxed">
                  One beautiful page for your salon, cafe, or studio. Share your
                  links, services, and contact info — all from a single, elegant
                  link.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/signup">
                    <Button size="lg" className="w-full sm:w-auto">
                      Get started free
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                      See how it works
                    </Button>
                  </Link>
                </div>

                {/* Social proof */}
                <div className="flex items-center gap-3 mt-10">
                  <div className="flex -space-x-2">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-border border-2 border-white flex items-center justify-center text-[10px] font-medium text-muted"
                      >
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted">
                    <span className="font-semibold text-primary">500+</span> local
                    businesses trust Rooted
                  </p>
                </div>
              </div>

              {/* Phone mockup */}
              <div className="hidden lg:block">
                <PhoneFrame>
                  <SampleProfile />
                </PhoneFrame>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-serif text-3xl sm:text-4xl tracking-[-0.02em] text-center mb-4">
              Everything you need in one link
            </h2>
            <p className="text-muted text-center mb-12 max-w-md mx-auto">
              A professional online presence that&apos;s as easy to set up as it is
              beautiful.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {features.map((f) => (
                <Card key={f.title} hover className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mx-auto mb-4">
                    {f.icon}
                  </div>
                  <h3 className="font-medium text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {f.desc}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-serif text-3xl sm:text-4xl tracking-[-0.02em] text-center mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-muted text-center mb-12 max-w-md mx-auto">
              Start free, upgrade when you&apos;re ready.
            </p>
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <PricingCard
                name="Free"
                price="₹0"
                period="forever"
                features={[
                  '1 profile page',
                  'Up to 5 links',
                  'Basic themes',
                  '"Made with Rooted" badge',
                ]}
                cta="Get started free"
                href="/signup"
                highlighted={false}
              />
              <PricingCard
                name="Pro"
                price="₹299"
                period="/month"
                features={[
                  'Unlimited links',
                  'All themes & fonts',
                  'Analytics',
                  'Remove badge',
                  'Custom button colors',
                  'Priority support',
                ]}
                cta="Upgrade to Pro"
                href="/signup"
                highlighted={true}
                badge="Popular"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function SampleProfile() {
  return (
    <div className="flex flex-col items-center text-center py-4">
      <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-lg font-medium mb-3">
        PB
      </div>
      <h3 className="font-medium text-base">Priya&apos;s Beauty Studio</h3>
      <p className="text-xs text-muted mt-1">
        Bridal • Facials • Hair
      </p>
      <p className="text-xs text-muted mt-2 max-w-[200px]">
        Professional beauty services in your neighborhood. Walk-ins welcome!
      </p>
      <div className="w-full mt-4 space-y-2">
        {['Book an appointment', 'Instagram', 'WhatsApp', 'Get directions'].map(
          (label, i) => (
            <div
              key={i}
              className="w-full py-2.5 px-4 rounded-xl bg-primary text-white text-sm font-medium"
            >
              {label}
            </div>
          )
        )}
      </div>
      <p className="text-[10px] text-muted/50 mt-4">Made with Rooted</p>
    </div>
  );
}

const features = [
  {
    title: 'One link for everything',
    desc: 'Put your Instagram, WhatsApp, bookings, and menu behind a single beautiful link.',
    icon: <LinkIcon />,
  },
  {
    title: 'Looks stunning on mobile',
    desc: 'Every page is crafted to feel premium on phones — because that&apos;s where your customers are.',
    icon: <MobileIcon />,
  },
  {
    title: 'Collect leads & bookings',
    desc: 'Add phone links, WhatsApp buttons, Google Maps embeds — turn visitors into customers.',
    icon: <LeadsIcon />,
  },
];

function LinkIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function MobileIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  );
}

function LeadsIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function PricingCard({
  name,
  price,
  period,
  features,
  cta,
  href,
  highlighted,
  badge,
}: {
  name: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  href: string;
  highlighted: boolean;
  badge?: string;
}) {
  return (
    <Card
      className={`relative ${highlighted ? 'border-accent ring-1 ring-accent/30' : ''}`}
    >
      {badge && (
        <Badge variant="pro" className="absolute -top-3 right-6">
          {badge}
        </Badge>
      )}
      <h3 className="font-medium text-lg mb-1">{name}</h3>
      <div className="flex items-baseline gap-1 mb-6">
        <span className="text-3xl font-semibold">{price}</span>
        <span className="text-sm text-muted">{period}</span>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-muted">
            <CheckCircle className="w-4 h-4 text-accent mt-0.5 shrink-0" />
            {f}
          </li>
        ))}
      </ul>
      <Link href={href} className="block">
        <Button variant={highlighted ? 'primary' : 'secondary'} className="w-full">
          {cta}
        </Button>
      </Link>
    </Card>
  );
}
