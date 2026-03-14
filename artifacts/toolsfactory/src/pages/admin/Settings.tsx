import React, { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Save } from 'lucide-react';

export default function Settings() {
  const [settings, setSettings] = useState({
    siteName: 'ToolsFactory',
    siteUrl: 'https://toolsfactory.com',
    adminEmail: 'admin@toolsfactory.com',
    resultsPerPage: 50,
    feedbackNotifications: true,
    analyticsTracking: true,
    autoPublishTools: false,
  });

  const handleSave = () => {
    console.log('Settings saved:', settings);
    alert('Settings saved successfully!');
  };

  return (
    <AdminLayout title="Settings">
      <div className="max-w-2xl space-y-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">General Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Site Name</label>
              <Input value={settings.siteName} onChange={e => setSettings({...settings, siteName: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium">Site URL</label>
              <Input value={settings.siteUrl} onChange={e => setSettings({...settings, siteUrl: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium">Admin Email</label>
              <Input type="email" value={settings.adminEmail} onChange={e => setSettings({...settings, adminEmail: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium">Results Per Page</label>
              <Input type="number" value={settings.resultsPerPage} onChange={e => setSettings({...settings, resultsPerPage: Number(e.target.value)})} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Features</h3>
          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={settings.feedbackNotifications} onChange={e => setSettings({...settings, feedbackNotifications: e.target.checked})} />
              <span>Enable Feedback Notifications</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={settings.analyticsTracking} onChange={e => setSettings({...settings, analyticsTracking: e.target.checked})} />
              <span>Enable Analytics Tracking</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={settings.autoPublishTools} onChange={e => setSettings({...settings, autoPublishTools: e.target.checked})} />
              <span>Auto-Publish New Tools</span>
            </label>
          </div>
        </Card>

        <Button size="lg" onClick={handleSave} className="w-full">
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </AdminLayout>
  );
}
