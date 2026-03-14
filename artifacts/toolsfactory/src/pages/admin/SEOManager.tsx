import React from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { useListTools } from '@workspace/api-client-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';

export default function SEOManager() {
  const { data: toolsData } = useListTools();

  const tools = toolsData?.tools || [];

  const seoAudit = tools.map(tool => ({
    ...tool,
    hasTitle: !!tool.name,
    hasDescription: tool.description.length >= 50,
    hasKeywords: Array.isArray(tool.keywords) && tool.keywords.length > 0,
    hasFAQ: Array.isArray(tool.faqData) && tool.faqData.length > 0,
    score: [
      !!tool.name,
      tool.description.length >= 50,
      Array.isArray(tool.keywords) && tool.keywords.length > 0,
      Array.isArray(tool.faqData) && tool.faqData.length > 0,
    ].filter(Boolean).length,
  }));

  const excellent = seoAudit.filter(t => t.score === 4);
  const needsWork = seoAudit.filter(t => t.score < 4);

  return (
    <AdminLayout title="SEO Manager">
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold mb-2">SEO Manager</h2>
        <p className="text-muted-foreground">Monitor and improve SEO health across all tool pages</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
          <div className="text-3xl font-bold text-emerald-700">{excellent.length}</div>
          <div className="text-sm font-medium text-emerald-600 mt-1">Excellent SEO (4/4)</div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <div className="text-3xl font-bold text-amber-700">{needsWork.length}</div>
          <div className="text-sm font-medium text-amber-600 mt-1">Needs Improvement</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <div className="text-3xl font-bold text-blue-700">{tools.length}</div>
          <div className="text-sm font-medium text-blue-600 mt-1">Total Tool Pages</div>
        </div>
      </div>

      <div className="bg-card border rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b bg-muted/50 flex items-center gap-4">
          <span className="font-semibold">SEO Audit — All Tools</span>
          <Badge variant="outline" className="text-xs">Auto-generated per tool</Badge>
        </div>
        <div className="divide-y">
          {seoAudit.map(tool => (
            <div key={tool.id} className="px-6 py-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{tool.name}</span>
                  <span className="text-xs text-muted-foreground font-mono">/tools/{tool.slug}</span>
                </div>
                <div className="flex gap-3 flex-wrap">
                  <SEOCheck label="Title" ok={tool.hasTitle} />
                  <SEOCheck label="Description (50+ chars)" ok={tool.hasDescription} />
                  <SEOCheck label="Keywords" ok={tool.hasKeywords} />
                  <SEOCheck label="FAQ Schema" ok={tool.hasFAQ} />
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className={`text-sm font-bold px-3 py-1 rounded-full ${
                  tool.score === 4 ? 'bg-emerald-100 text-emerald-700' :
                  tool.score >= 2 ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }`}>{tool.score}/4</div>
                <Button variant="ghost" size="icon" asChild>
                  <a href={`/tools/${tool.slug}`} target="_blank" rel="noreferrer">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h3 className="font-semibold text-blue-900 mb-2">SEO Features Auto-Applied to Every Tool Page</h3>
        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
          <li>Unique page title: "{`{Tool Name}`} - Free Online Tool | ToolsFactory"</li>
          <li>Meta description from tool description field</li>
          <li>Meta keywords from the keywords array</li>
          <li>FAQ structured data (JSON-LD schema) from faqData</li>
          <li>Open Graph tags for social sharing</li>
          <li>Breadcrumb navigation (Home → Tools → Category → Tool)</li>
          <li>Canonical URL generation</li>
        </ul>
      </div>
    </AdminLayout>
  );
}

function SEOCheck({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className={`flex items-center gap-1 text-xs ${ok ? 'text-emerald-600' : 'text-amber-600'}`}>
      {ok ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
      {label}
    </div>
  );
}
