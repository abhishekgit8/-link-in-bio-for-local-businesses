'use client';

import { Download, MapPin } from 'lucide-react';
import { generateVCard, downloadVCard } from '@/lib/vcard';

interface VCardButtonProps {
  businessName: string;
  tagline?: string | null;
  bio?: string | null;
  username: string;
  phone?: string;
  email?: string;
  address?: string;
  themeStyle: { text: string; muted: string; card: string };
  buttonStyle: string;
}

export function VCardButton({
  businessName,
  tagline,
  bio,
  username,
  phone,
  email,
  address,
  themeStyle,
  buttonStyle,
}: VCardButtonProps) {
  const handleDownload = () => {
    const vcard = generateVCard(
      { business_name: businessName, tagline, bio, username },
      phone,
      email,
      address
    );
    downloadVCard(businessName.replace(/\s+/g, '-').toLowerCase(), vcard);
  };

  return (
    <button
      onClick={handleDownload}
      className={`flex items-center gap-3 w-full px-5 py-3.5 rounded-xl transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98] ${buttonStyle}`}
    >
      <Download size={16} />
      <span className="flex-1 text-left font-medium text-sm">Save Contact</span>
    </button>
  );
}

interface MapEmbedProps {
  mapsUrl: string;
}

export function MapEmbed({ mapsUrl }: MapEmbedProps) {
  let embedUrl = mapsUrl;

  if (mapsUrl.includes('maps.google.com')) {
    const queryMatch = mapsUrl.match(/[?&]q=([^&]+)/);
    if (queryMatch) {
      embedUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Tbyh9ZTFTdi6RAqGh8A24QXm7s8Po&q=${queryMatch[1]}`;
    }
  } else if (mapsUrl.includes('goo.gl') || mapsUrl.includes('maps.app.goo.gl')) {
    embedUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Tbyh9ZTFTdi6RAqGh8A24QXm7s8Po&q=${encodeURIComponent(mapsUrl)}`;
  }

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-gray-200 mt-4">
      <div className="bg-gray-100 p-3 flex items-center gap-2">
        <MapPin size={14} className="text-gray-600" />
        <span className="text-xs font-medium text-gray-600">Location</span>
      </div>
      <iframe
        src={embedUrl}
        width="100%"
        height="200"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="w-full"
      />
    </div>
  );
}
