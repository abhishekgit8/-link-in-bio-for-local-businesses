'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { BarChart3, Link2, Palette, Settings, User, LogOut, LayoutDashboard } from 'lucide-react';
import { Logo } from '@/components/Logo';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
  { href: '/dashboard/links', label: 'Links', icon: Link2 },
  { href: '/dashboard/appearance', label: 'Theme', icon: Palette },
  { href: '/dashboard/analytics', label: 'Stats', icon: BarChart3 },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

const mobileNavItems = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/dashboard/links', label: 'Links', icon: Link2 },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
  { href: '/dashboard/appearance', label: 'Theme', icon: Palette },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    if (!window.confirm('Are you sure you want to sign out?')) return;
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 border-r border-border bg-white h-screen sticky top-0">
        <div className="p-5 border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <Logo size={24} />
            <span className="font-serif text-lg tracking-tight">Rooted</span>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-accent/20 text-primary'
                    : 'text-muted hover:text-primary hover:bg-black/5'
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted hover:text-red-600 hover:bg-red-50 transition-all duration-200 w-full"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border">
        <div className="flex items-center justify-around py-2 px-1">
          {mobileNavItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-0.5 px-1.5 py-1 rounded-lg text-[10px] font-medium transition-colors duration-200 min-w-0 flex-1',
                  isActive ? 'text-primary' : 'text-muted'
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
