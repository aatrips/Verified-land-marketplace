'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Row = {
  id: string;
  title: string;
  city: string;
  state: string;
  status?: string;        // keep for backward compatibility
  verification?: boolean; // NEW: single truth for verification
  created_at?: string;
};

export default function OpsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setErrorMsg(null);

    const { data, error } = await supabase
  .from('properties')
  // REMOVE status from the projection:
  .select('id,title,city,state,verification,created_at')
  .order('created_at', { ascending: false });


    if (error) {
      console.error('Error fetching properties:', error);
      setErrorMsg(error.message);
      setRows([]);
    } else {
      setRows(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleVerification = async (row: Row) => {
    if (!row?.id) return;

    // Optimistic UI update
    const next = !(row.verification ?? false);
    setRows((curr) =>
      curr.map((r) => (r.id === row.id ? { ...r, verification: next } : r))
    );

    const { error } = await supabase
      .from('properties')
      .update({ verification: next })
      .eq('id', row.id);

    if (error) {
      // Revert on failure
      console.error('Error updating verification:', error);
      setRows((curr) =>
        curr.map((r) =>
          r.id === row.id ? { ...r, verification: row.verification ?? false } : r
        )
      );
      setErrorMsg(error.message);
    }
  };

  const renderVerification = (v: boolean | undefined) =>
    typeof v === 'boolean' ? (v ? 'VERIFIED' : 'PENDING') : '-';

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Operations Dashboard</h1>

      {errorMsg && (
        <div className="mb-3 text-sm text-red-600">Error: {errorMsg}</div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : rows.length === 0 ? (
        <p>No properties found.</p>
      ) : (
        <table className="min-w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Title</th>
              <th className="px-4 py-2 border">City</th>
              <th className="px-4 py-2 border">State</th>
              <th className="px-4 py-2 border">Status</th>        {/* existing */}
              <th className="px-4 py-2 border">Verification</th>  {/* new derived */}
              <th className="px-4 py-2 border">Created At</th>
              <th className="px-4 py-2 border">Action</th>        {/* new */}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="text-sm">
                <td className="px-4 py-2 border">{row.id}</td>
                <td className="px-4 py-2 border">{row.title}</td>
                <td className="px-4 py-2 border">{row.city}</td>
                <td className="px-4 py-2 border">{row.state}</td>
                <td className="px-4 py-2 border">{row.status || '-'}</td>
                <td className="px-4 py-2 border">
                  <span
                    className={
                      row.verification
                        ? 'text-green-700 font-medium'
                        : 'text-yellow-700 font-medium'
                    }
                  >
                    {renderVerification(row.verification)}
                  </span>
                </td>
                <td className="px-4 py-2 border">
                  {row.created_at
                    ? new Date(row.created_at).toLocaleDateString()
                    : '-'}
                </td>
                <td className="px-4 py-2 border">
                  <button
                    className="px-2 py-1 border rounded hover:bg-gray-50"
                    onClick={() => toggleVerification(row)}
                  >
                    {row.verification ? 'Mark Pending' : 'Mark Verified'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
