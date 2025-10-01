'use client';

import React from 'react';

type ImageGridProps = {
  propertyId: string;
  images?: string[];
};

export default function ImageGrid({ propertyId, images = [] }: ImageGridProps) {
  // TODO: fetch real images for the propertyId.
  // Placeholder content to satisfy types & avoid runtime errors.
  const data = images;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Existing Images</h2>
      {data.length === 0 ? (
        <div className="text-sm text-gray-500">No images to show.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {data.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={src} alt={`img-${i}`} className="w-full h-auto rounded" />
          ))}
        </div>
      )}
      <p className="mt-2 text-xs text-gray-400">
        Property: <span className="font-mono">{propertyId}</span>
      </p>
    </div>
  );
}
