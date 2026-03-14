import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Edit, Code, RefreshCw } from 'lucide-react';

type Script = { id: number; name: string; code: string; placement: string; enabled: boolean };

const SCRIPT_TEMPLATES = [
  {
    name: 'Google Analytics (GA4)',
    placement: 'head',
    code: `<!-- Google Analytics GA4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>`,
  },
  {
    name: 'Google AdSense Auto Ads',
    placement: 'head',
    code: `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>`,
  },
  {
    name: 'Meta Pixel (Facebook)',
    placement: 'head',
    code: `<!-- Meta Pixel Code -->
<script>
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window,document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'YOUR_PIXEL_ID');
  fbq('track', 'PageView');
</script>`,
  },
  {
    name: 'Hotjar Heatmaps',
    placement: 'head',
    code: `<script>
  (function(h,o,t,j,a,r){
    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
    h._hjSettings={hjid:YOUR_ID,hjsv:6};
    a=o.getElementsByTagName('head')[0];
    r=o.createElement('script');r.async=1;
    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
    a.appendChild(r);
  })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
</script>`,
  },
  {
    name: 'Google Tag Manager',
    placement: 'head',
    code: `<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXXX');</script>`,
  },
];

const EMPTY_FORM = { name: '', code: '', placement: 'head', enabled: true };

export default function ScriptManager() {
  const { toast } = useToast();
  const [scripts, setScripts] = useState<Script[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);

  const fetchScripts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/scripts', { credentials: 'include' });
      const data = await res.json();
      setScripts((data.scripts || []).map((s: any) => ({ ...s, enabled: !!s.enabled })));
    } catch {
      toast({ title: 'Failed to load scripts', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchScripts(); }, []);

  const openCreate = (template?: typeof SCRIPT_TEMPLATES[0]) => {
    setEditingId(null);
    setForm(template ? { name: template.name, code: template.code, placement: template.placement, enabled: true } : EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (script: Script) => {
    setEditingId(script.id);
    setForm({ name: script.name, code: script.code, placement: script.placement, enabled: script.enabled });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.code.trim()) {
      toast({ title: 'Name and code are required', variant: 'destructive' });
      return;
    }
    setIsSaving(true);
    try {
      const url = editingId ? `/api/admin/scripts/${editingId}` : '/api/admin/scripts';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...form, enabled: form.enabled ? 1 : 0 }),
      });
      if (!res.ok) throw new Error('Save failed');
      toast({ title: editingId ? 'Script updated' : '✅ Script added', description: 'Changes apply on next page load.' });
      setDialogOpen(false);
      fetchScripts();
    } catch {
      toast({ title: 'Failed to save script', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle = async (script: Script) => {
    try {
      await fetch(`/api/admin/scripts/${script.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ enabled: !script.enabled ? 1 : 0 }),
      });
      setScripts(prev => prev.map(s => s.id === script.id ? { ...s, enabled: !s.enabled } : s));
    } catch {
      toast({ title: 'Failed to update', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this script?')) return;
    try {
      await fetch(`/api/admin/scripts/${id}`, { method: 'DELETE', credentials: 'include' });
      setScripts(prev => prev.filter(s => s.id !== id));
      toast({ title: 'Script deleted' });
    } catch {
      toast({ title: 'Failed to delete', variant: 'destructive' });
    }
  };

  const placementColor = (p: string) =>
    p === 'head' ? 'bg-blue-100 text-blue-700 border-blue-200'
    : p === 'body' ? 'bg-purple-100 text-purple-700 border-purple-200'
    : 'bg-orange-100 text-orange-700 border-orange-200';

  return (
    <AdminLayout title="Script Manager">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-3xl font-display font-bold">Script Manager</h2>
          <p className="text-muted-foreground mt-1">Add analytics, ad networks, pixels, and tracking scripts — no coding required</p>
        </div>
        <Button onClick={() => openCreate()} size="lg">
          <Plus className="w-4 h-4 mr-2" /> Add Script
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 space-y-3">
          {isLoading ? (
            <div className="text-center py-16 text-muted-foreground">Loading scripts...</div>
          ) : scripts.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-2xl">
              <Code className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="font-medium">No scripts added yet</p>
              <p className="text-sm mt-1">Add Google Analytics, AdSense, or other tracking scripts</p>
              <Button className="mt-4" onClick={() => openCreate()}>Add Your First Script</Button>
            </div>
          ) : (
            scripts.map(script => (
              <div key={script.id} className={`border rounded-xl p-4 bg-card flex items-start gap-4 transition-all ${!script.enabled ? 'opacity-60' : ''}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{script.name}</span>
                    <Badge className={`text-[10px] border ${placementColor(script.placement)}`}>{script.placement}</Badge>
                    {!script.enabled && <Badge variant="secondary" className="text-[10px]">Disabled</Badge>}
                  </div>
                  <pre className="text-xs text-muted-foreground font-mono bg-muted/50 px-3 py-2 rounded-lg truncate max-w-full overflow-hidden whitespace-nowrap">
                    {script.code.slice(0, 120)}{script.code.length > 120 ? '...' : ''}
                  </pre>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Switch checked={script.enabled} onCheckedChange={() => handleToggle(script)} />
                  <Button variant="ghost" size="icon" onClick={() => openEdit(script)}><Edit className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(script.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Quick Templates</h3>
          {SCRIPT_TEMPLATES.map(t => (
            <button
              key={t.name}
              onClick={() => openCreate(t)}
              className="w-full text-left border rounded-xl p-4 bg-card hover:border-primary/50 hover:bg-primary/5 transition-all"
            >
              <div className="font-medium text-sm">{t.name}</div>
              <div className="text-xs text-muted-foreground mt-1 capitalize">{t.placement} injection</div>
            </button>
          ))}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Script' : 'Add New Script'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium mb-2 block">Script Name *</label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Google Analytics" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Placement</label>
                <Select value={form.placement} onValueChange={v => setForm(f => ({ ...f, placement: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="head">&lt;head&gt; — Analytics, meta tags</SelectItem>
                    <SelectItem value="body">&lt;body&gt; — Tracking pixels</SelectItem>
                    <SelectItem value="footer">Footer — Non-critical scripts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end gap-3">
                <div className="flex items-center gap-2 pb-1">
                  <Switch checked={form.enabled} onCheckedChange={v => setForm(f => ({ ...f, enabled: v }))} />
                  <span className="text-sm font-medium">{form.enabled ? 'Enabled' : 'Disabled'}</span>
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Script Code *</label>
              <Textarea
                value={form.code}
                onChange={e => setForm(f => ({ ...f, code: e.target.value }))}
                placeholder="<!-- Paste your script here -->"
                className="font-mono text-xs min-h-[180px] bg-slate-950 dark text-slate-200 border-slate-700"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : editingId ? 'Update Script' : 'Add Script'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
