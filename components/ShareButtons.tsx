'use client';

import { useEffect, useMemo, useState } from 'react';

type ShareProps = {
  id: string;
  title?: string;
  city?: string;
  state?: string;
};

export default function ShareButtons({ id, title, city, state }: ShareProps) {
  const [origin, setOrigin] = useState<string>('');

  // Avoid hydration mismatch: detect origin after mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.location?.origin) {
        setOrigin(window.location.origin);
      }
    } catch {
      /* noop */
    }
  }, []);

  // Fallback to NEXT_PUBLIC_SITE_URL if origin isn't available yet
  const base = origin || (process.env.NEXT_PUBLIC_SITE_URL ?? '');
  const url = `${base}/properties/${id}`;

  const location = [city, state].filter(Boolean).join(', ');
  const message = useMemo(() => {
    const parts = [];
    if (title) parts.push(title);
    if (location) parts.push(location);
    parts.push(url);
    return `Check out this property: ${parts.filter(Boolean).join(' • ')}`;
  }, [title, location, url]);

  const waHref = `https://wa.me/?text=${encodeURIComponent(message)}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert('Link copied!');
    } catch {
      // fallback prompt if clipboard not available
      prompt('Copy this link:', url);
    }
  };

  // Hide until we know at least a base URL to prevent weird links
  const disabled = !url || url.endsWith('/properties/');

  return (
    <div className="mt-2 flex items-center gap-2">
      <a
        href={waHref}
        target="_blank"
        rel="noreferrer"
        className={`rounded border px-3 py-1.5 text-sm hover:bg-gray-50 ${disabled ? 'pointer-events-none opacity-60' : ''}`}
        aria-label="Share on WhatsApp"
      >
        Share on WhatsApp
      </a>
      <button
        type="button"
        onClick={copy}
        disabled={disabled}
        className="rounded border px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-60"
      >
        Copy link
      </button>
    </div>
  );
}
