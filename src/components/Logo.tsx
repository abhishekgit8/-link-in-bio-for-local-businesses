export function Logo({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="32" cy="52" r="4" fill="#C8F135" />
      <path d="M32 52 C30 44, 24 36, 18 22" stroke="#C8F135" strokeWidth="3" strokeLinecap="round" />
      <circle cx="18" cy="22" r="3" fill="#C8F135" />
      <path d="M32 52 C32 42, 32 32, 32 14" stroke="#C8F135" strokeWidth="3" strokeLinecap="round" />
      <circle cx="32" cy="14" r="3" fill="#C8F135" />
      <path d="M32 52 C34 42, 40 34, 46 20" stroke="#C8F135" strokeWidth="3" strokeLinecap="round" />
      <circle cx="46" cy="20" r="3" fill="#C8F135" />
    </svg>
  );
}

export function LogoDark({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="32" cy="52" r="4" fill="#1A1A1A" />
      <path d="M32 52 C30 44, 24 36, 18 22" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" />
      <circle cx="18" cy="22" r="3" fill="#1A1A1A" />
      <path d="M32 52 C32 42, 32 32, 32 14" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" />
      <circle cx="32" cy="14" r="3" fill="#1A1A1A" />
      <path d="M32 52 C34 42, 40 34, 46 20" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" />
      <circle cx="46" cy="20" r="3" fill="#1A1A1A" />
    </svg>
  );
}
