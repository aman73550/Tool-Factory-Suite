import React from 'react';
import { Link } from 'wouter';
import { Layout } from '@/components/Layout';
import { ToolCard } from '@/components/ToolCard';
import { useListTools, useGetAnalytics } from '@workspace/api-client-react';
import { Search, Zap, Shield, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Home() {
  const { data: toolsData } = useListTools({ limit: 6 });
  const { data: analytics } = useGetAnalytics();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-foreground text-background py-24 md:py-32">
        <div className="absolute inset-0 opacity-40">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-mesh.png`} 
            alt="Hero Background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-foreground/90" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary-foreground text-sm font-medium mb-8 backdrop-blur-sm border border-primary/30">
            <Sparkles className="w-4 h-4" /> The Ultimate Tool Factory
          </div>
          
          <h1 className="font-display font-extrabold text-5xl md:text-7xl mb-6 max-w-4xl mx-auto leading-tight">
            All the tools you need, <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">in one simple place.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-background/70 max-w-2xl mx-auto mb-10">
            Free online tools for developers, designers, and creators. No registration required. Just fast, client-side tools that respect your privacy.
          </p>
          
          <div className="max-w-xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
            <div className="relative flex items-center bg-background rounded-xl p-2 shadow-2xl">
              <Search className="w-6 h-6 text-muted-foreground ml-3" />
              <Input 
                placeholder="Search for tools... (e.g. JSON Formatter)" 
                className="border-0 focus-visible:ring-0 text-lg h-14 bg-transparent text-foreground placeholder:text-muted-foreground"
              />
              <Button size="lg" className="h-12 px-8 font-bold rounded-lg" asChild>
                <Link href="/search">Search</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      {analytics && (
        <div className="border-b bg-card">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-border">
              <div className="text-center px-4">
                <div className="text-3xl font-display font-bold text-foreground mb-1">{analytics.totalTools || 0}+</div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Active Tools</div>
              </div>
              <div className="text-center px-4">
                <div className="text-3xl font-display font-bold text-foreground mb-1">{analytics.totalViews?.toLocaleString() || 0}</div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Uses</div>
              </div>
              <div className="text-center px-4 hidden md:block">
                <div className="text-3xl font-display font-bold text-foreground mb-1">0ms</div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Server Latency</div>
              </div>
              <div className="text-center px-4 hidden md:block">
                <div className="text-3xl font-display font-bold text-foreground mb-1">{analytics.totalRatings || 0}</div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Happy Users</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Features */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="w-16 h-16 mx-auto bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-display">Lightning Fast</h3>
              <p className="text-muted-foreground">Tools run directly in your browser. No server waiting times, instant results.</p>
            </div>
            <div>
              <div className="w-16 h-16 mx-auto bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-display">100% Private</h3>
              <p className="text-muted-foreground">We don't store your data. Everything is processed locally on your machine.</p>
            </div>
            <div>
              <div className="w-16 h-16 mx-auto bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-display">Always Free</h3>
              <p className="text-muted-foreground">Ad-supported platform ensures our tools stay free for everyone, forever.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tools */}
      <section className="py-24 bg-muted/30 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">Most Popular Tools</h2>
              <p className="text-muted-foreground text-lg max-w-2xl">Discover the tools our community uses the most right now.</p>
            </div>
            <Button variant="outline" className="mt-6 md:mt-0" asChild>
              <Link href="/tools">View All Tools <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {toolsData?.tools?.slice(0, 6).map(tool => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
