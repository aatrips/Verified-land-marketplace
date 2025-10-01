'use client';

import React, { useState } from 'react';

type UploaderProps = {
  propertyId: string;
  initialHasImages?: boolean;
};

export default function Uploader({ propertyId, initialHasImages = false }: UploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [hasImages, setHasImages] = useState<boolean>(initialHasImages);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string>('');

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = Array.from(e.target.files || []);
    setFiles(f);
  };

  const onUpload = async () => {
    if (files.length === 0) {
      setMsg('Please choose at least one image.');
      return;
    }
    setBusy(true);
    setMsg('Uploading…');

    // TODO: wire to your real upload action/API.
    // This is a placeholder that simulates success.
    await new Promise((r) => setTimeout(r, 800));

    setBusy(false);
    setHasImages(true);
    setMsg('Upload complete ✅');
  };

  return (
    <div className="border rounded-xl p-4">
      <p className="mb-2 text-sm text-gray-600">
        Property ID: <span className="font-mono">{propertyId}</span>
      </p>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={onChange}
        className="block mb-3"
      />
      <button
        onClick={onUpload}
        disabled={busy}
        className="rounded bg-black text-white px-4 py-2 disabled:opacity-60"
      >
        {busy ? 'Uploading…' : 'Upload'}
      </button>
      <div className="mt-2 text-sm text-gray-500">
        {msg || (hasImages ? 'Images already present.' : 'No images yet.')}
      </div>
    </div>
  );
}
