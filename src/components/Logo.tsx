import Image from 'next/image';

export function Logo({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <Image
      src="/rooted-logo.png"
      alt="Rooted"
      width={size}
      height={size}
      className={className}
      priority
    />
  );
}
