import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { Link as LinkType, Theme, ButtonStyle, Font } from '@/lib/types';
import { LinkItem } from '@/components/LinkItem';

interface Props {
  params: Promise<{ username: string }>;
}

const themeStyles: Record<Theme, { bg: string; text: string; card: string; muted: string }> = {
  classic: { bg: '#F7F6F2', text: '#1A1A1A', card: '#FFFFFF', muted: '#6B6B6B' },
  dark: { bg: '#1A1A1A', text: '#FFFFFF', card: '#2A2A2A', muted: '#999999' },
  warm: { bg: '#FDF6EC', text: '#1A1A1A', card: '#FFFFFF', muted: '#6B6B6B' },
  minimal: { bg: '#F7F6F2', text: '#1A1A1A', card: 'transparent', muted: '#6B6B6B' },
};

const buttonStyles: Record<ButtonStyle, string> = {
  filled: 'text-white hover:opacity-90',
  outline: 'border-2 bg-transparent hover:bg-black/5',
  soft: 'hover:opacity-80',
  shadow: 'text-white shadow-lg hover:shadow-xl',
};

const fontClasses: Record<Font, string> = {
  inter: 'font-sans',
  serif: 'font-serif',
  poppins: 'font-sans',
};

function getButtonClasses(style: ButtonStyle, bgColor: string): string {
  const base = buttonStyles[style];
  switch (style) {
    case 'filled':
      return `${base} text-white`;
    case 'outline':
      return `${base} border-current`;
    case 'soft':
      return `${base} bg-current/10`;
    case 'shadow':
      return `${base} bg-current shadow-lg`;
    default:
      return base;
  }
}

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { username } = await params;
    const supabase = await createClient();
    const { data: profile } = await supabase
      .from('profiles')
      .select('business_name, tagline, bio, logo_url, username')
      .eq('username', username)
      .maybeSingle();

    if (!profile) return { title: 'Not Found — Rooted' };

    const title = profile.tagline
      ? `${profile.business_name} — ${profile.tagline}`
      : `${profile.business_name} | Rooted`;

    return {
      title,
      description: profile.bio || `Visit ${profile.business_name} on Rooted.`,
      openGraph: {
        title: profile.business_name,
        description: profile.bio || undefined,
        url: `https://rooted.sbs/${profile.username}`,
        images: profile.logo_url ? [{ url: profile.logo_url, width: 400, height: 400 }] : [],
        type: 'profile',
      },
      twitter: {
        card: 'summary',
        title: profile.business_name,
        description: profile.bio || undefined,
      },
    };
  } catch {
    return { title: 'Rooted' };
  }
}

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: redirectData } = await supabase
    .from('username_redirects')
    .select('new_username')
    .eq('old_username', username)
    .maybeSingle();

  if (redirectData) {
    const targetUsername = redirectData.new_username;
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-2">This page has moved.</p>
          <p className="text-sm text-gray-500">
            Redirecting to <a href={`/${targetUsername}`} className="underline font-medium">/{targetUsername}</a>...
          </p>
          <meta httpEquiv="refresh" content={`0;url=/${targetUsername}`} />
        </div>
      </div>
    );
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .maybeSingle();

  if (!profile) notFound();

  const { data: links } = await supabase
    .from('links')
    .select('*')
    .eq('profile_id', profile.id)
    .order('position', { ascending: true });

  const theme = (profile.theme as Theme) || 'classic';
  const buttonStyle = (profile.button_style as ButtonStyle) || 'filled';
  const font = (profile.font as Font) || 'inter';
  const themeStyle = themeStyles[theme] || themeStyles.classic;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: profile.business_name,
    description: profile.bio || undefined,
    url: `https://rooted.sbs/${profile.username}`,
    image: profile.logo_url || undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div
        className={`min-h-screen flex flex-col items-center px-4 py-12 ${fontClasses[font] || 'font-sans'}`}
        style={{ backgroundColor: themeStyle.bg, color: themeStyle.text }}
      >
        <div className="w-full max-w-md">
          {profile.cover_url && (
            <div className="w-full h-40 rounded-2xl overflow-hidden mb-6">
              <img
                src={profile.cover_url}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="text-center mb-8">
            {profile.logo_url && (
              <img
                src={profile.logo_url}
                alt={profile.business_name}
                className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-2"
                style={{ borderColor: themeStyle.card }}
              />
            )}
            <h1 className="text-2xl font-bold mb-1">{profile.business_name}</h1>
            {profile.tagline && (
              <p className="text-sm" style={{ color: themeStyle.muted }}>
                {profile.tagline}
              </p>
            )}
            {profile.bio && (
              <p className="text-sm mt-2 max-w-xs mx-auto" style={{ color: themeStyle.muted }}>
                {profile.bio}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {(links || []).map((link: LinkType) => (
              <LinkItem
                key={link.id}
                link={link}
                buttonStyle={getButtonClasses(buttonStyle, themeStyle.text)}
                iconColor={themeStyle.text}
              />
            ))}
          </div>

          {(links || []).length === 0 && (
            <p className="text-center text-sm py-8" style={{ color: themeStyle.muted }}>
              No links yet.
            </p>
          )}

          <div className="text-center mt-12">
            <a
              href="/"
              className="text-xs inline-flex items-center gap-1.5 opacity-40 hover:opacity-70 transition-opacity"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" />
                <path d="M12 8v4l3 3" />
              </svg>
              Made with Rooted
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
