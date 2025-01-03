import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getArticle } from "@/lib/articles";
import { AnalyticsWrapper } from "@/components/analytics-wrapper";
import { ScrollToTop } from "@/components/scroll-to-top";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ReactMarkdown from 'react-markdown';
import { FileAttachment } from "@/components/file-attachment";
import { stripMarkdown } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, ExternalLink } from "lucide-react";

type Params = Promise<{ id: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export async function generateMetadata(props: {
  params: Params;
  searchParams: SearchParams;
}): Promise<Metadata> {
  const params = await props.params;
  const article = await getArticle(params.id);

  if (!article) {
    return {
      title: "Article not found",
    };
  }
  const pageMetadata: Metadata = {
    title: article.title,
    description: stripMarkdown(article.content).substring(0, 150) + "...",
  }

  if(article.images.length > 0) {
    pageMetadata.openGraph = {
      images: article.images,
    }
  }
 
  return pageMetadata;
}

export default async function ArticlePage(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  
  const isFromSearch = searchParams.from === 'search';
  const searchQuery = searchParams.q;
  
  // Fetch article server-side
  const article = await getArticle(params.id);
  
  if (!article) {
    return notFound();
  }

  return (
    <AnalyticsWrapper articleId={params.id}>
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6 animate-fade-up [animation-fill-mode:forwards]">
          <SidebarTrigger
            className="md:hidden text-red-600 flex-shrink-0"
            size={"icon"}
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink> 
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              {isFromSearch && (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href={`/search?q=${searchQuery}`}>
                        Search Results
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              )}
              <BreadcrumbItem>
                <BreadcrumbPage>{article.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {article.archived?.isArchived && (
          <Alert 
            className="mb-6 border-orange-200 bg-orange-50 text-orange-800 opacity-0 animate-fade-up [animation-delay:50ms] [animation-fill-mode:forwards]"
          >
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This article was archived on {new Date(article.archived.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}.
            </AlertDescription>
          </Alert>
        )}

        <h1 className="text-4xl font-bold text-red-600 mb-4 opacity-0 animate-fade-up [animation-delay:100ms] [animation-fill-mode:forwards]">{article.title}</h1>
        {(!article.genInfo) && (
          <p className="text-gray-400 mb-8 opacity-0 animate-fade-up [animation-delay:200ms] [animation-fill-mode:forwards]">{new Date(article.date).toLocaleDateString()}</p>
        )}
        <div className="prose max-w-none opacity-0 animate-fade-up [animation-delay:300ms] [animation-fill-mode:forwards]">
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </div>
        {article.files && article.files.length > 0 && (
          <div className="mt-8 opacity-0 animate-fade-up [animation-delay:450ms] [animation-fill-mode:forwards]">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Attachments</h2>
            <div className="grid gap-4">
              {article.files.map((file, index) => (
                <div key={index} className="border rounded-lg p-4 relative">
                  <div className="md:hidden absolute top-4 right-4">
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      aria-label="Open in new tab"
                    >
                      <ExternalLink className="h-5 w-5 text-gray-500" />
                    </a>
                  </div>
                  <h3 className="font-semibold mb-2">{file.name}</h3>
                  <FileAttachment file={file} />
                </div>
              ))}
            </div>
          </div>
        )}
        {article.embeds && (
          <div className="mt-8 opacity-0 animate-fade-up [animation-delay:500ms] [animation-fill-mode:forwards]">
            {article.embeds.map((embed: string, index: number) => (
              <div key={index} className="aspect-w-16 aspect-h-9 mt-4">
                <iframe
                  src={embed}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            ))}
          </div>
        )}
        <ScrollToTop />
      </main>
    </AnalyticsWrapper>
  );
}
