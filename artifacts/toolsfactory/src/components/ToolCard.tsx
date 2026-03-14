import React from 'react';
import { Link } from 'wouter';
import { Tool } from '@workspace/api-client-react';
import { Wrench, Star, ArrowRight } from 'lucide-react';
import { Badge } from './ui/badge';
import { Card } from './ui/card';

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Card className="group relative overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
      <Link href={`/tools/${tool.slug}`} className="block p-6 h-full flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Wrench className="w-6 h-6" />
          </div>
          <Badge variant="secondary" className="capitalize">
            {tool.category}
          </Badge>
        </div>
        
        <h3 className="font-display font-bold text-xl mb-2 text-foreground group-hover:text-primary transition-colors">
          {tool.name}
        </h3>
        
        <p className="text-muted-foreground text-sm line-clamp-2 mb-6 flex-1">
          {tool.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
          <div className="flex items-center gap-1.5 text-sm font-medium">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-foreground">{tool.averageRating?.toFixed(1) || '0.0'}</span>
            <span className="text-muted-foreground">({tool.ratingCount || 0})</span>
          </div>
          <div className="text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>
      </Link>
    </Card>
  );
}
