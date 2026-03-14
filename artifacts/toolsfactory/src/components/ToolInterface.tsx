import React, { useState } from 'react';
import { toolEngine } from '@/lib/toolEngine';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Copy, Download, RefreshCw, AlertCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface ToolInterfaceProps {
  logicFunction: string;
}

export function ToolInterface({ logicFunction }: ToolInterfaceProps) {
  const config = toolEngine[logicFunction];
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [result, setResult] = useState<{ value?: any; type?: string; error?: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize defaults
  React.useEffect(() => {
    if (config) {
      const initial: Record<string, any> = {};
      config.fields.forEach(f => {
        if (f.defaultValue !== undefined) initial[f.name] = f.defaultValue;
      });
      setFormData(initial);
    }
  }, [config]);

  if (!config) {
    return (
      <div className="p-8 text-center text-muted-foreground bg-muted/50 rounded-2xl border border-dashed">
        <Wrench className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>This tool is currently under maintenance or not fully implemented.</p>
      </div>
    );
  }

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProcess = async () => {
    setIsProcessing(true);
    setResult(null);
    try {
      const res = await config.handler(formData);
      if (res.error) {
        setResult({ error: res.error });
      } else {
        setResult({ value: res.result, type: res.type });
      }
    } catch (e: any) {
      setResult({ error: e.message || 'An unexpected error occurred' });
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = () => {
    if (result?.value && typeof result.value === 'string') {
      navigator.clipboard.writeText(result.value);
    }
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
                value={formData[field.name] || ''}
                onChange={e => handleChange(field.name, e.target.value)}
                className="h-12 text-lg bg-background"
              />
            ) : field.type === 'textarea' ? (
              <Textarea
                placeholder={field.placeholder}
                value={formData[field.name] || ''}
                onChange={e => handleChange(field.name, e.target.value)}
                className="min-h-[160px] text-lg bg-background font-mono"
              />
            ) : field.type === 'select' && field.options ? (
              <Select value={formData[field.name] || ''} onValueChange={v => handleChange(field.name, v)}>
                <SelectTrigger className="h-12 text-lg bg-background">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {field.options.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : field.type === 'file' ? (
              <Input
                type="file"
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
          {isProcessing ? <RefreshCw className="mr-2 h-5 w-5 animate-spin" /> : 'Process'}
        </Button>

        {result && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="h-px bg-border mb-8" />
            <h3 className="font-display font-bold text-xl mb-4">Result</h3>
            
            {result.error ? (
              <div className="p-4 bg-destructive/10 text-destructive rounded-xl border border-destructive/20 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="font-medium">{result.error}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {result.type === 'text' || result.type === 'json' ? (
                  <div className="relative group">
                    <pre className="p-6 bg-muted/50 rounded-xl border overflow-x-auto whitespace-pre-wrap font-mono text-sm shadow-inner">
                      {result.value}
                    </pre>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={copyToClipboard}
                    >
                      <Copy className="w-4 h-4 mr-2" /> Copy
                    </Button>
                  </div>
                ) : result.type === 'qrcode' ? (
                  <div className="flex flex-col items-center justify-center p-8 bg-muted/50 rounded-xl border">
                    <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
                      <QRCodeSVG value={result.value} size={256} />
                    </div>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" /> Download QR Code
                    </Button>
                  </div>
                ) : result.type === 'image' ? (
                  <div className="flex flex-col items-center justify-center p-8 bg-muted/50 rounded-xl border">
                    <img src={result.value} alt="Processed" className="max-w-full rounded-lg shadow-md mb-6 max-h-[400px] object-contain" />
                    <Button asChild>
                      <a href={result.value} download="processed-image.png">
                        <Download className="w-4 h-4 mr-2" /> Download Image
                      </a>
                    </Button>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
