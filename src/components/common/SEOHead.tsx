import React, { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
  structuredData?: Record<string, any> | Array<Record<string, any>>;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title = "Yuvaparipalan Foundation | India's Youth Empowerment Movement",
  description = "Yuvaparipalan Foundation is India's largest youth empowerment movement dedicated to education, merit scholarships, AI literacy, women entrepreneurship, and preventive health.",
  canonicalUrl = "https://www.yuvaparipalan.org",
  ogImage = "https://www.yuvaparipalan.org/images/career_excellence_hero.jpg",
  structuredData,
}) => {
  useEffect(() => {
    // 1. Update document title
    const fullTitle = title.includes('Yuvaparipalan') ? title : `${title} | Yuvaparipalan Foundation`;
    document.title = fullTitle;

    // 2. Update Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // 3. Update or Create Canonical Link
    let linkCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', canonicalUrl);

    // 4. Update OpenGraph Tags
    const ogTags: Record<string, string> = {
      'og:title': fullTitle,
      'og:description': description,
      'og:url': canonicalUrl,
      'og:image': ogImage,
      'og:type': 'website',
      'og:site_name': 'Yuvaparipalan Foundation',
    };

    Object.entries(ogTags).forEach(([property, content]) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    });

    // 5. Inject JSON-LD Schema
    const baseNgoSchema = {
      "@context": "https://schema.org",
      "@type": "NGO",
      "name": "Yuvaparipalan Foundation",
      "url": "https://www.yuvaparipalan.org",
      "logo": "https://www.yuvaparipalan.org/logo.png",
      "foundingDate": "2016",
      "founders": [
        {
          "@type": "Person",
          "name": "Biju A Sivanandan"
        }
      ],
      "address": [
        {
          "@type": "PostalAddress",
          "streetAddress": "Door no 5/430 D, Madappurachal, Manathana PO",
          "addressLocality": "Kannur",
          "addressRegion": "Kerala",
          "postalCode": "670674",
          "addressCountry": "IN"
        },
        {
          "@type": "PostalAddress",
          "streetAddress": "#3, Sri Mahalakshmi Garden, Saravanampatti",
          "addressLocality": "Coimbatore",
          "addressRegion": "Tamil Nadu",
          "postalCode": "641035",
          "addressCountry": "IN"
        }
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-9562858868",
        "contactType": "general inquiries",
        "email": "hello@yuvaparipalan.org"
      },
      "sameAs": [
        "https://www.yuvaparipalan.org"
      ]
    };

    const finalSchema = structuredData
      ? (Array.isArray(structuredData) ? [baseNgoSchema, ...structuredData] : [baseNgoSchema, structuredData])
      : baseNgoSchema;

    let scriptTag = document.querySelector('#seo-json-ld');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'seo-json-ld';
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(finalSchema);
  }, [title, description, canonicalUrl, ogImage, structuredData]);

  return null;
};
