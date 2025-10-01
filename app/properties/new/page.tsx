'use client';

import { useSearchParams } from 'next/navigation';
import Uploader from './Uploader';
import ImageGrid from './ImageGrid';

export default function NewPropertyImagesPage() {
  const searchParams = useSearchParams();
  const id = (searchParams.get('id') || '').trim();
  const initialHasImages = (searchParams.get('hasImages') || '').toLowerCase() === 'true';

  if (!id) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold mb-2">Property Images</h1>
        <p className="text-red-600">Missing property id. Open this page with <code>?id=&lt;property-id&gt;</code>.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Property Images</h1>
      <Uploader propertyId={id} initialHasImages={initialHasImages} />
      <ImageGrid propertyId={id} />
    </div>
  );
}
