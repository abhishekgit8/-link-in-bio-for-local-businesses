import { cn } from '@/lib/utils';

interface PhoneFrameProps {
  children: React.ReactNode;
  className?: string;
}

export function PhoneFrame({ children, className }: PhoneFrameProps) {
  return (
    <div className={cn('relative mx-auto w-[320px]', className)}>
      <div className="relative rounded-[3rem] border-[3px] border-primary/10 bg-white shadow-xl overflow-hidden aspect-[9/19]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[28px] bg-black rounded-b-2xl z-10" />
        <div className="h-full overflow-y-auto scrollbar-thin p-3 pt-10">
          {children}
        </div>
      </div>
    </div>
  );
}
