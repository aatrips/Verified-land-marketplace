'use client';

import { useCallback, useEffect, useState } from 'react';

// Optional: ensure no prerender/SSG tries to guess HTML before client mounts
export const dynamic = 'force-dynamic';

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

  // Read from URL *after* mount to avoid SSR/CSR mismatch
  const [key, setKey] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const load = useCallback(async (k: string) => {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`/api/ops/leads?key=${encodeURIComponent(k)}`, { cache: 'no-store' });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || res.statusText);
      }
      const j = await res.json();
      setRows(j.rows || []);
    } catch (e: any) {
      setErr(e?.message || 'Failed to load leads');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setHydrated(true);
    const k = new URLSearchParams(window.location.search).get('key');
    setKey(k);
    if (k) load(k);
    else setLoading(false);
  }, [load]);

  // Keep initial SSR/CSR markup identical: a simple loading stub
  if (!hydrated) return <div className="p-6">Loading…</div>;

  if (!key) return <div className="p-6 text-sm text-red-700">Unauthorized</div>;

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Ops — Leads</h1>
        <button onClick={() => load(key)} className="px-3 py-1.5 border rounded hover:bg-gray-50 text-sm">
          Refresh
        </button>
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : err ? (
        <div className="text-sm text-red-700">Error: {err}</div>
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
                <td className="px-4 py-2 border">
                  {r.created_at ? new Date(r.created_at).toLocaleString() : '-'}
                </td>
                <td className="px-4 py-2 border">{r.full_name || '-'}</td>
                <td className="px-4 py-2 border">{r.phone || '-'}</td>
                <td className="px-4 py-2 border">
                  {r.property ? (
                    <a
                      className="text-blue-700 hover:underline"
                      href={`/properties/${r.property.id}`}
                      target="_blank"
                      rel="noreferrer"
                    >
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
