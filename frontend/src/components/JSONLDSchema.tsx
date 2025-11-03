"use client";

import { useEffect } from "react";

export function JSONLDSchema() {
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Aegis Spectra Security",
      "alternateName": "Aegis Spectra",
      "url": "https://aegis-spectra.netlify.app",
      "logo": "https://aegis-spectra.netlify.app/logo.png",
      "description": "מיגון ואבטחה חכמה לבית ולעסק – מצלמות AI, אזעקות, בקרת כניסה ותמיכה בעברית",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IL",
        "addressLocality": "יבנה",
        "addressRegion": "מרכז"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+972-55-973-7025",
        "contactType": "customer service",
        "areaServed": "IL",
        "availableLanguage": ["he", "en"]
      },
      "sameAs": [
        "https://wa.me/972559737025"
      ],
      "priceRange": "$$",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5",
        "reviewCount": "50"
      }
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return null;
}

export function ProductJSONLD({ product }: { product: any }) {
  useEffect(() => {
    if (!product) return;

    const schema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "description": product.short_desc || product.desc,
      "sku": product.sku,
      "brand": {
        "@type": "Brand",
        "name": "Aegis Spectra"
      },
      "offers": {
        "@type": "Offer",
        "price": product.price_sale || product.price_regular,
        "priceCurrency": "ILS",
        "availability": "https://schema.org/InStock",
        "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5",
        "reviewCount": "10"
      }
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(schema);
    script.id = `product-schema-${product.sku}`;
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById(`product-schema-${product.sku}`);
      if (existing) {
        document.head.removeChild(existing);
      }
    };
  }, [product]);

  return null;
}

