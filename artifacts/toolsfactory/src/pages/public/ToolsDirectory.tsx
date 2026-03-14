import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { ToolCard } from '@/components/ToolCard';
import { useListTools } from '@workspace/api-client-react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ToolsDirectory() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  const { data, isLoading } = useListTools();

  const categories = ['all', ...(data?.categories || [])];
  
  const filteredTools = data?.tools?.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(search.toLowerCase()) || 
                          tool.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === 'all' || tool.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <Layout>
      <div className="bg-foreground text-background py-16 border-b border-border/10">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">Tools Directory</h1>
          <p className="text-lg text-background/70 max-w-2xl mb-8">
            Browse our complete collection of free online tools. Use the search or filter by category to find exactly what you need.
          </p>
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search tools..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="h-14 pl-12 bg-background/10 border-background/20 text-background placeholder:text-background/50 focus-visible:ring-primary focus-visible:border-primary text-lg rounded-xl"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Categories Tab */}
        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold capitalize transition-all duration-200 ${
                activeCategory === cat 
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105' 
                  : 'bg-card text-foreground border border-border hover:border-primary/50 hover:bg-muted'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map(i => (
              <Skeleton key={i} className="h-64 w-full rounded-2xl" />
            ))}
          </div>
        ) : filteredTools?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTools.map(tool => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed">
            <h3 className="text-2xl font-bold mb-2">No tools found</h3>
            <p className="text-muted-foreground">Try adjusting your search or category filter.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
