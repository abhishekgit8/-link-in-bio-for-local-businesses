import type { Metadata } from "next";
import { Inter, Instrument_Serif, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-serif",
  display: "swap",
  preload: true,
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rooted.sbs"),
  title: {
    default: "Rooted — One link for your local business",
    template: "%s | Rooted",
  },
  description:
    "Create a stunning link-in-bio page for your salon, cafe, or freelance business. Share your services, WhatsApp, location and more — all in one link.",
  keywords: [
    "link in bio india",
    "local business website",
    "small business online presence",
    "whatsapp business page",
    "salon website india",
    "freelancer portfolio link",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://rooted.sbs",
    siteName: "Rooted",
    title: "Rooted — One link for your local business",
    description:
      "Create a stunning link-in-bio page for your salon, cafe, or freelance business.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Rooted — Your business, one link.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@rootedsbs",
    title: "Rooted — One link for your local business",
    description:
      "Create a stunning link-in-bio page for your salon, cafe, or freelance business.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  alternates: {
    canonical: "https://rooted.sbs",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans bg-surface text-primary">
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#1A1A1A",
              color: "#fff",
              borderRadius: "12px",
              fontSize: "14px",
            },
          }}
        />
      </body>
    </html>
  );
}
