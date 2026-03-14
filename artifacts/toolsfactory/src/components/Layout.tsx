import React from 'react';
import { Link, useLocation } from 'wouter';
import { AdBlock } from './AdBlock';
import { Wrench, Menu, X, Search, Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Tools Directory', href: '/tools' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
              <Wrench size={20} />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">ToolsFactory</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${location === link.href ? 'text-primary' : 'text-muted-foreground'}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild className="hidden sm:inline-flex">
              <Link href="/search"><Search className="h-5 w-5" /></Link>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsDark(!isDark)}>
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-background px-4 py-4 space-y-4">
            {navLinks.map(link => (
              <Link 
                key={link.href} 
                href={link.href}
                className="block text-base font-medium py-2 text-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Button variant="default" className="w-full justify-start" asChild>
              <Link href="/search"><Search className="h-4 w-4 mr-2" /> Search Tools</Link>
            </Button>
          </div>
        )}
      </header>

      <div className="container mx-auto px-4 py-4">
        <AdBlock zone="HEADER_AD" />
      </div>

      <main className="flex-1">
        {children}
      </main>

      <div className="container mx-auto px-4 py-8">
        <AdBlock zone="FOOTER_AD" />
      </div>

      <footer className="border-t bg-card mt-auto py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
                <Wrench size={20} />
              </div>
              <span className="font-display font-bold text-xl">ToolsFactory</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm mb-6">
              A comprehensive suite of free online tools for developers, creators, and professionals. Fast, secure, and easy to use.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Categories</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/tools/category/developer" className="hover:text-primary transition-colors">Developer Tools</Link></li>
              <li><Link href="/tools/category/utility" className="hover:text-primary transition-colors">Utilities</Link></li>
              <li><Link href="/tools/category/design" className="hover:text-primary transition-colors">Design Tools</Link></li>
              <li><Link href="/tools/category/business" className="hover:text-primary transition-colors">Business Calculators</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} ToolsFactory. All rights reserved.
        </div>
      </footer>

      {/* Floating Elements */}
      <AdBlock zone="STICKY_BOTTOM_AD" className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur shadow-2xl border-t !min-h-[60px]" />
      <div className="fixed bottom-24 right-4 z-40">
        <AdBlock zone="FLOATING_AD" className="w-[200px] h-[200px] rounded-xl shadow-2xl bg-card" />
      </div>
    </div>
  );
}
