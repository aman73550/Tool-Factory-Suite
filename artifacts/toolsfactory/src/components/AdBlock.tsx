import React, { useEffect, useState } from 'react';
import { useGetAdZones } from '@workspace/api-client-react';

interface AdBlockProps {
  zone: string;
  className?: string;
}

export function AdBlock({ zone, className = '' }: AdBlockProps) {
  const { data: adData, isLoading } = useGetAdZones();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Lazy load simulation
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading || !isVisible) return null;

  const zoneConfig = adData?.zones?.find(z => z.zone === zone);

  if (!zoneConfig || !zoneConfig.enabled) {
    return null;
  }

  // If there's real ad code, we would render it via dangerouslySetInnerHTML
  // For safety and platform rules, we render a highly visible placeholder
  return (
    <div className={`w-full overflow-hidden flex items-center justify-center bg-accent/10 border-2 border-dashed border-accent/30 rounded-xl min-h-[100px] ${className}`}>
      <div className="text-center p-4">
        <span className="text-xs font-bold uppercase tracking-wider text-accent/60 block mb-1">Advertisement</span>
        {zoneConfig.code ? (
          <div dangerouslySetInnerHTML={{ __html: zoneConfig.code }} />
        ) : (
          <span className="text-sm font-medium text-accent/80">{zone} Placeholder</span>
        )}
      </div>
    </div>
  );
}
