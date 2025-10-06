// app/sitemap.ts
import type { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic'; // always fresh

const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const entries: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/properties`, lastModified: new Date() },
    { url: `${base}/seller`, lastModified: new Date() },
    { url: `${base}/privacy`, lastModified: new Date() },
    { url: `${base}/contact`, lastModified: new Date() },
  ];

  // Dynamic property pages (read with public client; RLS allows select)
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('id, updated_at, created_at')
      .order('created_at', { ascending: false })
      .limit(500); // keep sitemap light

    if (!error && Array.isArray(data)) {
      for (const row of data) {
        const last = (row as any).updated_at || (row as any).created_at || new Date().toISOString();
        entries.push({
          url: `${base}/properties/${row.id}`,
          lastModified: new Date(last),
        });
      }
    }
  } catch {
    // Fail-safe: just return static pages if DB call fails
  }

  return entries;
}
