import React, { useEffect, useState } from 'react';

interface AdBlockProps {
  zone: string;
  className?: string;
}

const AD_ZONE_LABELS: Record<string, string> = {
  HEADER_AD: 'Header Advertisement (728×90)',
  TOOL_TOP_AD: 'Tool Top Advertisement (728×90)',
  TOOL_MIDDLE_AD: 'Tool Middle Advertisement (336×280)',
  RESULT_SECTION_AD: 'Result Section Advertisement',
  SIDEBAR_TOP_AD: 'Sidebar Advertisement (300×250)',
  SIDEBAR_BOTTOM_AD: 'Sidebar Bottom Advertisement (300×250)',
  FOOTER_AD: 'Footer Advertisement (728×90)',
  STICKY_BOTTOM_AD: 'Sticky Bottom Advertisement (728×90)',
  FLOATING_AD: 'Floating Advertisement (200×200)',
  INLINE_CONTENT_AD: 'Inline Content Advertisement (728×90)',
};

type ZoneConfig = { zone: string; enabled: boolean; code: string; deviceTarget: string };
let cachedZones: ZoneConfig[] | null = null;
let fetchPromise: Promise<ZoneConfig[]> | null = null;

function fetchZones(): Promise<ZoneConfig[]> {
  if (cachedZones) return Promise.resolve(cachedZones);
  if (fetchPromise) return fetchPromise;
  fetchPromise = fetch('/api/ads')
    .then(r => r.json())
    .then(data => { cachedZones = data.zones || []; return cachedZones!; })
    .catch(() => { cachedZones = []; return []; });
  return fetchPromise;
}

export function invalidateAdCache() {
  cachedZones = null;
  fetchPromise = null;
}

function getDeviceType(): 'desktop' | 'mobile' {
  return window.innerWidth < 768 ? 'mobile' : 'desktop';
}

function matchesDevice(target: string): boolean {
  if (target === 'both' || !target) return true;
  return target === getDeviceType();
}

export function AdBlock({ zone, className = '' }: AdBlockProps) {
  const [zoneConfig, setZoneConfig] = useState<ZoneConfig | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      const zones = await fetchZones();
      const found = zones.find(z => z.zone === zone);
      setZoneConfig(found || { zone, enabled: true, code: '', deviceTarget: 'both' });
      setIsVisible(true);
    }, 400);
    return () => clearTimeout(timer);
  }, [zone]);

  if (!isVisible || !zoneConfig || !zoneConfig.enabled) return null;
  if (!matchesDevice(zoneConfig.deviceTarget)) return null;

  const label = AD_ZONE_LABELS[zone] || zone;

  const heightClass =
    zone === 'STICKY_BOTTOM_AD' ? 'min-h-[60px]'
    : zone === 'FLOATING_AD' ? 'min-h-[200px]'
    : zone.includes('SIDEBAR') ? 'min-h-[250px]'
    : zone === 'HEADER_AD' || zone === 'FOOTER_AD' ? 'min-h-[90px]'
    : 'min-h-[100px]';

  return (
    <div className={`w-full overflow-hidden flex items-center justify-center bg-primary/5 border border-dashed border-primary/20 rounded-xl ${heightClass} ${className}`}>
      <div className="text-center p-4 w-full">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 block mb-2">Advertisement</span>
        {zoneConfig.code ? (
          <div dangerouslySetInnerHTML={{ __html: zoneConfig.code }} />
        ) : (
          <div>
            <span className="text-xs font-medium text-muted-foreground/50">{label}</span>
            <p className="text-[10px] text-muted-foreground/30 mt-1">Configure in Admin → Ads Manager</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function InlineContentAd() {
  return <AdBlock zone="INLINE_CONTENT_AD" className="my-6" />;
}
