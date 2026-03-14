import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { AdminLayout } from '@/components/AdminLayout';
import { useCreateTool } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { TrendingUp, Zap, CheckCircle } from 'lucide-react';

const TRENDING_TOOLS = [
  { name: 'Image Compressor', slug: 'image-compressor', category: 'image', logicFunction: 'compressImage', description: 'Compress images online without losing quality — reduce file size instantly', keywords: ['compress image', 'image optimizer', 'reduce image size'] },
  { name: 'Image Resizer', slug: 'image-resizer', category: 'image', logicFunction: 'compressImage', description: 'Resize images to any dimension while maintaining aspect ratio', keywords: ['image resizer', 'resize photo', 'image dimensions'] },
  { name: 'QR Code Generator', slug: 'qr-code-generator', category: 'utility', logicFunction: 'generateQRCode', description: 'Generate QR codes for URLs, text, WiFi passwords, and more', keywords: ['qr code', 'qr generator', 'barcode'] },
  { name: 'Password Generator', slug: 'password-generator', category: 'utility', logicFunction: 'generatePassword', description: 'Generate strong, secure, random passwords with custom length and characters', keywords: ['password generator', 'secure password', 'random password'] },
  { name: 'PDF Merge', slug: 'pdf-merge', category: 'utility', logicFunction: 'formatJSON', description: 'Merge multiple PDF files into one document instantly', keywords: ['pdf merge', 'combine pdf', 'merge pdf files'] },
  { name: 'Word Counter', slug: 'word-counter', category: 'writing', logicFunction: 'countWords', description: 'Count words, characters, sentences and reading time', keywords: ['word counter', 'character count', 'word count'] },
  { name: 'JSON Formatter', slug: 'json-formatter', category: 'developer', logicFunction: 'formatJSON', description: 'Format, validate, and beautify JSON code instantly', keywords: ['json formatter', 'json validator', 'beautify json'] },
  { name: 'Base64 Encoder', slug: 'base64-encoder', category: 'developer', logicFunction: 'encodeBase64', description: 'Encode and decode Base64 strings quickly and easily', keywords: ['base64 encoder', 'base64 decoder'] },
  { name: 'URL Encoder', slug: 'url-encoder', category: 'developer', logicFunction: 'encodeURL', description: 'Encode and decode URL strings for safe web transmission', keywords: ['url encoder', 'url decoder', 'percent encoding'] },
  { name: 'GST Calculator', slug: 'gst-calculator', category: 'business', logicFunction: 'calculateGST', description: 'Calculate GST for any amount and tax rate', keywords: ['gst calculator', 'tax calculator'] },
  { name: 'Profit Margin Calculator', slug: 'profit-margin-calculator', category: 'business', logicFunction: 'calculateProfit', description: 'Calculate profit margin and markup for your business', keywords: ['profit margin', 'markup calculator'] },
  { name: 'Discount Calculator', slug: 'discount-calculator', category: 'business', logicFunction: 'calculateDiscount', description: 'Calculate the final price after any discount percentage', keywords: ['discount calculator', 'sale price'] },
  { name: 'YouTube Title Generator', slug: 'youtube-title-generator', category: 'creator', logicFunction: 'generateYouTubeTitle', description: 'Generate catchy, SEO-optimized YouTube video titles', keywords: ['youtube title', 'video title generator'] },
  { name: 'Instagram Hashtag Generator', slug: 'instagram-hashtag-generator', category: 'creator', logicFunction: 'generateHashtags', description: 'Generate relevant Instagram hashtags to boost reach and engagement', keywords: ['instagram hashtags', 'hashtag generator'] },
  { name: 'Color Picker', slug: 'color-picker', category: 'design', logicFunction: 'pickColor', description: 'Pick colors and convert between HEX, RGB, and HSL formats', keywords: ['color picker', 'hex to rgb', 'color converter'] },
  { name: 'CSS Gradient Generator', slug: 'gradient-generator', category: 'design', logicFunction: 'generateGradient', description: 'Create beautiful CSS gradients with a visual editor', keywords: ['gradient generator', 'css gradient', 'color gradient'] },
  { name: 'Age Calculator', slug: 'age-calculator', category: 'utility', logicFunction: 'calculateAge', description: 'Calculate exact age in years, months, and days from birthdate', keywords: ['age calculator', 'birthday calculator'] },
  { name: 'Unit Converter', slug: 'unit-converter', category: 'utility', logicFunction: 'convertUnit', description: 'Convert between units of length, weight, temperature, volume, and more', keywords: ['unit converter', 'length converter', 'temperature converter'] },
  { name: 'Text Case Converter', slug: 'text-case-converter', category: 'writing', logicFunction: 'convertCase', description: 'Convert text between uppercase, lowercase, title case, camelCase, and more', keywords: ['text case', 'uppercase converter', 'camelcase'] },
  { name: 'Lorem Ipsum Generator', slug: 'lorem-ipsum-generator', category: 'developer', logicFunction: 'generateLoremIpsum', description: 'Generate Lorem Ipsum placeholder text for designs and mockups', keywords: ['lorem ipsum', 'placeholder text', 'dummy text'] },
  { name: 'MD5 Hash Generator', slug: 'md5-hash-generator', category: 'developer', logicFunction: 'generateMD5', description: 'Generate MD5 hashes from any text string instantly', keywords: ['md5 hash', 'hash generator', 'checksum'] },
  { name: 'Binary Converter', slug: 'binary-converter', category: 'developer', logicFunction: 'convertBinary', description: 'Convert between binary, decimal, hexadecimal, and octal', keywords: ['binary converter', 'decimal to binary', 'hex converter'] },
];

export default function TrendingTools() {
  const createMut = useCreateTool();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [built, setBuilt] = useState<Set<string>>(new Set());
  const [building, setBuilding] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  const handleBuild = async (tool: typeof TRENDING_TOOLS[0]) => {
    setBuilding(tool.slug);
    try {
      await createMut.mutateAsync({ data: tool });
      queryClient.invalidateQueries({ queryKey: ['/api/tools'] });
      setBuilt(prev => new Set([...prev, tool.slug]));
      toast({ title: `✅ ${tool.name} is now live!`, description: `Available at /tools/${tool.slug}` });
    } catch (e: any) {
      const msg = e?.response?.data?.message || e.message || '';
      if (msg.includes('already exists') || msg.includes('conflict')) {
        setBuilt(prev => new Set([...prev, tool.slug]));
        toast({ title: `${tool.name} already exists`, description: 'This tool is already on your platform' });
      } else {
        toast({ title: 'Failed to create tool', description: msg, variant: 'destructive' });
      }
    } finally {
      setBuilding(null);
    }
  };

  const buildAll = async () => {
    for (const tool of TRENDING_TOOLS) {
      if (!built.has(tool.slug)) {
        await handleBuild(tool);
        await new Promise(r => setTimeout(r, 200));
      }
    }
  };

  return (
    <AdminLayout title="Trending Tool Suggestions">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-display font-bold">Trending Tool Suggestions</h2>
          </div>
          <p className="text-muted-foreground">Click "Build Tool" to instantly add trending tools to your platform. {built.size}/{TRENDING_TOOLS.length} built.</p>
        </div>
        <Button onClick={buildAll} disabled={!!building || built.size === TRENDING_TOOLS.length} variant="outline">
          <Zap className="w-4 h-4 mr-2" /> Build All Missing
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TRENDING_TOOLS.map(tool => {
          const isBuilt = built.has(tool.slug);
          const isBuilding = building === tool.slug;
          return (
            <div key={tool.slug} className={`border rounded-xl p-5 bg-card transition-all ${isBuilt ? 'border-emerald-200 bg-emerald-50/30' : 'hover:border-primary/40 hover:shadow-md'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{tool.name}</h3>
                    {isBuilt && <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />}
                  </div>
                  <Badge variant="outline" className="text-xs capitalize mb-2">{tool.category}</Badge>
                  <p className="text-xs text-muted-foreground line-clamp-2">{tool.description}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                {isBuilt ? (
                  <Button size="sm" variant="outline" className="flex-1 text-emerald-700 border-emerald-300" onClick={() => window.open(`/tools/${tool.slug}`, '_blank')}>
                    View Live ↗
                  </Button>
                ) : (
                  <Button size="sm" className="flex-1" onClick={() => handleBuild(tool)} disabled={isBuilding}>
                    {isBuilding ? <><Zap className="w-3 h-3 mr-1 animate-spin" />Building...</> : <><Zap className="w-3 h-3 mr-1" />Build Tool</>}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}
