import React from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { useGetAnalytics } from '@workspace/api-client-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Analytics() {
  const { data: analytics, isLoading } = useGetAnalytics();

  if (isLoading) return <AdminLayout><div className="p-8">Loading analytics...</div></AdminLayout>;

  return (
    <AdminLayout title="Analytics">
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Daily Page Views</h3>
            {analytics?.dailyViews && (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.dailyViews}>
                  <CartesianGrid stroke="var(--border)" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="views" stroke="var(--primary)" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
          
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Tools by Category</h3>
            {analytics?.categoryStats && (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.categoryStats}>
                  <CartesianGrid stroke="var(--border)" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="var(--primary)" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <h3 className="font-semibold mb-4">Top Performing Tools</h3>
          <div className="space-y-3">
            {analytics?.topTools?.map(tool => (
              <div key={tool.slug} className="flex justify-between items-center p-3 border rounded">
                <div>
                  <p className="font-medium">{tool.name}</p>
                  <p className="text-sm text-muted-foreground">{tool.views} views • ⭐ {tool.rating}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
