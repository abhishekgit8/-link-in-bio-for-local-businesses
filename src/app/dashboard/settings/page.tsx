'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { PageLoader } from '@/components/ui/PageLoader';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AlertTriangle, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import type { Profile } from '@/lib/types';

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      setEmail(user.email || '');

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setProfile(data);
        setUsername(data.username || '');
      }
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    if (!username || username === profile?.username) {
      return;
    }

    const timer = setTimeout(async () => {
      setCheckingUsername(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .maybeSingle();

      setUsernameAvailable(error ? null : !data);
      setCheckingUsername(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [username, profile?.username]);

  const updateUsername = async () => {
    if (!profile || !username.trim()) return;
    setSaving(true);

    // Insert redirect for old username
    if (profile.username && profile.username !== username.trim().toLowerCase()) {
      await supabase.from('username_redirects').insert({
        old_username: profile.username,
        new_username: username.trim().toLowerCase(),
      });
    }

    const { error } = await supabase
      .from('profiles')
      .update({ username: username.trim().toLowerCase() })
      .eq('id', profile.id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Username updated!');
      setProfile({ ...profile, username: username.trim().toLowerCase() });
    }
    setSaving(false);
  };

  const updateEmail = async () => {
    const { error } = await supabase.auth.updateUser({ email });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Check your new email for confirmation.');
    }
  };

  const cancelSubscription = async () => {
    const res = await fetch('/api/razorpay/cancel', { method: 'POST' });
    const data = await res.json();

    if (data.success) {
      toast.success('Subscription will cancel at end of billing period.');
      setProfile({ ...profile!, subscription_status: 'cancelling' });
    } else {
      toast.error(data.error || 'Failed to cancel subscription');
    }
  };

  const deleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') {
      toast.error('Type DELETE to confirm');
      return;
    }

    const { error } = await supabase.rpc('delete_user');
    if (error) {
      toast.error(error.message);
      return;
    }

    await supabase.auth.signOut();
    router.push('/');
    toast.success('Account deleted.');
  };

  if (loading) return <PageLoader />;

  if (!profile) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-medium mb-1">Settings</h1>
          <p className="text-sm text-muted">Manage your account and subscription.</p>
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
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-medium mb-1">Settings</h1>
        <p className="text-sm text-muted">Manage your account and subscription.</p>
      </div>

      <div className="space-y-6">
        {/* Username */}
        <Card className="space-y-4">
          <h3 className="font-medium">Change Username</h3>
          <p className="text-xs text-muted">
            Your public profile URL: rooted.sbs/
            {username || 'your-name'}
          </p>
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder="your-business"
              />
              {username !== profile.username && username.trim() && (
                <div className="flex items-center gap-1 mt-1">
                  {checkingUsername ? (
                    <span className="text-xs text-muted">Checking...</span>
                  ) : usernameAvailable === true ? (
                    <>
                      <Check className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-green-600">Available</span>
                    </>
                  ) : usernameAvailable === false ? (
                    <span className="text-xs text-red-500">Username taken</span>
                  ) : null}
                </div>
              )}
            </div>
            <Button
              size="sm"
              onClick={updateUsername}
              disabled={!username.trim() || usernameAvailable === false}
              loading={saving}
              className="mt-0.5"
            >
              Save
            </Button>
          </div>
        </Card>

        {/* Email */}
        <Card className="space-y-4">
          <h3 className="font-medium">Email Address</h3>
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
              />
            </div>
            <Button size="sm" onClick={updateEmail} className="mt-0.5">
              Update
            </Button>
          </div>
        </Card>

        {/* Category */}
        <Card className="space-y-4">
          <h3 className="font-medium">Category</h3>
          <select
            value={profile.category || ''}
            onChange={async (e) => {
              const val = e.target.value;
              const { error } = await supabase
                .from('profiles')
                .update({ category: val || null })
                .eq('id', profile.id);
              if (!error) setProfile({ ...profile, category: val as Profile['category'] });
            }}
            className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-sm text-primary outline-none focus:ring-2 focus:ring-accent focus:border-accent appearance-none cursor-pointer"
          >
            <option value="">Select a category</option>
            <option value="salon">Salon / Spa</option>
            <option value="cafe">Cafe / Restaurant</option>
            <option value="tutor">Tutor / Teacher</option>
            <option value="freelancer">Freelancer</option>
            <option value="coach">Coach / Consultant</option>
            <option value="photographer">Photographer</option>
            <option value="other">Other</option>
          </select>
        </Card>

        {/* Subscription */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-medium">Subscription</h3>
              <p className="text-xs text-muted mt-0.5">
                You are on the{" "}
                <Badge variant={profile.subscription_tier === 'pro' ? 'pro' : 'free'}>
                  {profile.subscription_tier === 'pro' ? 'Pro' : 'Free'}
                </Badge>{" "}
                plan
              </p>
            </div>
            {profile.subscription_tier !== 'pro' && (
              <Link href="/pricing">
                <Button size="sm">Upgrade to Pro</Button>
              </Link>
            )}
          </div>
          {profile.subscription_tier === 'pro' && (
            <div className="space-y-3">
              <p className="text-xs text-muted">
                You have access to all Pro features.
                {profile.subscription_end_date && (
                  <> Next billing date: {new Date(profile.subscription_end_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</>
                )}
              </p>
              {profile.subscription_status === 'cancelling' ? (
                <p className="text-xs text-amber-600">
                  Your subscription will cancel at the end of the billing period.
                </p>
              ) : (
                <Button variant="ghost" size="sm" onClick={cancelSubscription}>
                  Cancel subscription
                </Button>
              )}
            </div>
          )}
        </Card>

        {/* Danger zone */}
        <Card className="border-red-200">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <h3 className="font-medium text-red-600">Danger Zone</h3>
          </div>
          <p className="text-xs text-muted mb-4">
            Permanently delete your account and all data. This action cannot be undone.
          </p>
          <div className="flex items-end gap-2">
            <Input
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder='Type "DELETE" to confirm'
              className="flex-1"
            />
            <Button
              variant="danger"
              size="sm"
              onClick={deleteAccount}
              disabled={deleteConfirm !== 'DELETE'}
            >
              Delete account
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
