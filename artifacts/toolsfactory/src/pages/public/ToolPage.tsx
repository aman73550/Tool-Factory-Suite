import React, { useEffect } from 'react';
import { useRoute } from 'wouter';
import { Helmet } from 'react-helmet';
import { Layout } from '@/components/Layout';
import { AdBlock } from '@/components/AdBlock';
import { ToolInterface } from '@/components/ToolInterface';
import { StarRating } from '@/components/StarRating';
import { ToolCard } from '@/components/ToolCard';
import { useGetTool, useRecordToolView, useListTools } from '@workspace/api-client-react';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, 
  BreadcrumbPage, BreadcrumbSeparator 
} from '@/components/ui/breadcrumb';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function ToolPage() {
  const [, params] = useRoute('/tools/:slug');
  const slug = params?.slug || '';
  
  const { data: tool, isLoading, isError } = useGetTool(slug);
  const viewMut = useRecordToolView();
  const { data: relatedData } = useListTools({ category: tool?.category, limit: 4 });

  useEffect(() => {
    if (slug) {
      viewMut.mutate({ slug });
    }
  }, [slug]);

  if (isLoading) {
    return <Layout><div className="container mx-auto px-4 py-20"><Skeleton className="h-[600px] w-full rounded-3xl" /></div></Layout>;
  }

  if (isError || !tool) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-4xl font-bold mb-4">Tool Not Found</h1>
          <p className="text-muted-foreground text-lg">We couldn't find the tool you're looking for.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>{`${tool.name} - Free Online Tool | ToolsFactory`}</title>
        <meta name="description" content={tool.description} />
        {tool.keywords && <meta name="keywords" content={tool.keywords.join(', ')} />}
      </Helmet>

      {/* Header Area */}
      <div className="bg-gradient-to-b from-muted/50 to-background border-b pt-12 pb-8">
        <div className="container mx-auto px-4">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbLink href="/tools">Tools</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbLink href={`/tools/category/${tool.category}`} className="capitalize">{tool.category}</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>{tool.name}</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-foreground mb-4">{tool.name}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">{tool.description}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-12">
            <AdBlock zone="TOOL_TOP_AD" />
            
            {/* The actual tool interface */}
            <div id="tool-interface" className="scroll-mt-24">
              <ToolInterface logicFunction={tool.logicFunction} />
            </div>
            
            <AdBlock zone="TOOL_MIDDLE_AD" />

            {/* Content Sections */}
            <div className="prose dark:prose-invert max-w-none prose-lg">
              <h2 className="font-display">How to use the {tool.name}</h2>
              <p>
                Using our free online {tool.name.toLowerCase()} is simple and secure. 
                Everything happens directly in your browser, meaning your data never leaves your device.
                Simply configure the options above, click process, and get your result instantly.
              </p>
              
              {tool.faqData && tool.faqData.length > 0 && (
                <>
                  <h2 className="font-display mt-12 mb-6">Frequently Asked Questions</h2>
                  <Accordion type="multiple" className="not-prose bg-card border rounded-2xl px-6">
                    {tool.faqData.map((faq, i) => (
                      <AccordionItem key={i} value={`faq-${i}`} className="border-b last:border-0">
                        <AccordionTrigger className="text-left font-semibold text-lg hover:text-primary py-4">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-4">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </>
              )}
            </div>

            <AdBlock zone="RESULT_SECTION_AD" />
            
            <StarRating toolSlug={tool.slug} />
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            <AdBlock zone="SIDEBAR_TOP_AD" />
            
            <div className="bg-card rounded-2xl border p-6">
              <h3 className="font-display font-bold text-lg mb-6 flex items-center">
                Related Tools
              </h3>
              <div className="space-y-4">
                {relatedData?.tools?.filter(t => t.id !== tool.id).slice(0, 4).map(t => (
                  <a key={t.id} href={`/tools/${t.slug}`} className="block group">
                    <div className="flex flex-col gap-1 p-3 rounded-lg hover:bg-muted transition-colors">
                      <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{t.name}</span>
                      <span className="text-sm text-muted-foreground line-clamp-1">{t.description}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <AdBlock zone="SIDEBAR_BOTTOM_AD" />
          </aside>

        </div>
      </div>
    </Layout>
  );
}
