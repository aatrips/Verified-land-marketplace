'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useSession } from '@supabase/auth-helpers-react';

type LeadRow = {
  id: string;
  created_at: string;
  full_name: string | null;
  phone: string | null;
  property_id: string;
  property: { id: string; title?: string; city?: string; state?: string; verification?: boolean } | null;
};

export const dynamic = 'force-dynamic';

export default function OpsLeadsPage() {
  const session = useSession();
  const [rows, setRows] = useState<LeadRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch('/api/ops/leads', { cache: 'no-store' });
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
    if (session) {
      load();
    } else {
      setLoading(false);
    }
  }, [session, load]);

  if (!session) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-2">Operations — Leads</h1>
        <p className="text-sm text-gray-700 mb-3">Please sign in as an admin to view this page.</p>
        <Link href="/login?next=/ops/leads" className="underline">Go to Admin Login</Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Ops — Leads</h1>
        <button onClick={load} className="px-3 py-1.5 border rounded hover:bg-gray-50 text-sm">Refresh</button>
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : err ? (
        <div className="text-sm text-red-700">
          Error: {err}
          <div className="text-xs text-gray-600 mt-1">
            If you logged in but still see Forbidden, make sure your email is in <code>ADMIN_EMAILS</code>.
          </div>
        </div>
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
