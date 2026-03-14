import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { ToolCard } from '@/components/ToolCard';
import { useListTools } from '@workspace/api-client-react';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon } from 'lucide-react';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  const { data, isLoading } = useListTools({ search: debouncedQuery });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">Search Tools</h1>
          <div className="relative max-w-2xl mx-auto">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-primary" />
            <Input 
              autoFocus
              placeholder="What do you want to do today?" 
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="h-16 pl-14 text-xl rounded-2xl shadow-lg border-2 border-border focus-visible:border-primary focus-visible:ring-primary/20 bg-card"
            />
          </div>
        </div>

        {debouncedQuery && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">
              {isLoading ? 'Searching...' : `Results for "${debouncedQuery}" (${data?.total || 0})`}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data?.tools?.map(tool => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
            
            {!isLoading && data?.tools?.length === 0 && (
              <div className="text-center py-16 bg-muted/50 rounded-2xl border border-dashed">
                <p className="text-xl text-muted-foreground">We couldn't find any tools matching your search.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
