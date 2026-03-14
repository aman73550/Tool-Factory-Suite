import React, { useEffect, useState } from 'react';

interface AdBlockProps {
  zone: string;
  className?: string;
}

const AD_ZONE_LABELS: Record<string, string> = {
  HEADER_AD: 'Header Advertisement',
  TOOL_TOP_AD: 'Tool Top Advertisement',
  TOOL_MIDDLE_AD: 'Tool Middle Advertisement',
  RESULT_SECTION_AD: 'Result Advertisement',
  SIDEBAR_TOP_AD: 'Sidebar Advertisement',
  SIDEBAR_BOTTOM_AD: 'Sidebar Bottom Advertisement',
  FOOTER_AD: 'Footer Advertisement',
  STICKY_BOTTOM_AD: 'Sticky Bottom Advertisement',
  FLOATING_AD: 'Floating Advertisement',
};

type ZoneConfig = { zone: string; enabled: boolean; code: string };
let cachedZones: ZoneConfig[] | null = null;
let fetchPromise: Promise<ZoneConfig[]> | null = null;

function fetchZones(): Promise<ZoneConfig[]> {
  if (cachedZones) return Promise.resolve(cachedZones);
  if (fetchPromise) return fetchPromise;
  fetchPromise = fetch('/api/ads')
    .then(r => r.json())
    .then(data => {
      cachedZones = data.zones || [];
      return cachedZones!;
    })
    .catch(() => {
      cachedZones = [];
      return [];
    });
  return fetchPromise;
}

export function AdBlock({ zone, className = '' }: AdBlockProps) {
  const [zoneConfig, setZoneConfig] = useState<ZoneConfig | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      const zones = await fetchZones();
      const found = zones.find(z => z.zone === zone);
      setZoneConfig(found || { zone, enabled: true, code: '' });
      setIsVisible(true);
    }, 600);
    return () => clearTimeout(timer);
  }, [zone]);

  if (!isVisible || !zoneConfig || !zoneConfig.enabled) return null;

  const label = AD_ZONE_LABELS[zone] || zone;

  const heightClass = zone === 'STICKY_BOTTOM_AD' ? 'min-h-[60px]'
    : zone === 'FLOATING_AD' ? 'min-h-[200px]'
    : zone.includes('SIDEBAR') ? 'min-h-[250px]'
    : zone === 'HEADER_AD' || zone === 'FOOTER_AD' ? 'min-h-[90px]'
    : 'min-h-[100px]';

  return (
    <div className={`w-full overflow-hidden flex items-center justify-center bg-primary/5 border border-dashed border-primary/20 rounded-xl ${heightClass} ${className}`}>
      <div className="text-center p-4">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 block mb-2">Advertisement</span>
        {zoneConfig.code ? (
          <div dangerouslySetInnerHTML={{ __html: zoneConfig.code }} />
        ) : (
          <div>
            <span className="text-xs font-medium text-muted-foreground/50">{label}</span>
            <p className="text-[10px] text-muted-foreground/40 mt-1">728×90 · Configure in Admin → Ads Manager</p>
          </div>
        )}
      </div>
    </div>
  );
}
