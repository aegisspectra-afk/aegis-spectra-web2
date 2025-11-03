import { Metadata } from 'next';

// Advanced Schema Markup for better SEO
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Aegis Spectra Security",
  "alternateName": "אגיס ספקטרה אבטחה",
  "url": "https://aegisspectra.co.il",
  "logo": "https://aegisspectra.co.il/logo.png",
  "description": "התקנת מצלמות אבטחה, קודנים ואזעקות לבית ולעסק. אפליקציה בעברית, אחריות 12 חודשים, שירות באזור המרכז.",
  "foundingDate": "2020",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "IL",
    "addressRegion": "מרכז",
    "addressLocality": "חולון"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+972-55-973-7025",
    "contactType": "customer service",
    "availableLanguage": ["Hebrew", "English"],
    "areaServed": "IL"
  },
  "sameAs": [
    "https://wa.me/972559737025",
    "https://www.facebook.com/aegisspectra",
    "https://www.instagram.com/aegisspectra"
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "שירותי אבטחה",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "התקנת מצלמות אבטחה",
          "description": "התקנה מקצועית של מצלמות IP עם רזולוציה גבוהה"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "מערכות קודנים",
          "description": "קודנים מגנטיים ומערכות בקרת כניסה"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "מערכות אזעקה",
          "description": "אזעקות אלחוטיות עם חיישני תנועה"
        }
      }
    ]
  }
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Aegis Spectra Security",
  "url": "https://aegisspectra.co.il",
  "description": "התקנת מצלמות אבטחה, קודנים ואזעקות לבית ולעסק",
  "inLanguage": "he-IL",
  "isAccessibleForFree": true,
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://aegisspectra.co.il/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "התקנת מערכות אבטחה",
  "description": "התקנה מקצועית של מצלמות אבטחה, מערכות קודנים ואזעקות",
  "provider": {
    "@type": "Organization",
    "name": "Aegis Spectra Security"
  },
  "areaServed": {
    "@type": "Country",
    "name": "Israel"
  },
  "serviceType": "Security Installation",
  "category": "Security Services",
  "offers": [
    {
      "@type": "Offer",
      "name": "Home Cam Package",
      "price": "1990",
      "priceCurrency": "ILS",
      "description": "חבילת מצלמות בסיסית לבית - 2 מצלמות + NVR"
    },
    {
      "@type": "Offer",
      "name": "Business Cam Package",
      "price": "3490",
      "priceCurrency": "ILS",
      "description": "חבילת מצלמות מתקדמת לעסק - 4 מצלמות + NVR"
    },
    {
      "@type": "Offer",
      "name": "Secure Entry Package",
      "price": "2290",
      "priceCurrency": "ILS",
      "description": "מערכת כניסה מאובטחת עם קודן RFID"
    },
    {
      "@type": "Offer",
      "name": "Alarm Basic Package",
      "price": "2490",
      "priceCurrency": "ILS",
      "description": "מערכת אזעקה אלחוטית בסיסית"
    }
  ]
};

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "כמה זמן לוקחת התקנה?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "לרוב 3–6 שעות ל-2–4 מצלמות."
      }
    },
    {
      "@type": "Question",
      "name": "אפליקציה בעברית?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "כן, כוללת הדרכה והגדרות לנייד."
      }
    },
    {
      "@type": "Question",
      "name": "מה כוללת האחריות?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "12 חודשי חלקים ועבודה (נזקי כוח עליון/ונדליזם—לא כלול)."
      }
    },
    {
      "@type": "Question",
      "name": "תשלומים?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "אפשר אשראי/העברה/מזומן; פריסת תשלומים בתיאום."
      }
    },
    {
      "@type": "Question",
      "name": "האם ניתן להרחיב?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "כן, ניתן להוסיף נקודות/שדרוגים בכל זמן."
      }
    },
    {
      "@type": "Question",
      "name": "מה קורה אם יש בעיה טכנית?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "מענה מהיר בימים א׳–ה׳ 09:00–18:00, ובמקרים דחופים—לפי זמינות."
      }
    }
  ]
};

export const breadcrumbSchema = (items: Array<{name: string, url: string}>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

export const productSchema = (product: {
  name: string;
  description: string;
  price: number;
  image?: string;
  availability?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": product.name,
  "description": product.description,
  "image": product.image,
  "offers": {
    "@type": "Offer",
    "price": product.price,
    "priceCurrency": "ILS",
    "availability": product.availability || "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "Aegis Spectra Security"
    }
  }
});

export const reviewSchema = (reviews: Array<{
  author: string;
  rating: number;
  reviewBody: string;
  datePublished: string;
}>) => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Aegis Spectra Security",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": reviews.length
  },
  "review": reviews.map(review => ({
    "@type": "Review",
    "author": {
      "@type": "Person",
      "name": review.author
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": review.rating
    },
    "reviewBody": review.reviewBody,
    "datePublished": review.datePublished
  }))
});

// Advanced metadata generation
export function generateAdvancedMetadata({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  section,
  tags = []
}: {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url: string;
  type?: 'website' | 'article' | 'product' | 'service';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aegisspectra.co.il';
  const fullUrl = `${baseUrl}${url}`;
  const fullImage = image ? `${baseUrl}${image}` : `${baseUrl}/og-image.png`;

  return {
    title: `${title} | Aegis Spectra Security`,
    description,
    keywords: [
      'התקנת מצלמות',
      'מצלמות אבטחה',
      'קודנים',
      'אזעקות',
      'אבטחה',
      'התקנה',
      'Aegis Spectra',
      'מעקב',
      'ניהול מרחוק',
      ...keywords
    ],
    authors: author ? [{ name: author }] : [{ name: 'Aegis Spectra Security' }],
    creator: 'Aegis Spectra Security',
    publisher: 'Aegis Spectra Security',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    openGraph: {
      type: type === 'product' || type === 'service' ? 'website' : type,
      locale: 'he_IL',
      url: fullUrl,
      title,
      description,
      siteName: 'Aegis Spectra Security',
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(author && { authors: [author] }),
      ...(section && { section }),
      ...(tags.length > 0 && { tags }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [fullImage],
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
    alternates: {
      canonical: fullUrl,
    },
    other: {
      'mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'black-translucent',
      'apple-mobile-web-app-title': 'Aegis Spectra',
      'application-name': 'Aegis Spectra Security',
      'msapplication-TileColor': '#1A73E8',
      'theme-color': '#1A73E8',
    },
  };
}

// Generate sitemap data
export function generateSitemapData() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aegisspectra.co.il';
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/products/home-cam`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/products/business-cam`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/products/secure-entry`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/products/alarm-basic`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/solutions`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/certifications`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/demo-visit`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/areas`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/guides`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/store`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/builder`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];
}

// Blog post schema
export const blogPostSchema = (post: {
  title: string;
  description: string;
  author: string;
  publishedTime: string;
  modifiedTime: string;
  image?: string;
  url: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": post.title,
  "description": post.description,
  "author": {
    "@type": "Person",
    "name": post.author
  },
  "publisher": {
    "@type": "Organization",
    "name": "Aegis Spectra Security",
    "logo": {
      "@type": "ImageObject",
      "url": "https://aegisspectra.co.il/logo.png"
    }
  },
  "datePublished": post.publishedTime,
  "dateModified": post.modifiedTime,
  "image": post.image,
  "url": post.url,
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": post.url
  }
});

// How-to guide schema
export const howToGuideSchema = (guide: {
  name: string;
  description: string;
  steps: Array<{
    name: string;
    text: string;
    image?: string;
  }>;
  totalTime: string;
  difficulty: string;
  url: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": guide.name,
  "description": guide.description,
  "totalTime": guide.totalTime,
  "difficulty": guide.difficulty,
  "url": guide.url,
  "step": guide.steps.map((step, index) => ({
    "@type": "HowToStep",
    "position": index + 1,
    "name": step.name,
    "text": step.text,
    ...(step.image && { "image": step.image })
  }))
});

// FAQ schema for guides
export const guideFaqSchema = (faqs: Array<{
  question: string;
  answer: string;
}>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});
