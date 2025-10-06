'use client';

export default function VerificationBadge({ verified }: { verified?: boolean }) {
  const isOk = !!verified;
  return (
    <span
      className={`inline-block text-xs px-2 py-1 rounded border ${
        isOk
          ? 'text-green-800 bg-green-100 border-green-200'
          : 'text-yellow-800 bg-yellow-100 border-yellow-200'
      }`}
      aria-label={isOk ? 'Verified' : 'Pending'}
    >
      {isOk ? 'VERIFIED' : 'PENDING'}
    </span>
  );
}
