import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PhoneFrame } from '@/components/ui/PhoneFrame';

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 px-4 relative overflow-hidden">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(200,241,53,0.12)' }} />
          <div className="max-w-6xl mx-auto relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.1] tracking-[-0.02em] text-primary mb-4">
                  Your business deserves a home online.
                </h1>
                <p className="text-lg text-muted mb-8 max-w-md leading-relaxed">
                  Create a stunning link-in-bio page in 2 minutes. Share your
                  services, WhatsApp, location — all in one link.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/signup">
                    <Button size="lg" className="w-full sm:w-auto">
                      Get started free
                    </Button>
                  </Link>
                  <Link href="/pricing">
                    <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                      See an example
                    </Button>
                  </Link>
                </div>

                {/* Social proof strip */}
                <div className="mt-12">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex -space-x-2">
                      {['#E8D5F5', '#D5E8F5', '#F5E8D5', '#D5F5E8', '#F5D5E8'].map((bg, i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-medium text-primary"
                          style={{ backgroundColor: bg }}
                        >
                          {['S', 'C', 'T', 'F', 'P'][i]}
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-muted">
                      Built for <span className="font-semibold text-primary">salons, cafes & tutors</span> across India
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted">
                    <span className="text-accent">⚡</span>
                    <span>Set up in under 2 minutes</span>
                  </div>
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
              A professional online presence that&apos;s as easy to set up as it is beautiful.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {features.map((f) => (
                <Card key={f.title} hover className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mx-auto mb-4">
                    {f.icon}
                  </div>
                  <h3 className="font-medium text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-serif text-3xl sm:text-4xl tracking-[-0.02em] text-center mb-12">
              How it works
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              {steps.map((step, i) => (
                <div key={i} className="text-center">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4 text-sm font-semibold text-primary">
                    {i + 1}
                  </div>
                  <h3 className="font-medium mb-2">{step.title}</h3>
                  <p className="text-sm text-muted">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-serif text-3xl sm:text-4xl tracking-[-0.02em] text-center mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-muted text-center mb-12 max-w-md mx-auto">
              Everything is free. Build your page, share your link, grow your business.
            </p>
            <div className="max-w-lg mx-auto">
              <PricingCard
                name="Free Forever"
                price="₹0"
                period="forever"
                features={[
                  '1 beautiful profile page',
                  'Unlimited links',
                  'All 4 themes (Classic, Dark, Warm, Minimal)',
                  'All 3 fonts (Inter, Instrument Serif, Poppins)',
                  'WhatsApp, Instagram, Maps links',
                  'Analytics dashboard',
                  'QR code for your page',
                  'Custom button styles',
                ]}
                cta="Get started free"
                href="/signup"
                highlighted={true}
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
      <p className="text-xs text-muted mt-1">Bridal • Facials • Hair</p>
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
    desc: 'Share your WhatsApp, services, location, Instagram — from one URL.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
  },
  {
    title: 'Looks stunning on mobile',
    desc: 'Your customers are on mobile. Your page loads instantly, looks premium.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
  },
  {
    title: "Know what's working",
    desc: 'See how many people visited your page and clicked your links.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
];

const steps = [
  {
    title: 'Sign up free',
    desc: 'Create your account in seconds. No credit card needed.',
  },
  {
    title: 'Add your links & logo',
    desc: 'Add your WhatsApp, Instagram, services, and upload your logo.',
  },
  {
    title: 'Share your rooted.sbs/yourname link',
    desc: 'Put your link in your bio, QR code, or share directly.',
  },
];

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
            <svg className="w-4 h-4 text-accent mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
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
