import React, { useState } from 'react';
import { toolEngine } from '@/lib/toolEngine';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Copy, Download, RefreshCw, AlertCircle, Wrench } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface ToolInterfaceProps {
  logicFunction: string;
}

export function ToolInterface({ logicFunction }: ToolInterfaceProps) {
  const config = toolEngine[logicFunction];
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [result, setResult] = useState<{ value?: any; type?: string; error?: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  React.useEffect(() => {
    if (config) {
      const initial: Record<string, any> = {};
      config.fields.forEach(f => { if (f.defaultValue !== undefined) initial[f.name] = f.defaultValue; });
      setFormData(initial);
    }
    setResult(null);
  }, [logicFunction]);

  if (!config) {
    return (
      <div className="p-8 text-center text-muted-foreground bg-muted/50 rounded-2xl border border-dashed">
        <Wrench className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p className="font-medium">Tool UI coming soon!</p>
        <p className="text-sm mt-2">This tool is being prepared and will be available shortly.</p>
      </div>
    );
  }

  const handleChange = (name: string, value: any) => setFormData(prev => ({ ...prev, [name]: value }));

  const handleProcess = async () => {
    setIsProcessing(true);
    setResult(null);
    try {
      const res = await config.handler(formData);
      setResult(res.error ? { error: res.error } : { value: res.result, type: res.type });
    } catch (e: any) {
      setResult({ error: e.message || 'An unexpected error occurred' });
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text?: string) => {
    const toCopy = text || (result?.value && typeof result.value === 'string' ? result.value : '');
    if (toCopy) navigator.clipboard.writeText(toCopy);
  };

  const parseGradientResult = () => {
    try { return JSON.parse(result?.value || '{}'); } catch { return {}; }
  };

  const parseImageResult = () => {
    try { return JSON.parse(result?.value || '{}'); } catch { return { url: result?.value }; }
  };

  return (
    <div className="bg-card rounded-2xl shadow-lg border p-6 md:p-8">
      <div className="space-y-6">
        {config.fields.map(field => (
          <div key={field.name} className="space-y-2">
            <Label className="text-base font-semibold">{field.label}</Label>
            {field.type === 'text' || field.type === 'number' ? (
              <Input
                type={field.type}
                placeholder={field.placeholder}
                value={formData[field.name] ?? ''}
                min={field.min}
                max={field.max}
                onChange={e => handleChange(field.name, e.target.value)}
                className="h-12 text-base bg-background"
              />
            ) : field.type === 'textarea' ? (
              <Textarea
                placeholder={field.placeholder}
                value={formData[field.name] ?? ''}
                onChange={e => handleChange(field.name, e.target.value)}
                className="min-h-[160px] text-base bg-background font-mono"
              />
            ) : field.type === 'select' && field.options ? (
              <Select
                value={formData[field.name] ?? ''}
                onValueChange={v => handleChange(field.name, v)}
              >
                <SelectTrigger className="h-12 text-base bg-background">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {field.options.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : field.type === 'color' ? (
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData[field.name] ?? '#6366f1'}
                  onChange={e => handleChange(field.name, e.target.value)}
                  className="w-12 h-12 rounded-lg cursor-pointer border border-border"
                />
                <Input
                  type="text"
                  value={formData[field.name] ?? '#6366f1'}
                  onChange={e => handleChange(field.name, e.target.value)}
                  className="h-12 font-mono bg-background w-36"
                />
              </div>
            ) : field.type === 'range' ? (
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={field.min ?? 0}
                  max={field.max ?? 100}
                  value={formData[field.name] ?? field.defaultValue ?? 50}
                  onChange={e => handleChange(field.name, e.target.value)}
                  className="flex-1"
                />
                <span className="text-base font-mono w-12 text-right">{formData[field.name] ?? field.defaultValue ?? 50}</span>
              </div>
            ) : field.type === 'file' ? (
              <Input
                type="file"
                accept="image/*"
                onChange={e => handleChange(field.name, e.target.files?.[0])}
                className="h-12 pt-3 bg-background cursor-pointer file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
            ) : null}
          </div>
        ))}

        <Button
          onClick={handleProcess}
          disabled={isProcessing}
          className="w-full h-14 text-lg font-bold shadow-lg hover:-translate-y-0.5 transition-all"
          size="lg"
        >
          {isProcessing ? (
            <><RefreshCw className="mr-2 h-5 w-5 animate-spin" />Processing...</>
          ) : '⚡ Generate Result'}
        </Button>

        {result && (
          <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-400">
            <div className="h-px bg-border mb-6" />
            <h3 className="font-display font-bold text-xl mb-4">Result</h3>

            {result.error ? (
              <div className="p-4 bg-destructive/10 text-destructive rounded-xl border border-destructive/20 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="font-medium">{result.error}</p>
              </div>
            ) : result.type === 'gradient' ? (
              (() => {
                const g = parseGradientResult();
                return (
                  <div className="space-y-4">
                    <div className="w-full h-40 rounded-2xl border shadow-md" style={{ background: g.css }} />
                    <div className="relative group">
                      <pre className="p-4 bg-muted/50 rounded-xl border font-mono text-sm">{g.code}</pre>
                      <Button size="sm" variant="secondary" className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => copyToClipboard(g.code)}>
                        <Copy className="w-4 h-4 mr-1" /> Copy CSS
                      </Button>
                    </div>
                  </div>
                );
              })()
            ) : result.type === 'color' ? (
              <div className="space-y-4">
                <div className="w-full h-24 rounded-2xl border shadow-md" style={{ backgroundColor: formData.color || '#6366f1' }} />
                <div className="relative group">
                  <pre className="p-4 bg-muted/50 rounded-xl border font-mono text-sm whitespace-pre-wrap">{result.value}</pre>
                  <Button size="sm" variant="secondary" className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => copyToClipboard()}>
                    <Copy className="w-4 h-4 mr-1" /> Copy
                  </Button>
                </div>
              </div>
            ) : result.type === 'text' || result.type === 'json' ? (
              <div className="relative group">
                <pre className="p-6 bg-muted/50 rounded-xl border overflow-x-auto whitespace-pre-wrap font-mono text-sm shadow-inner max-h-[500px] overflow-y-auto">
                  {result.value}
                </pre>
                <Button size="sm" variant="secondary" className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => copyToClipboard()}>
                  <Copy className="w-4 h-4 mr-2" /> Copy
                </Button>
              </div>
            ) : result.type === 'qrcode' ? (
              <div className="flex flex-col items-center justify-center p-8 bg-muted/50 rounded-xl border">
                <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
                  <QRCodeSVG value={result.value} size={256} />
                </div>
                <Button variant="outline" onClick={() => {
                  const svg = document.querySelector('svg');
                  if (!svg) return;
                  const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml' });
                  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'qrcode.svg'; a.click();
                }}>
                  <Download className="w-4 h-4 mr-2" /> Download QR Code
                </Button>
              </div>
            ) : result.type === 'image' ? (
              (() => {
                const img = parseImageResult();
                return (
                  <div className="flex flex-col items-center justify-center p-6 bg-muted/50 rounded-xl border space-y-4">
                    <img src={img.url || result.value} alt="Processed" className="max-w-full rounded-lg shadow-md max-h-[400px] object-contain" />
                    {img.saved && (
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div><div className="text-sm text-muted-foreground">Original</div><div className="font-bold">{img.originalKB} KB</div></div>
                        <div><div className="text-sm text-muted-foreground">Compressed</div><div className="font-bold text-green-600">{img.compressedKB} KB</div></div>
                        <div><div className="text-sm text-muted-foreground">Saved</div><div className="font-bold text-emerald-600">{img.saved}%</div></div>
                      </div>
                    )}
                    <Button asChild><a href={img.url || result.value} download="compressed-image.jpg"><Download className="w-4 h-4 mr-2" /> Download</a></Button>
                  </div>
                );
              })()
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
