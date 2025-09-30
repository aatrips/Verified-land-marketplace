// app/properties/[id]/page.tsx
import Uploader from './Uploader';
import ImageGrid from './ImageGrid';
import { createClient } from '@supabase/supabase-js';

export default async function PropertyPage({ params }: { params: { id: string } }) {
  const id = params.id;

  // minimal server-side supabase client (no cookies)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  // count images for this property on the server
  const { count } = await supabase
    .from('property_images')                        // TABLE (underscore)
    .select('id', { count: 'exact', head: true })
    .eq('property_id', id);

  const initialHasImages = (count ?? 0) > 0;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Property Images</h1>
      <Uploader propertyId={id} initialHasImages={initialHasImages} />
      <ImageGrid propertyId={id} />
    </div>
  );
}
