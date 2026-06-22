import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import type { Link as LinkType, Theme, ButtonStyle, Font } from '@/lib/types';

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
  filled:
    'bg-primary text-white hover:opacity-90 active:scale-[0.98] transition-all duration-200',
  outline:
    'border-2 border-primary text-primary bg-transparent hover:bg-primary/5 active:scale-[0.98] transition-all duration-200',
  soft:
    'bg-primary/10 text-primary hover:bg-primary/15 active:scale-[0.98] transition-all duration-200',
  shadow:
    'bg-primary text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/20 active:scale-[0.98] transition-all duration-200',
};

const fontClasses: Record<Font, string> = {
  inter: 'font-sans',
  serif: 'font-serif',
  poppins: 'font-sans',
};

const linkIcons: Record<string, string> = {
  instagram: 'M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m-.1 1.5a3 3 0 1 1 0 6 3 3 0 0 1 0-6m6.7 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3M12 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4',
  maps: 'M12 2a8 8 0 0 0-8 8c0 5 8 12 8 12s8-7 8-12a8 8 0 0 0-8-8m0 10.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5',
  phone: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92',
  email: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2m16 4-8 5-8-5',
  whatsapp: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413',
};

function getLinkIcon(type: string) {
  const path = linkIcons[type] || 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71';
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={path} />
    </svg>
  );
}

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
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
    description:
      profile.bio || `Visit ${profile.business_name} on Rooted. Find their links, WhatsApp, location and more.`,
    openGraph: {
      title: profile.business_name,
      description: profile.bio || undefined,
      url: `https://rooted.sbs/${profile.username}`,
      images: profile.logo_url
        ? [{ url: profile.logo_url, width: 400, height: 400 }]
        : [{ url: '/default-og.png', width: 1200, height: 630 }],
      type: 'profile',
    },
    twitter: {
      card: 'summary',
      title: profile.business_name,
      description: profile.bio || undefined,
      images: profile.logo_url ? [profile.logo_url] : ['/default-og.png'],
    },
    alternates: {
      canonical: `https://rooted.sbs/${profile.username}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params;
  const supabase = await createClient();

  // Check for username redirects
  const { data: redirectData } = await supabase
    .from('username_redirects')
    .select('new_username')
    .eq('old_username', username.toLowerCase())
    .maybeSingle();

  if (redirectData) {
    redirect(`/${redirectData.new_username}`);
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
    .eq('is_active', true)
    .order('position');

  const safeLinks = links || [];
  const theme = (profile.theme || 'classic') as Theme;
  const buttonStyle = (profile.button_style || 'filled') as ButtonStyle;
  const font = (profile.font || 'inter') as Font;
  const styles = themeStyles[theme];

  // Server-side page view tracking
  await supabase.from('page_views').insert({ profile_id: profile.id });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: profile.business_name,
    description: profile.bio || undefined,
    url: `https://rooted.sbs/${profile.username}`,
    logo: profile.logo_url || undefined,
    telephone: safeLinks.find((l: LinkType) => l.type === 'phone')?.url?.replace('tel:', '') || undefined,
    email: safeLinks.find((l: LinkType) => l.type === 'email')?.url?.replace('mailto:', '') || undefined,
    sameAs: [
      safeLinks.find((l: LinkType) => l.type === 'instagram')?.url,
    ].filter(Boolean),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
        style={{ backgroundColor: styles.bg, color: styles.text }}
      >
        <div
          className="w-full max-w-sm mx-auto flex flex-col items-center text-center"
          style={
            theme !== 'minimal'
              ? {
                  backgroundColor: styles.card,
                  borderRadius: '24px',
                  padding: '32px',
                  boxShadow:
                    '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
                }
              : {}
          }
        >
          {/* Logo */}
          <div className="w-20 h-20 mb-4" style={{ aspectRatio: '1 / 1' }}>
            {profile.logo_url ? (
              <Image
                src={profile.logo_url}
                alt={profile.business_name}
                width={80}
                height={80}
                priority
                className="rounded-full object-cover border-2"
                style={{ borderColor: styles.muted + '30' }}
              />
            ) : (
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-medium"
                style={{
                  backgroundColor: styles.text + '12',
                  color: styles.text,
                }}
              >
                {profile.business_name?.charAt(0) || '?'}
              </div>
            )}
          </div>

          {/* Name */}
          <h1
            className={
              'text-xl font-medium mb-1 ' + fontClasses[font]
            }
            style={
              font === 'serif'
                ? { fontFamily: 'Instrument Serif, serif', fontSize: '1.5rem' }
                : undefined
            }
          >
            {profile.business_name}
          </h1>

          {/* Tagline */}
          {profile.tagline && (
            <p className="text-sm mb-2" style={{ color: styles.muted }}>
              {profile.tagline}
            </p>
          )}

          {/* Bio */}
          {profile.bio && (
            <p
              className="text-sm leading-relaxed mb-6 max-w-[260px]"
              style={{ color: styles.muted }}
            >
              {profile.bio}
            </p>
          )}

          {/* Links — pure HTML/CSS, JS only for click tracking */}
          <div className="w-full space-y-3">
            {safeLinks.map((link: LinkType) => {
              const isWhatsApp = link.type === 'whatsapp';
              const btnClass =
                buttonStyles[buttonStyle] +
                (isWhatsApp && buttonStyle === 'filled'
                  ? ' !bg-[#25D366] !text-white hover:!bg-[#20BD5A] !shadow-lg !shadow-[#25D366]/20'
                  : '') +
                ' w-full py-3 px-5 rounded-xl text-sm font-medium inline-flex items-center justify-center gap-2.5';

              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={btnClass}
                  data-link-id={link.id}
                  onClick={async (e) => {
                    e.preventDefault();
                    // Fire and forget click tracking
                    fetch('/api/track-click', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ linkId: link.id }),
                    }).catch(() => {});
                    window.location.href = link.url;
                  }}
                >
                  <span className="shrink-0">{getLinkIcon(link.type)}</span>
                  <span>{link.label}</span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-auto shrink-0"
                    style={{ opacity: 0.5 }}
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              );
            })}
          </div>

          {/* No links state */}
          {safeLinks.length === 0 && (
            <div
              className="w-full py-8 text-sm"
              style={{ color: styles.muted }}
            >
              No links yet
            </div>
          )}
        </div>

        {/* Footer badge — dofollow backlink (viral SEO loop) */}
        <a
          href="https://rooted.sbs"
          rel="dofollow"
          className="mt-8 text-xs transition-opacity hover:opacity-80"
          style={{ color: styles.muted + '80' }}
        >
          Made with Rooted
        </a>
      </div>
    </>
  );
}
