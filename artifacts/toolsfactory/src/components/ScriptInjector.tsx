import { useEffect } from 'react';
import { useSiteConfig } from '@/lib/siteConfig';

export function ScriptInjector() {
  const { scripts } = useSiteConfig();

  useEffect(() => {
    const injected: HTMLElement[] = [];

    for (const script of scripts) {
      if (!script.enabled || !script.code.trim()) continue;

      const el = document.createElement('script');
      el.setAttribute('data-injected-id', String(script.id));
      el.text = script.code;

      if (script.placement === 'head') {
        document.head.appendChild(el);
      } else {
        document.body.appendChild(el);
      }
      injected.push(el);
    }

    return () => {
      injected.forEach(el => el.parentNode?.removeChild(el));
    };
  }, [scripts]);

  return null;
}
