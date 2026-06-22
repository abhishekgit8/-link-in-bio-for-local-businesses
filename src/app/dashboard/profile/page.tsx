'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { PageLoader } from '@/components/ui/PageLoader';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ProfilePreview } from '@/components/ProfilePreview';
import toast from 'react-hot-toast';
import type { Profile, Link as LinkType } from '@/lib/types';

export default function ProfileEditorPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<LinkType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({
        business_name: profile.business_name,
        tagline: profile.tagline,
        bio: profile.bio,
      })
      .eq('id', profile.id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Profile saved!');
    }
    setSaving(false);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${profile.id}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('logos')
      .upload(fileName, file);

    if (uploadError) {
      toast.error(uploadError.message);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('logos')
      .getPublicUrl(fileName);

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ logo_url: publicUrl })
      .eq('id', profile.id);

    if (updateError) {
      toast.error(updateError.message);
      return;
    }

    setProfile({ ...profile, logo_url: publicUrl });
    toast.success('Logo uploaded!');
  };

  if (loading) return <PageLoader />;

  if (!profile) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-medium mb-1">Edit Profile</h1>
          <p className="text-sm text-muted">Update how your business appears on your public page.</p>
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
          <h1 className="text-2xl font-medium mb-1">Edit Profile</h1>
          <p className="text-sm text-muted">
            Update how your business appears on your public page.
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
        {/* Editor */}
        <div className="lg:col-span-3 space-y-6">
          {/* Logo */}
          <Card>
            <h3 className="font-medium mb-4">Logo</h3>
            <div className="flex items-center gap-4">
              {profile.logo_url ? (
                <img
                  src={profile.logo_url}
                  alt="Logo"
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-border flex items-center justify-center text-lg text-muted">
                  {profile.business_name?.charAt(0) || '?'}
                </div>
              )}
              <label>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
                <span className="cursor-pointer text-sm font-medium text-primary hover:underline">
                  Upload logo
                </span>
              </label>
            </div>
          </Card>

          {/* Business info */}
          <Card className="space-y-4">
            <h3 className="font-medium">Business Information</h3>
            <Input
              label="Business name"
              value={profile.business_name}
              onChange={(e) =>
                setProfile({ ...profile, business_name: e.target.value })
              }
            />
            <Input
              label="Tagline"
              placeholder="e.g. Bridal • Facials • Hair"
              value={profile.tagline || ''}
              onChange={(e) =>
                setProfile({ ...profile, tagline: e.target.value })
              }
              helperText="A short phrase that describes your business"
            />
            <div className="w-full">
              <label className="block text-sm font-medium text-primary mb-1.5">
                Bio
              </label>
              <textarea
                className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-sm text-primary placeholder:text-muted/60 outline-none focus:ring-2 focus:ring-accent focus:border-accent resize-none"
                rows={3}
                maxLength={150}
                placeholder="Tell visitors about your business..."
                value={profile.bio || ''}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
              />
              <p className="text-xs text-muted mt-1 text-right">
                {(profile.bio || '').length}/150
              </p>
            </div>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave} loading={saving}>
              Save changes
            </Button>
          </div>
        </div>

        {/* Live preview - desktop */}
        <div className="hidden lg:block lg:col-span-2">
          <div className="sticky top-8">
            <p className="text-sm font-medium text-muted mb-4 text-center">
              Preview
            </p>
            <ProfilePreview profile={profile} links={links} />
          </div>
        </div>
      </div>

      {/* Mobile preview overlay */}
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
