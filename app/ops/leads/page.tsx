'use client';

import { useEffect, useState } from 'react';

type LeadRow = {
  id: string;
  created_at: string;
  full_name: string | null;
  phone: string | null;
  property_id: string;
  property: { id: string; title?: string; city?: string; state?: string; verification?: boolean } | null;
};

export default function OpsLeadsPage() {
  const [rows, setRows] = useState<LeadRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  function keyFromURL() {
    if (typeof window === 'undefined') return '';
    const u = new URL(window.location.href);
    return (u.searchParams.get('key') || '').trim();
  }

  useEffect(() => {
    const key = keyFromURL();
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const qs = key ? `?key=${encodeURIComponent(key)}` : '';
        const res = await fetch(`/api/ops/leads${qs}`, { cache: 'no-store' });
        const body = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(body?.error || res.statusText);
        setRows(body.rows || []);
      } catch (e: any) {
        setErr(e?.message || 'Failed to load leads');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="p-2">
      <h1 className="text-2xl font-semibold mb-4">Ops — Leads</h1>
      {loading ? (
        <p>Loading…</p>
      ) : err ? (
        <div className="text-sm text-red-700">{err}</div>
      ) : rows.length === 0 ? (
        <p>No leads yet.</p>
      ) : (
        <table className="min-w-full border border-gray-200 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Created</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Phone</th>
              <th className="px-4 py-2 border">Property</th>
              <th className="px-4 py-2 border">Location</th>
              <th className="px-4 py-2 border">Verified</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-2 border">{r.created_at ? new Date(r.created_at).toLocaleString() : '-'}</td>
                <td className="px-4 py-2 border">{r.full_name || '-'}</td>
                <td className="px-4 py-2 border">{r.phone || '-'}</td>
                <td className="px-4 py-2 border">
                  {r.property ? (
                    <a className="text-blue-700 hover:underline" href={`/properties/${r.property.id}`} target="_blank" rel="noreferrer">
                      {r.property.title || r.property.id}
                    </a>
                  ) : (
                    r.property_id
                  )}
                </td>
                <td className="px-4 py-2 border">
                  {r.property ? `${r.property.city ?? ''}${r.property.city && r.property.state ? ', ' : ''}${r.property.state ?? ''}` : '-'}
                </td>
                <td className="px-4 py-2 border">
                  {r.property?.verification ? (
                    <span className="text-green-700 font-medium">VERIFIED</span>
                  ) : (
                    <span className="text-yellow-700 font-medium">PENDING</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
