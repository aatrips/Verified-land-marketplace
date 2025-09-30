// components/StatusBadge.tsx
'use client';

import React from 'react';
import type { PropertyStatus } from '@/lib/types';

const colorByStatus: Record<PropertyStatus, string> = {
  DRAFT: 'bg-gray-200 text-gray-900',
  IN_REVIEW: 'bg-yellow-100 text-yellow-800',
  VERIFIED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  SOLD: 'bg-purple-100 text-purple-800',
};

export default function StatusBadge({ status }: { status: PropertyStatus }) {
  const cls = colorByStatus[status] ?? 'bg-gray-100 text-gray-800';
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {status.replace('_', ' ')}
    </span>
  );
}
