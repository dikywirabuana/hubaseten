export function Emblem({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect width="48" height="48" rx="12" fill="currentColor" opacity="0.12" />
      <path
        d="M10 34h28M13 34l6-14h10l6 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx="24" cy="16" r="3.2" fill="currentColor" />
      <path d="M17 34v5M31 34v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
