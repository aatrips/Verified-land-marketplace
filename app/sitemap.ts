import type { MetadataRoute } from 'next';

const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now },
    { url: `${base}/properties`, lastModified: now },
    { url: `${base}/seller`, lastModified: now },
    { url: `${base}/privacy`, lastModified: now },
    { url: `${base}/contact`, lastModified: now },
  ];
}
