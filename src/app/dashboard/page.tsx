'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { PageLoader } from '@/components/ui/PageLoader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, ExternalLink, Eye, MousePointerClick, Check } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import type { Profile, Link as LinkType } from '@/lib/types';

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<LinkType[]>([]);
  const [totalViews, setTotalViews] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      const { data: linksData } = await supabase
        .from('links')
        .select('*')
        .eq('profile_id', user.id)
        .order('position');

      // Get stats
      const { count: views } = await supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', user.id);

      const { count: clicks } = await supabase
        .from('link_clicks')
        .select('*', { count: 'exact', head: true })
        .in('link_id', (linksData || []).map(l => l.id));

      setProfile(profileData);
      setLinks(linksData || []);
      setTotalViews(views || 0);
      setTotalClicks(clicks || 0);
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

  const completionItems = [
    { label: 'Add logo', done: !!profile?.logo_url },
    { label: 'Write bio', done: !!profile?.bio },
    { label: 'Add WhatsApp link', done: links.some(l => l.type === 'whatsapp') },
    { label: 'Add at least 3 links', done: links.length >= 3 },
  ];
  const completionCount = completionItems.filter(i => i.done).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-medium mb-1">Dashboard</h1>
        <p className="text-sm text-muted">
          Welcome back{profile?.business_name ? `, ${profile.business_name}` : ''}
        </p>
      </div>

      {/* Your Rooted link */}
      {profile?.username ? (
        <Card className="mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="bg-white p-2 rounded-xl border border-border">
              <QRCodeSVG value={profileUrl || ''} size={80} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium mb-1">Your Rooted link</p>
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
            <Link href="/dashboard/settings" className="text-primary font-medium underline">
              Settings
            </Link>{" "}
            to get your public link.
          </p>
        </Card>
      )}

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{totalViews}</p>
              <p className="text-xs text-muted">Total views</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
              <MousePointerClick className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{totalClicks}</p>
              <p className="text-xs text-muted">Link clicks</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Profile completion */}
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Profile completion</h3>
          <span className="text-sm text-muted">{completionCount}/{completionItems.length}</span>
        </div>
        <div className="space-y-3">
          {completionItems.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${item.done ? 'bg-accent text-primary' : 'bg-border'}`}>
                {item.done && <Check className="w-3 h-3" />}
              </div>
              <span className={`text-sm ${item.done ? 'text-muted line-through' : 'text-primary'}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Preview button */}
      {profile?.username && (
        <Button
          variant="secondary"
          onClick={() => window.open(`/${profile.username}`, '_blank')}
        >
          Preview your page
        </Button>
      )}
    </div>
  );
}
