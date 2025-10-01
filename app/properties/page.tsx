'use client';

import { useEffect, useMemo, useState } from 'react';
import { getSupabaseClient } from '@/lib/supabaseClient';
import PropertyCard, { PropertyRow } from '@/components/PropertyCard';

type SortKey = 'new' | 'old' | 'priceAsc' | 'priceDesc';

const PAGE_SIZE = 12;

export default function Properties() {
  const [rows, setRows] = useState<PropertyRow[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // UI filters
  const [citySearch, setCitySearch] = useState('');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [sort, setSort] = useState<SortKey>('new');

  // Pagination
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Debounce city typing (300ms)
  const debouncedCity = useMemo(() => citySearch.trim().toLowerCase(), [citySearch]);
  const [debounced, setDebounced] = useState(debouncedCity);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(debouncedCity), 300);
    return () => clearTimeout(t);
  }, [debouncedCity]);

  // Build and run the query for a given page
  async function fetchPage(targetPage: number, opts?: { append?: boolean }) {
    const append = opts?.append ?? false;
    try {
      const supabase = getSupabaseClient();

      let q = supabase
        .from('properties')
        .select('id,title,city,state,hero_url,created_at,verification,price', {
          count: append ? 'exact' : 'exact', // keep count (cheap enough)
        });

      if (onlyVerified) q = q.eq('verification', true);
      if (debounced) q = q.ilike('city', `%${debounced}%`);

      switch (sort) {
        case 'new':
          q = q.order('created_at', { ascending: false });
          break;
        case 'old':
          q = q.order('created_at', { ascending: true });
          break;
        case 'priceAsc':
          q = q.order('price', { ascending: true, nullsFirst: true }).order('created_at', { ascending: false });
          break;
        case 'priceDesc':
          q = q.order('price', { ascending: false, nullsFirst: false }).order('created_at', { ascending: false });
          break;
      }

      const from = targetPage * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      q = q.range(from, to);

      const { data, error, count } = await q;
      if (error) throw error;

      const list = (data ?? []) as PropertyRow[];
      setTotal(typeof count === 'number' ? count : null);

      if (append) {
        setRows(prev => [...prev, ...list]);
      } else {
        setRows(list);
      }

      // If fewer than a full page came back, there’s no more
      setHasMore(list.length === PAGE_SIZE);

      // Update current page only after successful fetch
      setPage(targetPage);
    } catch (e: any) {
      setErr(e?.message ?? 'Failed to load properties');
    }
  }

  // Initial load & whenever filters/sort change → reset to page 0
  useEffect(() => {
    setErr(null);
    setHasMore(true);
    setPage(0);
    setLoading(true);
    fetchPage(0, { append: false }).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced, onlyVerified, sort]);

  async function onLoadMore() {
    setLoadingMore(true);
    await fetchPage(page + 1, { append: true });
    setLoadingMore(false);
  }

  return (
    <main className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-bold mb-4">Browse Properties</h1>

      {/* Filters */}
      <div className="mb-4 flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="flex-1">
          <input
            className="w-full rounded-lg border p-2"
            placeholder="Search by city (e.g., Pune)"
            value={citySearch}
            onChange={(e) => setCitySearch(e.target.value)}
          />
        </div>

        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={onlyVerified}
            onChange={(e) => setOnlyVerified(e.target.checked)}
          />
          Verified only
        </label>

        <div>
          <select
            className="rounded-lg border p-2 text-sm"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
          >
            <option value="new">Newest first</option>
            <option value="old">Oldest first</option>
            <option value="priceAsc">Price: Low → High</option>
            <option value="priceDesc">Price: High → Low</option>
          </select>
        </div>
      </div>

      {/* Results meta */}
      <div className="mb-3 text-sm text-gray-600">
        {loading && page === 0
          ? 'Loading…'
          : err
          ? <span className="text-red-600">{err}</span>
          : (
            <span>{total ?? rows.length} results</span>
          )}
      </div>

      {/* Grid */}
      {rows.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rows.map((p) => (
              <PropertyCard key={p.id} p={p} />
            ))}
          </div>

          <div className="flex justify-center my-6">
            {hasMore ? (
              <button
                onClick={onLoadMore}
                disabled={loadingMore}
                className="rounded-lg border px-4 py-2 hover:bg-gray-50 disabled:opacity-60"
              >
                {loadingMore ? 'Loading…' : 'Load more'}
              </button>
            ) : (
              <span className="text-sm text-gray-500">No more results</span>
            )}
          </div>
        </>
      ) : !loading && !err ? (
        <p className="text-gray-500">No properties found.</p>
      ) : null}
    </main>
  );
}
