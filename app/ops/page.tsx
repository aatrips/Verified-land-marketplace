'use client';

import { useEffect, useState } from 'react';
import { getSupabaseClient } from '@/lib/supabaseClient';

type Row = {
  id: string;
  title: string;
  city: string;
  state: string;
  created_at: string;
  verification: boolean;
};

export default function OpsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    try {
      const supabase = getSupabaseClient();
      setLoading(true);
      setErr(null);
      const { data, error } = await supabase
        .from('properties')
        .select('id,title,city,state,created_at,verification')
        .order('created_at', { ascending: false });

      if (error) setErr(error.message);
      setRows((data ?? []) as Row[]);
    } catch (e: any) {
      setErr(e?.message ?? 'Failed to init Supabase client. Is env.js loaded?');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleVerify(id: string, value: boolean) {
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.from('properties').update({ verification: value }).eq('id', id);
      if (error) return setErr(error.message);
      setRows(prev => prev.map(r => (r.id === id ? { ...r, verification: value } : r)));
    } catch (e: any) {
      setErr(e?.message ?? 'Failed to init Supabase client. Is env.js loaded?');
    }
  }

  return (
    <main>
      <h1 className="text-2xl font-bold mb-4">Ops — Verification</h1>
      {err && <p className="text-sm text-red-600 mb-3">{err}</p>}
      {loading ? (
        <p className="text-gray-500">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-gray-500">No rows found.</p>
      ) : (
        <table className="w-full text-sm border">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 border">Title</th>
              <th className="p-2 border">City</th>
              <th className="p-2 border">State</th>
              <th className="p-2 border">Created</th>
              <th className="p-2 border">Verification</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id}>
                <td className="p-2 border">{r.title}</td>
                <td className="p-2 border">{r.city}</td>
                <td className="p-2 border">{r.state}</td>
                <td className="p-2 border">{new Date(r.created_at).toLocaleDateString('en-IN')}</td>
                <td className="p-2 border">{r.verification ? 'Verified' : 'In review'}</td>
                <td className="p-2 border">
                  {r.verification ? (
                    <button onClick={() => toggleVerify(r.id, false)} className="rounded-md px-3 py-1 border hover:bg-gray-50">
                      Mark Unverified
                    </button>
                  ) : (
                    <button onClick={() => toggleVerify(r.id, true)} className="rounded-md px-3 py-1 border hover:bg-gray-50">
                      Mark Verified
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
