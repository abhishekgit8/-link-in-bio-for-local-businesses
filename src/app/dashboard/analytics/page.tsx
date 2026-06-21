'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { PageLoader } from '@/components/ui/PageLoader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { BarChart3, Eye, MousePointerClick } from 'lucide-react';

interface DailyViews {
  date: string;
  count: number;
}

interface DailyClicks {
  date: string;
  count: number;
}

export default function AnalyticsPage() {
  const [views, setViews] = useState<DailyViews[]>([]);
  const [clicks, setClicks] = useState<DailyClicks[]>([]);
  const [totalViews, setTotalViews] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [loading, setLoading] = useState(true);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [isPro, setIsPro] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setProfileId(user.id);

      // Check if pro
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_tier')
        .eq('id', user.id)
        .single();

      setIsPro(profile?.subscription_tier === 'pro');

      if (profile?.subscription_tier !== 'pro') {
        setLoading(false);
        return;
      }

      // Get page views for last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: viewsData } = await supabase
        .from('page_views')
        .select('created_at')
        .eq('profile_id', user.id)
        .gte('created_at', thirtyDaysAgo.toISOString());

      const { data: clicksData } = await supabase
        .from('link_clicks')
        .select('created_at, link_id')
        .gte('created_at', thirtyDaysAgo.toISOString());

      // Aggregate views by day
      const viewsByDay = aggregateByDay(viewsData || []);
      const clicksByDay = aggregateByDay(clicksData || []);

      setViews(viewsByDay);
      setClicks(clicksByDay);
      setTotalViews((viewsData || []).length);
      setTotalClicks((clicksData || []).length);
      setLoading(false);
    }
    load();
  }, []);

  function aggregateByDay(data: { created_at: string }[]): DailyViews[] {
    const days: Record<string, number> = {};
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      days[key] = 0;
    }

    data.forEach((item) => {
      const key = new Date(item.created_at).toISOString().split('T')[0];
      if (days[key] !== undefined) {
        days[key]++;
      }
    });

    return Object.entries(days).map(([date, count]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count,
    }));
  }

  if (loading) return <PageLoader />;

  if (!isPro) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-2xl font-medium mb-1">Analytics</h1>
          <p className="text-sm text-muted">
            Track your profile views and link clicks.
          </p>
        </div>
        <Card>
          <EmptyState
            icon={<BarChart3 className="w-10 h-10" />}
            title="Upgrade to see analytics"
            description="Analytics are available on the Pro plan. Upgrade to track your page views and link clicks."
            action={
              <a href="/pricing">
                <Button size="sm">View pricing</Button>
              </a>
            }
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-medium mb-1">Analytics</h1>
        <p className="text-sm text-muted">Last 30 days</p>
      </div>

      {/* Stats cards */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{totalViews}</p>
              <p className="text-xs text-muted">Profile views</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
              <MousePointerClick className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{totalClicks}</p>
              <p className="text-xs text-muted">Link clicks</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Views chart */}
      <Card className="mb-6">
        <h3 className="font-medium mb-4">Profile Views</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={views}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E0" />
              <XAxis dataKey="date" fontSize={11} tick={{ fill: '#6B6B6B' }} />
              <YAxis fontSize={11} tick={{ fill: '#6B6B6B' }} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid #E5E5E0',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                  fontSize: '13px',
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#C8F135"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#C8F135' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Clicks chart */}
      <Card>
        <h3 className="font-medium mb-4">Link Clicks</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={clicks}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E0" />
              <XAxis dataKey="date" fontSize={11} tick={{ fill: '#6B6B6B' }} />
              <YAxis fontSize={11} tick={{ fill: '#6B6B6B' }} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid #E5E5E0',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                  fontSize: '13px',
                }}
              />
              <Bar dataKey="count" fill="#C8F135" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
