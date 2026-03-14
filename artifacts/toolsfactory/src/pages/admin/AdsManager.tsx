import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Save, Monitor, Smartphone, Globe, RefreshCw } from 'lucide-react';
import { invalidateAdCache } from '@/components/AdBlock';

type Zone = { zone: string; enabled: boolean; code: string; deviceTarget: string };

const ZONE_DESCRIPTIONS: Record<string, { size: string; location: string }> = {
  HEADER_AD: { size: '728×90 Leaderboard', location: 'Top of every page, above navigation' },
  TOOL_TOP_AD: { size: '728×90 Leaderboard', location: 'Above tool interface on tool pages' },
  TOOL_MIDDLE_AD: { size: '336×280 Rectangle', location: 'Between tool and results' },
  RESULT_SECTION_AD: { size: '728×90 Leaderboard', location: 'Below results section' },
  SIDEBAR_TOP_AD: { size: '300×250 Rectangle', location: 'Right sidebar, top position' },
  SIDEBAR_BOTTOM_AD: { size: '300×250 Rectangle', location: 'Right sidebar, bottom position' },
  FOOTER_AD: { size: '728×90 Leaderboard', location: 'Footer area of every page' },
  STICKY_BOTTOM_AD: { size: '728×90 Leaderboard', location: 'Fixed sticky bar at bottom of screen' },
  FLOATING_AD: { size: '200×200 Square', location: 'Floating in bottom-right corner' },
  INLINE_CONTENT_AD: { size: '728×90 Leaderboard', location: 'Inline within content sections' },
};

export default function AdsManager() {
  const { toast } = useToast();
  const [zones, setZones] = useState<Zone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchZones = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/ads', { credentials: 'include' });
      if (!res.ok) throw new Error('Not authorized');
      const data = await res.json();
      setZones(data.zones || []);
    } catch (e) {
      toast({ title: 'Failed to load ad zones', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchZones(); }, []);

  const update = (index: number, field: string, value: any) => {
    const next = [...zones];
    next[index] = { ...next[index], [field]: value };
    setZones(next);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/ads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ zones }),
      });
      if (!res.ok) throw new Error('Save failed');
      invalidateAdCache();
      toast({ title: '✅ Ad zones saved', description: 'Changes will appear on the site immediately.' });
    } catch {
      toast({ title: 'Failed to save', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const enabledCount = zones.filter(z => z.enabled).length;

  return (
    <AdminLayout title="Ads Manager">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-3xl font-display font-bold">Ads Manager</h2>
          <p className="text-muted-foreground mt-1">
            {enabledCount}/{zones.length} zones enabled · Configure ad placements and inject ad codes
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchZones} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Button onClick={handleSave} disabled={isSaving} size="lg">
            <Save className="w-4 h-4 mr-2" /> {isSaving ? 'Saving...' : 'Save All Changes'}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-muted-foreground">Loading ad zones...</div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {zones.map((zone, i) => {
            const meta = ZONE_DESCRIPTIONS[zone.zone] || { size: 'Variable', location: zone.zone };
            return (
              <Card key={zone.zone} className={`transition-all ${!zone.enabled ? 'opacity-60' : ''}`}>
                <CardHeader className="pb-3 border-b">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-base font-mono text-primary">{zone.zone}</CardTitle>
                        <Badge variant={zone.enabled ? 'default' : 'secondary'} className={zone.enabled ? 'bg-emerald-500 text-xs' : 'text-xs'}>
                          {zone.enabled ? 'ON' : 'OFF'}
                        </Badge>
                      </div>
                      <CardDescription className="text-xs">
                        <span className="font-medium">{meta.size}</span> · {meta.location}
                      </CardDescription>
                    </div>
                    <Switch checked={zone.enabled} onCheckedChange={v => update(i, 'enabled', v)} />
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium">Device Target</label>
                    </div>
                    <Select value={zone.deviceTarget || 'both'} onValueChange={v => update(i, 'deviceTarget', v)} disabled={!zone.enabled}>
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="both"><div className="flex items-center gap-2"><Globe className="w-4 h-4" />All Devices</div></SelectItem>
                        <SelectItem value="desktop"><div className="flex items-center gap-2"><Monitor className="w-4 h-4" />Desktop Only</div></SelectItem>
                        <SelectItem value="mobile"><div className="flex items-center gap-2"><Smartphone className="w-4 h-4" />Mobile Only</div></SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Ad Code (HTML/JavaScript)</label>
                    <Textarea
                      placeholder="<!-- Paste Google AdSense, Media.net, or other ad network code here -->"
                      value={zone.code || ''}
                      onChange={e => update(i, 'code', e.target.value)}
                      disabled={!zone.enabled}
                      className="font-mono text-xs min-h-[100px] bg-slate-950 dark text-slate-200 border-slate-700"
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}
