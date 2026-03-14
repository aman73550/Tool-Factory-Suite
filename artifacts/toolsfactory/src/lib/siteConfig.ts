import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export interface SiteConfig {
  siteName: string;
  siteTagline: string;
  siteUrl: string;
  adminEmail: string;
  footerText: string;
  defaultMetaTitle: string;
  defaultMetaDescription: string;
  defaultKeywords: string;
  theme: 'light' | 'dark';
  feedbackEnabled: boolean;
  analyticsEnabled: boolean;
  autoPublishTools: boolean;
  resultsPerPage: number;
  emptySpaceAdsEnabled: boolean;
  [key: string]: any;
}

export interface SiteScript {
  id: number;
  name: string;
  code: string;
  placement: 'head' | 'body' | 'footer';
  enabled: boolean;
}

const DEFAULTS: SiteConfig = {
  siteName: 'ToolsFactory',
  siteTagline: 'Free Online Tools for Everyone',
  siteUrl: 'https://toolsfactory.com',
  adminEmail: 'admin@toolsfactory.com',
  footerText: '© 2025 ToolsFactory. All rights reserved.',
  defaultMetaTitle: 'ToolsFactory — Free Online Tools',
  defaultMetaDescription: 'Free online tools for developers, creators & professionals.',
  defaultKeywords: 'free online tools, developer tools',
  theme: 'light',
  feedbackEnabled: true,
  analyticsEnabled: true,
  autoPublishTools: false,
  resultsPerPage: 20,
  emptySpaceAdsEnabled: false,
};

function parseSettings(raw: Record<string, string>): SiteConfig {
  return {
    ...DEFAULTS,
    siteName: raw.siteName ?? DEFAULTS.siteName,
    siteTagline: raw.siteTagline ?? DEFAULTS.siteTagline,
    siteUrl: raw.siteUrl ?? DEFAULTS.siteUrl,
    adminEmail: raw.adminEmail ?? DEFAULTS.adminEmail,
    footerText: raw.footerText ?? DEFAULTS.footerText,
    defaultMetaTitle: raw.defaultMetaTitle ?? DEFAULTS.defaultMetaTitle,
    defaultMetaDescription: raw.defaultMetaDescription ?? DEFAULTS.defaultMetaDescription,
    defaultKeywords: raw.defaultKeywords ?? DEFAULTS.defaultKeywords,
    theme: (raw.theme as 'light' | 'dark') ?? DEFAULTS.theme,
    feedbackEnabled: raw.feedbackEnabled === 'true',
    analyticsEnabled: raw.analyticsEnabled === 'true',
    autoPublishTools: raw.autoPublishTools === 'true',
    resultsPerPage: parseInt(raw.resultsPerPage ?? '20', 10),
    emptySpaceAdsEnabled: raw.emptySpaceAdsEnabled === 'true',
  };
}

interface SiteConfigContextValue {
  config: SiteConfig;
  scripts: SiteScript[];
  loading: boolean;
  refresh: () => void;
}

const SiteConfigContext = createContext<SiteConfigContextValue>({
  config: DEFAULTS,
  scripts: [],
  loading: true,
  refresh: () => {},
});

export function SiteConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(DEFAULTS);
  const [scripts, setScripts] = useState<SiteScript[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [settingsRes, scriptsRes] = await Promise.all([
        fetch('/api/settings').then(r => r.json()),
        fetch('/api/scripts').then(r => r.json()),
      ]);
      if (settingsRes.settings) setConfig(parseSettings(settingsRes.settings));
      if (scriptsRes.scripts) setScripts(scriptsRes.scripts.map((s: any) => ({ ...s, enabled: !!s.enabled })));
    } catch (e) {
      console.warn('Failed to load site config:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return React.createElement(SiteConfigContext.Provider, { value: { config, scripts, loading, refresh: load } }, children);
}

export function useSiteConfig() {
  return useContext(SiteConfigContext);
}
