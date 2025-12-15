import type { Metadata } from "next";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.ietires.com'),
  title: {
    default: "Import Export Tire | Wholesale Tire Distribution Since 1972",
    template: "%s | Import Export Tire",
  },
  description: "Western Pennsylvania's trusted wholesale tire distributor. Competitive B2B pricing on Falken, Kenda, Atturo, Milestar, Lionhart and more. Over 100,000 tires in stock. Serving retailers since 1972.",
  keywords: [
    "wholesale tires",
    "tire distribution",
    "B2B tires",
    "Falken tires",
    "Kenda tires",
    "Atturo tires",
    "Milestar tires",
    "Lionhart tires",
    "Pennsylvania tire distributor",
    "wholesale tire warehouse",
    "tire wholesaler near me",
    "Latrobe PA tires",
    "Uniontown PA tires",
  ],
  authors: [{ name: "Import Export Tire" }],
  creator: "Import Export Tire",
  publisher: "Import Export Tire",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/favicon.svg',
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.ietires.com",
    siteName: "Import Export Tire",
    title: "Import Export Tire | Wholesale Tire Distribution Since 1972",
    description: "Western Pennsylvania's trusted wholesale tire distributor. Over 100,000 tires in stock, competitive B2B pricing, same-day shipping.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Import Export Tire - Wholesale Tire Distribution",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Import Export Tire | Wholesale Tire Distribution",
    description: "Western Pennsylvania's trusted wholesale tire distributor since 1972.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
  alternates: {
    canonical: "https://www.ietires.com",
  },
  category: "business",
};

// JSON-LD structured data for local business
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://www.ietires.com",
  name: "Import Export Tire",
  alternateName: "IE Tire",
  description: "Western Pennsylvania's trusted wholesale tire distributor since 1972. Over 100,000 tires in stock with competitive B2B pricing.",
  url: "https://www.ietires.com",
  telephone: "+1-724-539-8705",
  email: "sales@ietires.com",
  foundingDate: "1972",
  address: [
    {
      "@type": "PostalAddress",
      streetAddress: "410 Unity Street",
      addressLocality: "Latrobe",
      addressRegion: "PA",
      postalCode: "15650",
      addressCountry: "US",
    },
    {
      "@type": "PostalAddress",
      streetAddress: "350 Pittsburgh Street",
      addressLocality: "Uniontown",
      addressRegion: "PA",
      postalCode: "15401",
      addressCountry: "US",
    },
  ],
  geo: {
    "@type": "GeoCoordinates",
    latitude: 40.2884,
    longitude: -79.3817,
  },
  areaServed: {
    "@type": "State",
    name: "Pennsylvania",
  },
  priceRange: "$$",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "17:00",
    },
  ],
  sameAs: [],
  image: "https://www.ietires.com/images/og-image.jpg",
  logo: "https://www.ietires.com/favicon.svg",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Wholesale Tires",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Product",
          name: "Falken Tires",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Product",
          name: "Kenda Tires",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Product",
          name: "Atturo Tires",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Product",
          name: "Milestar Tires",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Product",
          name: "Lionhart Tires",
        },
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-dark-950 text-white antialiased">
        <ConvexClientProvider>
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
