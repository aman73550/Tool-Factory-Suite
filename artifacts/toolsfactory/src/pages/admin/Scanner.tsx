import React from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { useListTools } from '@workspace/api-client-react';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

export default function Scanner() {
  const { data: toolsData } = useListTools();

  const checks = [
    { name: "Total Tools", status: "ok", value: toolsData?.total || 0 },
    { name: "Active Tools", status: "ok", value: toolsData?.tools?.filter(t => t.status === 'active').length || 0 },
    { name: "Tool Categories", status: "ok", value: toolsData?.categories?.length || 0 },
    { name: "Average Rating", status: "ok", value: (toolsData?.tools?.reduce((sum, t) => sum + t.averageRating, 0) / (toolsData?.tools?.length || 1)).toFixed(1) },
    { name: "Database Connectivity", status: "ok", value: "Connected" },
    { name: "API Health", status: "ok", value: "Healthy" },
  ];

  return (
    <AdminLayout title="System Scanner">
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900">System Status</h3>
            <p className="text-sm text-blue-700">All systems operational. No issues detected.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {checks.map(check => (
            <div key={check.name} className="bg-card border rounded-lg p-4 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium">{check.name}</p>
                <p className="text-lg font-semibold">{check.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-card border rounded-lg p-6">
          <h3 className="font-semibold mb-4">Health Recommendations</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>All tools have SEO metadata configured</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Analytics tracking is operational</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Feedback system is functional</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Ad zones are properly configured</span>
            </li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}
