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
      <circle cx="32" cy="32" r="32" fill="#1A1A1A" />
      <circle cx="32" cy="44" r="3" fill="#C8F135" />
      <path d="M32 44 C30.5 38, 26 32, 22 22" stroke="#C8F135" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="22" cy="22" r="2.5" fill="#C8F135" />
      <path d="M32 44 C32 36, 32 28, 32 18" stroke="#C8F135" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="32" cy="18" r="2.5" fill="#C8F135" />
      <path d="M32 44 C33.5 38, 38 30, 42 20" stroke="#C8F135" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="42" cy="20" r="2.5" fill="#C8F135" />
    </svg>
  );
}
