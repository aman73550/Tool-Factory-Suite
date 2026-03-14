import React, { useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useGetAdminMe, useAdminLogout } from '@workspace/api-client-react';
import { 
  LayoutDashboard, Wrench, Plus, Settings, 
  BarChart, MessageSquare, ShieldAlert, LogOut, FileText
} from 'lucide-react';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { data: admin, isLoading, isError } = useGetAdminMe({ query: { retry: false } });
  const logoutMut = useAdminLogout();

  useEffect(() => {
    if (isError && location !== '/admin/login') {
      setLocation('/admin/login');
    }
  }, [isError, location, setLocation]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Skeleton className="w-32 h-32 rounded-full" /></div>;
  }

  if (isError || !admin) {
    return null; // Will redirect via effect
  }

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
    { label: 'Tools Manager', icon: Wrench, href: '/admin/tools' },
    { label: 'Ads Manager', icon: FileText, href: '/admin/ads' },
    { label: 'Analytics', icon: BarChart, href: '/admin/analytics' },
    { label: 'Feedback', icon: MessageSquare, href: '/admin/feedback' },
    { label: 'Scanner', icon: ShieldAlert, href: '/admin/scanner' },
    { label: 'Settings', icon: Settings, href: '/admin/settings' },
  ];

  const handleLogout = async () => {
    await logoutMut.mutateAsync();
    setLocation('/admin/login');
  };

  return (
    <div className="min-h-screen flex bg-background dark">
      {/* Sidebar */}
      <aside className="w-64 border-r border-sidebar-border bg-sidebar text-sidebar-foreground flex flex-col fixed inset-y-0">
        <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
          <Wrench className="w-6 h-6 text-sidebar-primary mr-2" />
          <span className="font-display font-bold text-lg">Admin Panel</span>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {navItems.map(item => {
            const active = location === item.href || location.startsWith(item.href + '/');
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  active 
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-md' 
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-sidebar-border">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={handleLogout}
            disabled={logoutMut.isPending}
          >
            <LogOut className="w-5 h-5 mr-3" />
            {logoutMut.isPending ? 'Logging out...' : 'Logout'}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen flex flex-col bg-background">
        <header className="h-16 border-b bg-card flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="font-display font-semibold text-xl text-foreground capitalize">
            {location.split('/').pop() || 'Dashboard'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-sm font-medium text-muted-foreground">{admin.email}</div>
            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
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
