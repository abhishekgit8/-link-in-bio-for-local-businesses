export function generateVCard(profile: {
  business_name: string;
  tagline?: string | null;
  bio?: string | null;
  username: string;
}, phone?: string, email?: string, address?: string): string {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${profile.business_name}`,
    `NOTE:${profile.bio || profile.tagline || ''}`,
    `URL:https://rooted.sbs/${profile.username}`,
    'END:VCARD',
  ];

  if (phone) {
    lines.splice(3, 0, `TEL;TYPE=CELL:${phone}`);
  }
  if (email) {
    lines.splice(lines.length - 1, 0, `EMAIL:${email}`);
  }
  if (address) {
    lines.splice(lines.length - 1, 0, `ADR:;;${address};;;;`);
  }

  return lines.join('\r\n');
}

export function downloadVCard(filename: string, vcardData: string) {
  const blob = new Blob([vcardData], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.vcf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
