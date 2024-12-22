import Image from "next/image";
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
import { kv } from "@vercel/kv";
import type { Article } from "@/types/article";
import { AnalyticsWrapper } from "@/components/analytics-wrapper";

export default async function ArticlePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  
  // Fetch article server-side
  const article = await kv.get<Article>(`article:${id}`);
  
  if (!article) {
    // You might want to use notFound() from next/navigation here
    return <div>Article not found</div>;
  }

  return (
    <AnalyticsWrapper articleId={id}>
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
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
              <BreadcrumbItem>
                <BreadcrumbPage>{article.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <h1 className="text-4xl font-bold text-red-600 mb-4">{article.title}</h1>
        <p className="text-gray-400 mb-8">{new Date(article.date).toLocaleDateString()}</p>
        <div className="prose max-w-none">
          <p className="text-gray-800">{article.content}</p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {article.images.map((image: string, index: number) => (
            <Image
              key={index}
              src={image}
              alt={`Image ${index + 1} for ${article.title}`}
              width={400}
              height={300}
              className="rounded-lg shadow-md"
            />
          ))}
        </div>
        {article.embeds && (
          <div className="mt-8">
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
      </main>
    </AnalyticsWrapper>
  );
}

