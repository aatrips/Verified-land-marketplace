'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function InterestForm({
  propertyId,
  propertyTitle,
  onSuccess,
}: {
  propertyId: string;
  propertyTitle?: string;
  onSuccess?: () => void;
}) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOk(null);
    setErr(null);
    setSubmitting(true);

    try {
      if (!fullName.trim()) throw new Error('Please enter your name');
      if (!phone.trim()) throw new Error('Please enter your phone');

      const { error } = await supabase.from('leads').insert([
        {
          property_id: propertyId,
          full_name: fullName.trim(),
          phone: phone.trim(),
        },
      ]);
      if (error) throw error;

      setOk('Thanks! We’ll contact you soon.');
      setFullName('');
      setPhone('');
      onSuccess?.();
    } catch (e: any) {
      setErr(e?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-2">
      {ok && (
        <div className="text-green-700 text-xs border border-green-200 bg-green-50 p-2 rounded">
          {ok}
        </div>
      )}
      {err && (
        <div className="text-red-700 text-xs border border-red-200 bg-red-50 p-2 rounded">
          Error: {err}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-medium">Name *</label>
          <input
            className="mt-1 w-full rounded border px-3 py-2 text-sm"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your name"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium">Phone *</label>
          <input
            className="mt-1 w-full rounded border px-3 py-2 text-sm"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="99999 99999"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="rounded bg-black px-4 py-2 text-white hover:bg-gray-800 disabled:opacity-60 text-sm"
        aria-label={`Send interest for ${propertyTitle ?? 'property'}`}
      >
        {submitting ? 'Sending…' : 'Send interest'}
      </button>
    </form>
  );
}
