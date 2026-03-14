import React from 'react';
import { Link, useLocation } from 'wouter';
import { useGetAdminMe, useAdminLogout } from '@workspace/api-client-react';
import {
  LayoutDashboard, Wrench, Plus, Settings,
  BarChart, MessageSquare, ShieldAlert, LogOut, FileText,
  TrendingUp, Search, Sparkles
} from 'lucide-react';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const [location, setLocation] = useLocation();
  const { data: admin, isLoading, isError } = useGetAdminMe({ query: { retry: false } });
  const logoutMut = useAdminLogout();

  React.useEffect(() => {
    if (isError && location !== '/admin/login') {
      setLocation('/admin/login');
    }
  }, [isError, location, setLocation]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Skeleton className="w-32 h-32 rounded-full" /></div>;
  }

  if (isError || !admin) return null;

  const navSections = [
    {
      label: 'Overview',
      items: [
        { label: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
        { label: 'Analytics', icon: BarChart, href: '/admin/analytics' },
      ],
    },
    {
      label: 'Content',
      items: [
        { label: 'Tools Manager', icon: Wrench, href: '/admin/tools' },
        { label: 'Generate New Tool', icon: Sparkles, href: '/admin/tools/new' },
        { label: 'Trending Suggestions', icon: TrendingUp, href: '/admin/trending' },
      ],
    },
    {
      label: 'Marketing',
      items: [
        { label: 'Ads Manager', icon: FileText, href: '/admin/ads' },
        { label: 'SEO Manager', icon: Search, href: '/admin/seo' },
      ],
    },
    {
      label: 'Support',
      items: [
        { label: 'Feedback Manager', icon: MessageSquare, href: '/admin/feedback' },
        { label: 'System Scanner', icon: ShieldAlert, href: '/admin/scanner' },
        { label: 'Settings', icon: Settings, href: '/admin/settings' },
      ],
    },
  ];

  const handleLogout = async () => {
    await logoutMut.mutateAsync();
    setLocation('/admin/login');
  };

  const isActive = (href: string) =>
    href === '/admin/tools/new'
      ? location === '/admin/tools/new'
      : (location === href || (location.startsWith(href + '/') && href !== '/admin/tools/new'));

  return (
    <div className="min-h-screen flex bg-background dark">
      {/* Sidebar */}
      <aside className="w-64 border-r border-sidebar-border bg-sidebar text-sidebar-foreground flex flex-col fixed inset-y-0 z-20">
        <div className="h-16 flex items-center px-5 border-b border-sidebar-border gap-2">
          <div className="bg-primary/20 text-primary p-1.5 rounded-lg">
            <Wrench className="w-5 h-5" />
          </div>
          <span className="font-display font-bold text-base">ToolsFactory Admin</span>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-4">
          {navSections.map(section => (
            <div key={section.label}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-sidebar-foreground/40 px-3 mb-1.5">{section.label}</p>
              <div className="space-y-0.5">
                {section.items.map(item => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                        active
                          ? 'bg-sidebar-primary text-sidebar-primary-foreground font-semibold shadow-sm'
                          : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      }`}
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-sidebar-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent text-sm"
            onClick={handleLogout}
            disabled={logoutMut.isPending}
          >
            <LogOut className="w-4 h-4 mr-2" />
            {logoutMut.isPending ? 'Logging out...' : 'Logout'}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen flex flex-col bg-background">
        <header className="h-16 border-b bg-card flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="font-display font-semibold text-xl text-foreground capitalize">
            {title || location.split('/').filter(Boolean).pop() || 'Dashboard'}
          </h2>
          <div className="flex items-center gap-3">
            <div className="text-sm text-muted-foreground">{admin.email}</div>
            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
              {admin.email.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <div className="p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
