import React from 'react';
import { useRoute } from 'wouter';
import { Layout } from '@/components/Layout';
import { ToolCard } from '@/components/ToolCard';
import { useListTools } from '@workspace/api-client-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function CategoryPage() {
  const [, params] = useRoute('/tools/category/:category');
  const category = params?.category || '';
  
  const { data, isLoading } = useListTools({ category });

  return (
    <Layout>
      <div className="bg-muted/30 py-16 border-b">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 capitalize">
            {category} Tools
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our collection of free {category} tools designed to make your life easier.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3].map(i => <Skeleton key={i} className="h-64 w-full rounded-2xl" />)}
          </div>
        ) : data?.tools?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.tools.map(tool => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold mb-2">No tools in this category</h3>
            <p className="text-muted-foreground">Check back later for new additions.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
