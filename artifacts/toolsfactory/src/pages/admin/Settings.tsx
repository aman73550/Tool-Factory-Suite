import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Save, RefreshCw, Globe, Palette, MessageSquare, BarChart, Zap } from 'lucide-react';

type SettingsMap = Record<string, string>;

export default function Settings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SettingsMap>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/settings', { credentials: 'include' });
      const data = await res.json();
      setSettings(data.settings || {});
    } catch {
      toast({ title: 'Failed to load settings', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchSettings(); }, []);

  const set = (key: string, value: string) => setSettings(prev => ({ ...prev, [key]: value }));
  const setBool = (key: string, value: boolean) => set(key, value ? 'true' : 'false');
  const get = (key: string, fallback = '') => settings[key] ?? fallback;
  const getBool = (key: string, fallback = true) => (settings[key] !== undefined ? settings[key] === 'true' : fallback);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ settings }),
      });
      if (!res.ok) throw new Error('Save failed');
      toast({ title: '✅ Settings saved', description: 'Changes are now live on the website.' });
    } catch {
      toast({ title: 'Failed to save settings', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <AdminLayout title="Settings"><div className="p-8 text-muted-foreground">Loading settings...</div></AdminLayout>;
  }

  return (
    <AdminLayout title="Settings">
      <div className="max-w-3xl space-y-6">

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              <CardTitle>General Settings</CardTitle>
            </div>
            <CardDescription>Core website identity and contact information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Site Name</label>
                <Input value={get('siteName', 'ToolsFactory')} onChange={e => set('siteName', e.target.value)} placeholder="ToolsFactory" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Site Tagline</label>
                <Input value={get('siteTagline')} onChange={e => set('siteTagline', e.target.value)} placeholder="Free Online Tools for Everyone" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Site URL</label>
              <Input value={get('siteUrl')} onChange={e => set('siteUrl', e.target.value)} placeholder="https://toolsfactory.com" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Admin Email</label>
              <Input type="email" value={get('adminEmail')} onChange={e => set('adminEmail', e.target.value)} placeholder="admin@toolsfactory.com" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Footer Text</label>
              <Input value={get('footerText')} onChange={e => set('footerText', e.target.value)} placeholder="© 2025 ToolsFactory. All rights reserved." />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-500" />
              <CardTitle>Default SEO Settings</CardTitle>
            </div>
            <CardDescription>Applied to pages that don't have specific SEO metadata</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Default Meta Title</label>
              <Input value={get('defaultMetaTitle')} onChange={e => set('defaultMetaTitle', e.target.value)} placeholder="ToolsFactory — Free Online Tools" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Default Meta Description</label>
              <Textarea value={get('defaultMetaDescription')} onChange={e => set('defaultMetaDescription', e.target.value)} placeholder="Free online tools for developers..." className="min-h-[80px]" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Default Keywords (comma-separated)</label>
              <Input value={get('defaultKeywords')} onChange={e => set('defaultKeywords', e.target.value)} placeholder="free online tools, developer tools" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-violet-500" />
              <CardTitle>UI & Theme Settings</CardTitle>
            </div>
            <CardDescription>Control the look and feel of your website</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Default Theme</label>
              <Select value={get('theme', 'light')} onValueChange={v => set('theme', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light Mode</SelectItem>
                  <SelectItem value="dark">Dark Mode</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Tools Per Page</label>
              <Select value={get('resultsPerPage', '20')} onValueChange={v => set('resultsPerPage', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 tools per page</SelectItem>
                  <SelectItem value="20">20 tools per page</SelectItem>
                  <SelectItem value="50">50 tools per page</SelectItem>
                  <SelectItem value="100">100 tools per page</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <CardTitle>Feature Toggles</CardTitle>
            </div>
            <CardDescription>Enable or disable platform features globally</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {[
              { key: 'feedbackEnabled', label: 'User Feedback & Ratings', desc: 'Allow users to rate and comment on tools', icon: MessageSquare },
              { key: 'analyticsEnabled', label: 'Analytics Tracking', desc: 'Track page views and tool usage', icon: BarChart },
              { key: 'autoPublishTools', label: 'Auto-Publish New Tools', desc: 'Automatically set new tools to active status', icon: Zap },
              { key: 'emptySpaceAdsEnabled', label: 'Empty Space Ad Detection', desc: 'Automatically insert ads in unused vertical spaces', icon: Globe },
            ].map(({ key, label, desc, icon: Icon }) => (
              <div key={key} className="flex items-center justify-between py-2">
                <div className="flex items-start gap-3">
                  <Icon className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">{label}</div>
                    <div className="text-xs text-muted-foreground">{desc}</div>
                  </div>
                </div>
                <Switch checked={getBool(key)} onCheckedChange={v => setBool(key, v)} />
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button size="lg" onClick={handleSave} disabled={isSaving} className="flex-1">
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save All Settings'}
          </Button>
          <Button size="lg" variant="outline" onClick={fetchSettings} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Reset
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
