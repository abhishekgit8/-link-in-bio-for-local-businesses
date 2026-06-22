'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { PageLoader } from '@/components/ui/PageLoader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProfilePreview } from '@/components/ProfilePreview';
import { Check } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Profile, Link as LinkType, Theme, ButtonStyle, Font } from '@/lib/types';

const themes: { value: Theme; label: string; desc: string }[] = [
  { value: 'classic', label: 'Classic', desc: 'White card, dark text, Inter font' },
  { value: 'dark', label: 'Dark', desc: '#1A1A1A bg, white text' },
  { value: 'warm', label: 'Warm', desc: '#FDF6EC bg, serif font' },
  { value: 'minimal', label: 'Minimal', desc: 'Transparent cards, thin borders' },
];

const buttonStyles: { value: ButtonStyle; label: string }[] = [
  { value: 'filled', label: 'Filled' },
  { value: 'outline', label: 'Outline' },
  { value: 'soft', label: 'Soft' },
  { value: 'shadow', label: 'Shadow' },
];

const fonts: { value: Font; label: string }[] = [
  { value: 'inter', label: 'Inter' },
  { value: 'serif', label: 'Instrument Serif' },
  { value: 'poppins', label: 'Poppins' },
];

export default function AppearancePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<LinkType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      const { data: linksData } = await supabase
        .from('links')
        .select('*')
        .eq('profile_id', user.id)
        .order('position');

      if (profileData) setProfile(profileData);
      if (linksData) setLinks(linksData);
      setLoading(false);
    }
    load();
  }, []);

  const updateTheme = async (field: string, value: string) => {
    if (!profile) return;

    const updated = { ...profile, [field]: value };
    setProfile(updated);

    const { error } = await supabase
      .from('profiles')
      .update({ [field]: value })
      .eq('id', profile.id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Appearance updated');
    }
  };

  if (loading) return <PageLoader />;

  if (!profile) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-medium mb-1">Appearance</h1>
          <p className="text-sm text-muted">Customize the look and feel of your public page.</p>
        </div>
        <Card>
          <div className="text-center py-8">
            <p className="text-sm text-muted mb-4">Unable to load your profile. Please try refreshing the page.</p>
            <Button onClick={() => window.location.reload()} size="sm">Refresh</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-medium mb-1">Appearance</h1>
          <p className="text-sm text-muted">
            Customize the look and feel of your public page.
          </p>
        </div>
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? 'Edit' : 'Preview'}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
          {/* Theme */}
          <Card>
            <h3 className="font-medium mb-4">Theme</h3>
            <div className="grid grid-cols-2 gap-3">
              {themes.map((t) => {
                const selected = profile.theme === t.value;
                return (
                  <button
                    key={t.value}
                    onClick={() => updateTheme('theme', t.value)}
                    className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                      selected
                        ? 'border-accent bg-accent/5'
                        : 'border-border hover:border-primary/20'
                    }`}
                  >
                    {selected && (
                      <Check className="w-3.5 h-3.5 text-accent mb-2" />
                    )}
                    <p className="text-sm font-medium">{t.label}</p>
                    <p className="text-xs text-muted mt-0.5">{t.desc}</p>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Button style */}
          <Card>
            <h3 className="font-medium mb-4">Button Style</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {buttonStyles.map((bs) => (
                <button
                  key={bs.value}
                  onClick={() => updateTheme('button_style', bs.value)}
                  className={`py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                    profile.button_style === bs.value
                      ? 'border-accent bg-accent/5'
                      : 'border-border hover:border-primary/20'
                  }`}
                >
                  {bs.label}
                </button>
              ))}
            </div>
          </Card>

          {/* Font */}
          <Card>
            <h3 className="font-medium mb-4">Font</h3>
            <div className="grid grid-cols-3 gap-3">
              {fonts.map((f) => (
                <button
                  key={f.value}
                  onClick={() => updateTheme('font', f.value)}
                  className={`py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                    profile.font === f.value
                      ? 'border-accent bg-accent/5'
                      : 'border-border hover:border-primary/20'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Preview */}
        <div className="hidden lg:block lg:col-span-2">
          <div className="sticky top-8">
            <p className="text-sm font-medium text-muted mb-4 text-center">
              Live Preview
            </p>
            <ProfilePreview profile={profile} links={links} />
          </div>
        </div>
      </div>

      {showPreview && (
        <div className="fixed inset-0 z-40 bg-white md:hidden overflow-y-auto pt-4">
          <div className="flex justify-end px-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(false)}
            >
              Close preview
            </Button>
          </div>
          <ProfilePreview profile={profile} links={links} />
        </div>
      )}
    </div>
  );
}
