// components/PropertyCard.tsx
import Link from 'next/link';
import VerificationBadge from './VerificationBadge';

export interface PropertyRow {
  id: string;
  title: string;
  city: string;
  state: string;
  hero_url: string | null;
  created_at: string;
  verification: boolean;     // 👈 back to boolean
  price?: number | null;
}

export default function PropertyCard({ p }: { p: PropertyRow }) {
  return (
    <Link href={`/properties/${p.id}`} className="block rounded-2xl border hover:shadow-md transition">
      <div className="aspect-[16/9] w-full overflow-hidden rounded-t-2xl bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {p.hero_url ? (
          <img src={p.hero_url} alt={p.title} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full grid place-items-center text-sm text-gray-500">No image</div>
        )}
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-base font-semibold line-clamp-1">{p.title}</h3>
          <VerificationBadge verified={p.verification} />
        </div>
        <p className="text-sm text-gray-600">{p.city}, {p.state}</p>
        {typeof p.price === 'number' && <p className="text-sm font-medium">₹ {p.price.toLocaleString('en-IN')}</p>}
        <p className="text-xs text-gray-400">
          Listed on {new Date(p.created_at).toLocaleDateString('en-IN')}
        </p>
      </div>
    </Link>
  );
}
