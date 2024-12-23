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
import { getArticle } from "@/lib/articles";
import { AnalyticsWrapper } from "@/components/analytics-wrapper";
import { notFound } from "next/navigation";
import { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  // read route params
  const id = (await params).id
 
  // fetch data
  const article = await getArticle(id);

  if (!article) {
    return {
      title: "Article not found",
    };
  }
  const pageMetadata: Metadata = {
    title: article.title,
    description: article.content.substring(0, 20),
  }

  if(article.images.length > 0) {
    pageMetadata.openGraph = {
      images: article.images,
    }
  }
 
  return pageMetadata;
}

export default async function ArticlePage(props: Props) {
  const params = await props.params;
  const id = params.id;
  
  // Fetch article server-side
  const article = await getArticle(id);
  
  if (!article) {
    return notFound();
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

