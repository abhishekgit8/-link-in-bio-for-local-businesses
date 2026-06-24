'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { QRCodeSVG } from 'qrcode.react';
import { PageLoader } from '@/components/ui/PageLoader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Download, Printer, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function QRCodePage() {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .maybeSingle();

      if (data) setUsername(data.username);
      setLoading(false);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const profileUrl = username ? `https://rooted.sbs/${username}` : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    toast.success('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      }

      const link = document.createElement('a');
      link.download = `rooted-qr-${username}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow || !qrRef.current) return;

    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Rooted QR Code - ${username}</title>
          <style>
            body {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              font-family: system-ui, sans-serif;
            }
            .qr-container {
              text-align: center;
              padding: 40px;
            }
            svg {
              width: 300px;
              height: 300px;
            }
            h2 { margin-top: 20px; color: #1A1A1A; }
            p { color: #666; margin: 5px 0; }
            @media print {
              body { padding: 20mm; }
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            ${svgData}
            <h2>${username}</h2>
            <p>rooted.sbs/${username}</p>
          </div>
          <script>window.onload=function(){window.print();}<\/script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (loading) return <PageLoader />;

  if (!username) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-medium mb-1">QR Code</h1>
        <Card>
          <div className="text-center py-8">
            <p className="text-sm text-muted">Unable to load your profile.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-medium mb-1">QR Code</h1>
        <p className="text-sm text-muted">
          Print this QR code and place it at your store counter or window.
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <Card className="text-center">
          <div ref={qrRef} className="inline-block p-6 bg-white rounded-2xl mb-6">
            <QRCodeSVG
              value={profileUrl}
              size={200}
              level="H"
              includeMargin
              bgColor="#ffffff"
              fgColor="#1A1A1A"
            />
          </div>

          <h2 className="font-medium text-lg mb-1">Your QR Code</h2>
          <p className="text-sm text-muted mb-6">
            Scan to visit <span className="font-medium text-primary">{profileUrl}</span>
          </p>

          <div className="flex flex-col gap-3">
            <Button onClick={handleCopy} variant="secondary">
              {copied ? (
                <><Check className="w-4 h-4 mr-2" /> Copied!</>
              ) : (
                <><Copy className="w-4 h-4 mr-2" /> Copy Link</>
              )}
            </Button>
            <Button onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" /> Download PNG
            </Button>
            <Button onClick={handlePrint} variant="secondary">
              <Printer className="w-4 h-4 mr-2" /> Print QR Code
            </Button>
          </div>
        </Card>

        <p className="text-xs text-muted text-center mt-4">
          Tip: Print this on a sticker and place it near your checkout counter
          or entrance for easy scanning.
        </p>
      </div>
    </div>
  );
}
