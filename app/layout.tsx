import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

const businessInfo = {
  name: 'Domestic and Foreign Auto Body Inc.',
  phone: '+12164818696',
  phoneDisplay: '(216) 481-8696',
  address: '17017 Saint Clair Ave, Cleveland, OH 44110',
  email: 'domesticbody@gmail.com',
  hours: 'Mon-Fri: 8:00 AM - 4:30 PM, Sat: 9:00 AM - 1:00 PM',
  logo: 'https://www.genspark.ai/api/files/s/JA8Y2iRU',
  siteUrl: 'https://clevelandbody.com',
}

export const metadata: Metadata = {
  metadataBase: new URL(businessInfo.siteUrl),
  title: {
    default: 'Domestic and Foreign Auto Body Inc. | Cleveland Auto Body & Collision Repair',
    template: '%s | Domestic and Foreign Auto Body Inc.',
  },
  description: 'Expert auto body repair, collision repair, and custom painting in Cleveland, OH. Over 40 years of experience. Major & minor collision repair, complete paint & touch-ups. Free estimates. Call (216) 481-8696.',
  keywords: [
    'auto body repair Cleveland',
    'collision center Cleveland',
    'car repair Cleveland OH',
    'auto paint Cleveland',
    'body shop Cleveland',
    'collision repair near me',
    'dent repair Cleveland',
    'paintless dent repair',
    'frame alignment Cleveland',
    'bumper repair Cleveland',
    'auto glass repair',
    'insurance claims Cleveland',
    'tow service Cleveland',
    'Saint Clair Ave auto body',
    '44110 auto repair',
  ],
  authors: [{ name: 'Domestic and Foreign Auto Body Inc.' }],
  creator: 'Domestic and Foreign Auto Body Inc.',
  publisher: 'Domestic and Foreign Auto Body Inc.',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: businessInfo.siteUrl,
    siteName: businessInfo.name,
    title: 'Domestic and Foreign Auto Body Inc. | Cleveland Auto Body & Collision Repair',
    description: 'Expert auto body repair, collision repair, and custom painting in Cleveland, OH. Over 40 years of experience. Free estimates.',
    images: [
      {
        url: businessInfo.logo,
        width: 1200,
        height: 630,
        alt: 'Domestic and Foreign Auto Body Inc. Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Domestic and Foreign Auto Body Inc. | Cleveland Auto Body Repair',
    description: 'Expert auto body repair in Cleveland, OH. Over 40 years of experience. Free estimates.',
    images: [businessInfo.logo],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // JSON-LD Structured Data for LocalBusiness
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AutoRepair',
    '@id': businessInfo.siteUrl,
    name: businessInfo.name,
    image: businessInfo.logo,
    logo: businessInfo.logo,
    url: businessInfo.siteUrl,
    telephone: businessInfo.phone,
    email: businessInfo.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '17017 Saint Clair Ave',
      addressLocality: 'Cleveland',
      addressRegion: 'OH',
      postalCode: '44110',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 41.5912,
      longitude: -81.5529,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '16:30',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '09:00',
        closes: '13:00',
      },
    ],
    priceRange: '$$',
    paymentAccepted: ['Cash', 'Check', 'Credit Card', 'Insurance'],
    currenciesAccepted: 'USD',
    areaServed: {
      '@type': 'City',
      name: 'Cleveland',
      '@id': 'https://en.wikipedia.org/wiki/Cleveland',
    },
    description: 'Expert auto body repair, collision repair, and custom painting in Cleveland, OH. Expert Auto Body, Custom Painting, Restoration & Collision Repair in Cleveland',
    slogan: 'Building Our Future On Service To You!',
    foundingDate: '1982',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '150',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Auto Body Repair Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Collision Repair',
            description: 'Complete collision repair services for major and minor accidents',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Paintless Dent Repair',
            description: 'Expert dent removal without repainting',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Paint & Refinishing',
            description: 'Professional automotive painting and refinishing',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Frame Alignment',
            description: 'Precision frame straightening and alignment',
          },
        },
      ],
    },
  }

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}