import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { AdminLayout } from '@/components/AdminLayout';
import { useCreateTool } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Plus, X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

const CATEGORIES = ['utility', 'developer', 'writing', 'business', 'design', 'image', 'creator', 'education', 'finance', 'health'];

const LOGIC_FUNCTIONS = [
  'generatePassword', 'formatJSON', 'generateQRCode', 'calculateGST', 'calculateAge',
  'countWords', 'encodeBase64', 'encodeURL', 'convertUnit', 'calculateProfit',
  'calculateDiscount', 'generateGradient', 'pickColor', 'compressImage',
  'generateYouTubeTitle', 'generateHashtags', 'convertCase', 'generateLoremIpsum',
  'generateMD5', 'convertBinary',
];

export default function GenerateTool() {
  const [, setLocation] = useLocation();
  const createMut = useCreateTool();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: '',
    slug: '',
    category: 'utility',
    description: '',
    logicFunction: 'generatePassword',
    keywords: [''],
    faqData: [{ question: '', answer: '' }],
  });

  const set = (k: string, v: any) => setForm(prev => ({ ...prev, [k]: v }));

  const autoSlug = (name: string) =>
    name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');

  const handleNameChange = (name: string) => {
    set('name', name);
    if (!form.slug || form.slug === autoSlug(form.name)) {
      set('slug', autoSlug(name));
    }
  };

  const addKeyword = () => set('keywords', [...form.keywords, '']);
  const removeKeyword = (i: number) => set('keywords', form.keywords.filter((_, idx) => idx !== i));
  const updateKeyword = (i: number, v: string) => {
    const kws = [...form.keywords];
    kws[i] = v;
    set('keywords', kws);
  };

  const addFaq = () => set('faqData', [...form.faqData, { question: '', answer: '' }]);
  const removeFaq = (i: number) => set('faqData', form.faqData.filter((_, idx) => idx !== i));
  const updateFaq = (i: number, field: string, v: string) => {
    const faq = [...form.faqData];
    faq[i] = { ...faq[i], [field]: v };
    set('faqData', faq);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.slug || !form.description) {
      toast({ title: 'Missing required fields', description: 'Name, slug, and description are required.', variant: 'destructive' });
      return;
    }
    try {
      await createMut.mutateAsync({
        data: {
          name: form.name,
          slug: form.slug,
          category: form.category,
          description: form.description,
          logicFunction: form.logicFunction,
          keywords: form.keywords.filter(k => k.trim()),
          faqData: form.faqData.filter(f => f.question.trim() && f.answer.trim()),
        },
      });
      queryClient.invalidateQueries({ queryKey: ['/api/tools'] });
      toast({ title: '🎉 Tool created!', description: `${form.name} is now live at /tools/${form.slug}` });
      setLocation('/admin/tools');
    } catch (e: any) {
      const msg = e?.response?.data?.message || e.message || 'Failed to create tool';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    }
  };

  return (
    <AdminLayout title="Generate New Tool">
      <div className="max-w-3xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-3xl font-display font-bold">Generate New Tool</h2>
            <p className="text-muted-foreground">Create a new tool that instantly goes live on the public site</p>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="p-6 space-y-5">
            <h3 className="font-semibold text-lg border-b pb-3">Basic Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 block">Tool Name *</Label>
                <Input value={form.name} onChange={e => handleNameChange(e.target.value)} placeholder="e.g. Image Resizer" />
              </div>
              <div>
                <Label className="mb-2 block">URL Slug * <span className="text-muted-foreground text-xs">(auto-generated)</span></Label>
                <Input value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="image-resizer" className="font-mono" />
              </div>
            </div>

            {form.slug && (
              <p className="text-xs text-muted-foreground bg-muted px-3 py-2 rounded-lg font-mono">
                Public URL: <span className="text-primary">/tools/{form.slug}</span>
              </p>
            )}

            <div>
              <Label className="mb-2 block">Description *</Label>
              <Textarea
                value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="Describe what this tool does in 1-2 sentences..."
                className="min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 block">Category</Label>
                <Select value={form.category} onValueChange={v => set('category', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => <SelectItem key={c} value={c} className="capitalize">{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-2 block">Tool Logic Function</Label>
                <Select value={form.logicFunction} onValueChange={v => set('logicFunction', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {LOGIC_FUNCTIONS.map(fn => <SelectItem key={fn} value={fn} className="font-mono text-sm">{fn}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-semibold text-lg">SEO Keywords</h3>
              <Button variant="outline" size="sm" onClick={addKeyword}><Plus className="w-3 h-3 mr-1" /> Add</Button>
            </div>
            {form.keywords.map((kw, i) => (
              <div key={i} className="flex gap-2">
                <Input value={kw} onChange={e => updateKeyword(i, e.target.value)} placeholder={`keyword ${i + 1}`} />
                {form.keywords.length > 1 && (
                  <Button variant="ghost" size="icon" onClick={() => removeKeyword(i)} className="text-destructive hover:bg-destructive/10 shrink-0">
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </Card>

          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-semibold text-lg">FAQ Data</h3>
              <Button variant="outline" size="sm" onClick={addFaq}><Plus className="w-3 h-3 mr-1" /> Add FAQ</Button>
            </div>
            {form.faqData.map((faq, i) => (
              <div key={i} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">FAQ #{i + 1}</span>
                  {form.faqData.length > 1 && (
                    <Button variant="ghost" size="icon" className="w-7 h-7 text-destructive" onClick={() => removeFaq(i)}>
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
                <Input value={faq.question} onChange={e => updateFaq(i, 'question', e.target.value)} placeholder="Question?" />
                <Textarea value={faq.answer} onChange={e => updateFaq(i, 'answer', e.target.value)} placeholder="Answer..." className="min-h-[80px]" />
              </div>
            ))}
          </Card>

          <div className="flex gap-3">
            <Button size="lg" onClick={handleSubmit} disabled={createMut.isPending} className="flex-1">
              <Sparkles className="w-4 h-4 mr-2" />
              {createMut.isPending ? 'Creating Tool...' : 'Create & Publish Tool'}
            </Button>
            <Button size="lg" variant="outline" onClick={() => setLocation('/admin/tools')}>Cancel</Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
