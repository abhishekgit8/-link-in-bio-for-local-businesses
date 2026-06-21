'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { PageLoader } from '@/components/ui/PageLoader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Profile } from '@/lib/types';

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setProfile(data);
      setLoading(false);
    }
    loadProfile();
  }, []);

  if (loading) return <PageLoader />;

  const profileUrl = profile?.username
    ? `${window.location.origin}/${profile.username}`
    : null;

  const copyUrl = () => {
    if (profileUrl) {
      navigator.clipboard.writeText(profileUrl);
      toast.success('Copied to clipboard!');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-medium mb-1">Dashboard</h1>
        <p className="text-sm text-muted">
          Welcome back{profile?.business_name ? `, ${profile.business_name}` : ''}
        </p>
      </div>

      {profile?.username ? (
        <Card className="mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="bg-white p-2 rounded-xl border border-border">
              <QRCodeSVG value={profileUrl || ''} size={80} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium mb-1">Your public profile</p>
              <p className="text-sm text-muted truncate mb-3">{profileUrl}</p>
              <div className="flex gap-2">
                <Button size="sm" onClick={copyUrl}>
                  <Copy className="w-3.5 h-3.5 mr-1.5" />
                  Copy URL
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(profileUrl!, '_blank')}
                >
                  <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                  Open
                </Button>
              </div>
            </div>
            <Badge variant={profile.subscription_tier === 'pro' ? 'pro' : 'free'}>
              {profile.subscription_tier === 'pro' ? 'Pro' : 'Free'}
            </Badge>
          </div>
        </Card>
      ) : (
        <Card className="mb-6">
          <p className="text-sm text-muted">
            Set up your username in{" "}
            <a href="/dashboard/settings" className="text-primary font-medium underline">
              Settings
            </a>{" "}
            to get your public link.
          </p>
        </Card>
      )}

      {!profile?.username && (
        <Card>
          <div className="text-center py-8">
            <h3 className="font-medium mb-2">Welcome to Rooted!</h3>
            <p className="text-sm text-muted mb-4">
              Let&apos;s get started. First, set up your profile.
            </p>
            <a href="/dashboard/settings">
              <Button>Get started</Button>
            </a>
          </div>
        </Card>
      )}
    </div>
  );
}
