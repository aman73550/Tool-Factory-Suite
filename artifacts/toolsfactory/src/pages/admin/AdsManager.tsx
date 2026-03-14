import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { useGetAdZones, useUpdateAdZones } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';

export default function AdsManager() {
  const { data, isLoading } = useGetAdZones();
  const updateMut = useUpdateAdZones();
  const { toast } = useToast();
  
  const [zones, setZones] = useState<any[]>([]);

  useEffect(() => {
    if (data?.zones) {
      setZones(data.zones);
    }
  }, [data]);

  const handleUpdate = (index: number, field: string, value: any) => {
    const newZones = [...zones];
    newZones[index] = { ...newZones[index], [field]: value };
    setZones(newZones);
  };

  const handleSave = async () => {
    try {
      await updateMut.mutateAsync({ data: { zones } });
      toast({ title: 'Ad zones updated successfully' });
    } catch (e) {
      toast({ title: 'Error saving ad zones', variant: 'destructive' });
    }
  };

  if (isLoading) return <AdminLayout><div className="p-8">Loading...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-display font-bold text-foreground">Ads Manager</h2>
          <p className="text-muted-foreground mt-1">Configure advertisement placements across the platform.</p>
        </div>
        <Button onClick={handleSave} disabled={updateMut.isPending} size="lg">
          <Save className="w-4 h-4 mr-2" /> {updateMut.isPending ? 'Saving...' : 'Save All Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {zones.map((zone, i) => (
          <Card key={zone.zone} className={!zone.enabled ? 'opacity-75' : ''}>
            <CardHeader className="pb-4 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg font-mono text-primary">{zone.zone}</CardTitle>
                  <CardDescription>Toggle visibility and inject ad code.</CardDescription>
                </div>
                <Switch 
                  checked={zone.enabled} 
                  onCheckedChange={(v) => handleUpdate(i, 'enabled', v)}
                />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <label className="text-sm font-medium mb-2 block">Ad HTML/JS Code</label>
              <Textarea 
                placeholder="<!-- Paste Google AdSense or other ad network code here -->"
                value={zone.code || ''}
                onChange={(e) => handleUpdate(i, 'code', e.target.value)}
                className="font-mono text-sm min-h-[120px] bg-slate-950 dark text-slate-300"
                disabled={!zone.enabled}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
}
