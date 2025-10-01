'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Row = {
  id: string;
  title: string;
  city: string;
  state: string;
  status?: string;
  created_at?: string;
};

export default function OpsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('id,title,city,state,status,created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching properties:', error);
      } else {
        setRows(data || []);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Operations Dashboard</h1>
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
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Created At</th>
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
                  {row.created_at
                    ? new Date(row.created_at).toLocaleDateString()
                    : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
