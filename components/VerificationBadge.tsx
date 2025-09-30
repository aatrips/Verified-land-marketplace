// components/VerificationBadge.tsx
'use client';

export default function VerificationBadge({ verified }: { verified: boolean }) {
  if (!verified) {
    return (
      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800">
        In review
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
      Verified
    </span>
  );
}
