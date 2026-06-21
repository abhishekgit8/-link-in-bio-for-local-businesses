'use client';

import type { Profile, Link as LinkType, Theme, ButtonStyle, Font } from '@/lib/types';
import { PhoneFrame } from '@/components/ui/PhoneFrame';
import { cn } from '@/lib/utils';
import { Instagram, MapPin, Phone, Mail, MessageCircle, Globe } from 'lucide-react';

interface ProfilePreviewProps {
  profile: Partial<Profile>;
  links: Partial<LinkType>[];
}

const themeStyles: Record<Theme, { bg: string; text: string; card: string; muted: string }> = {
  classic: { bg: '#FFFFFF', text: '#1A1A1A', card: '#FFFFFF', muted: '#6B6B6B' },
  dark: { bg: '#1A1A1A', text: '#FFFFFF', card: '#2A2A2A', muted: '#999999' },
  warm: { bg: '#FDF6EC', text: '#1A1A1A', card: '#FFFFFF', muted: '#6B6B6B' },
  minimal: { bg: '#F7F6F2', text: '#1A1A1A', card: 'transparent', muted: '#6B6B6B' },
};

const buttonStyles: Record<ButtonStyle, string> = {
  filled: 'bg-primary text-white',
  outline: 'border-2 border-primary text-primary bg-transparent',
  soft: 'bg-primary/10 text-primary',
  shadow: 'bg-primary text-white shadow-lg shadow-primary/20',
};

const fontClasses: Record<Font, string> = {
  inter: 'font-sans',
  serif: 'font-serif',
  poppins: 'font-sans',
};

function getLinkIcon(type: string) {
  switch (type) {
    case 'instagram': return <Instagram className="w-4 h-4" />;
    case 'maps': return <MapPin className="w-4 h-4" />;
    case 'phone': return <Phone className="w-4 h-4" />;
    case 'email': return <Mail className="w-4 h-4" />;
    case 'whatsapp': return <MessageCircle className="w-4 h-4" />;
    default: return <Globe className="w-4 h-4" />;
  }
}

export function ProfilePreview({ profile, links }: ProfilePreviewProps) {
  const theme = (profile.theme || 'classic') as Theme;
  const buttonStyle = (profile.button_style || 'filled') as ButtonStyle;
  const font = (profile.font || 'inter') as Font;
  const styles = themeStyles[theme];

  const activeLinks = links.filter((l) => l.is_active !== false);

  return (
    <PhoneFrame>
      <div
        className="flex flex-col items-center text-center py-4 px-2 min-h-full"
        style={{ backgroundColor: styles.bg, color: styles.text }}
      >
        {/* Logo */}
        {profile.logo_url ? (
          <img
            src={profile.logo_url}
            alt={profile.business_name || ''}
            className="w-16 h-16 rounded-full object-cover mb-3 border-2"
            style={{ borderColor: styles.muted + '40' }}
          />
        ) : profile.business_name ? (
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-medium mb-3"
            style={{ backgroundColor: styles.text + '15', color: styles.text }}
          >
            {profile.business_name.charAt(0)}
          </div>
        ) : (
          <div className="w-16 h-16 rounded-full bg-border flex items-center justify-center text-lg text-muted mb-3">
            ?
          </div>
        )}

        {/* Business name */}
        <h3
          className={cn('text-base font-medium', fontClasses[font])}
          style={{ fontFamily: font === 'serif' ? 'Instrument Serif, serif' : undefined }}
        >
          {profile.business_name || 'Your Business Name'}
        </h3>

        {/* Tagline */}
        {profile.tagline && (
          <p className="text-xs mt-1" style={{ color: styles.muted }}>
            {profile.tagline}
          </p>
        )}

        {/* Bio */}
        {profile.bio && (
          <p className="text-xs mt-2 max-w-[200px] leading-relaxed" style={{ color: styles.muted }}>
            {profile.bio}
          </p>
        )}

        {/* Links */}
        <div className="w-full mt-4 space-y-2">
          {activeLinks.map((link, i) => {
            const isWhatsApp = link.type === 'whatsapp';
            return (
              <a
                key={link.id || i}
                href={link.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'w-full py-2.5 px-4 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200',
                  buttonStyles[buttonStyle],
                  isWhatsApp && buttonStyle === 'filled'
                    ? '!bg-[#25D366] !text-white'
                    : ''
                )}
              >
                {getLinkIcon(link.type || 'url')}
                {link.label || 'Link'}
              </a>
            );
          })}
        </div>

        {/* Links placeholder */}
        {activeLinks.length === 0 && (
          <div className="w-full mt-4 space-y-2 opacity-30">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-full py-2.5 px-4 rounded-xl bg-primary/10 text-sm"
              >
                Add a link to get started
              </div>
            ))}
          </div>
        )}

        {/* Badge */}
        <p
          className="text-[10px] mt-4"
          style={{ color: styles.muted + '80' }}
        >
          Made with Rooted
        </p>
      </div>
    </PhoneFrame>
  );
}
