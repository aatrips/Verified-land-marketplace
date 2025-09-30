// lib/types.ts
export type PropertyStatus = 'DRAFT' | 'IN_REVIEW' | 'VERIFIED' | 'REJECTED' | 'SOLD';

export interface PropertyRow {
  id: string;
  title: string;
  city: string;
  state: string;
  hero_url: string | null;
  created_at: string;
  status: PropertyStatus;
  price?: number | null;
  description?: string | null;
}
