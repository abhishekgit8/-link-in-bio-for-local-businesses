'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';

const categories = [
  { value: 'salon', label: 'Salon / Spa' },
  { value: 'cafe', label: 'Cafe / Restaurant' },
  { value: 'tutor', label: 'Tutor / Teacher' },
  { value: 'freelancer', label: 'Freelancer' },
  { value: 'coach', label: 'Coach / Consultant' },
  { value: 'other', label: 'Other' },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function checkProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Check if profile already exists
      const { data } = await supabase
        .from('profiles')
        .select('business_name')
        .eq('id', user.id)
        .single();

      if (data?.business_name) {
        router.push('/dashboard');
        return;
      }

      // Check for pending data from signup
      const pending = sessionStorage.getItem('pending_profile');
      if (pending) {
        const parsed = JSON.parse(pending);
        setBusinessName(parsed.business_name || '');
        setCategory(parsed.category || '');
        sessionStorage.removeItem('pending_profile');
      }

      setLoading(false);
    }
    checkProfile();
  }, []);

  const createProfile = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      business_name: businessName,
      category,
      username: username || businessName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      theme: 'classic',
      button_style: 'filled',
      font: 'inter',
      subscription_tier: 'free',
    });

    if (error) {
      toast.error(error.message);
      setSaving(false);
      return;
    }

    toast.success('Profile created!');
    router.push('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-sm text-muted">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="15" fill="#C8F135" />
              <path d="M16 8C14 8 10 9.5 10 14c0 3 2 4.5 2 4.5l2 6h4l2-6s2-1.5 2-4.5c0-4.5-4-6-6-6z" fill="#1A1A1A" />
              <circle cx="16" cy="13" r="1.5" fill="#C8F135" />
            </svg>
            <span className="font-serif text-xl tracking-tight">Rooted</span>
          </div>
          <h1 className="text-2xl font-medium mb-1">Set up your page</h1>
          <p className="text-sm text-muted">
            Tell us about your business.
          </p>
        </div>

        <div className="space-y-4">
          <Input
            label="Business name"
            placeholder="Priya's Beauty Studio"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            required
          />

          <div className="w-full">
            <label className="block text-sm font-medium text-primary mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-sm text-primary outline-none focus:ring-2 focus:ring-accent focus:border-accent appearance-none cursor-pointer"
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Username (optional)"
            placeholder="priyas-beauty-studio"
            value={username}
            onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
            helperText="Your page will be at rooted.sbs/username"
          />

          <Button
            className="w-full mt-2"
            onClick={createProfile}
            loading={saving}
            disabled={!businessName}
          >
            Create my page
          </Button>
        </div>
      </div>
    </div>
  );
}
