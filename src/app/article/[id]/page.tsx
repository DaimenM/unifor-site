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
import { ScrollToTop } from "@/components/scroll-to-top";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ReactMarkdown from 'react-markdown';
import { FileAttachment } from "@/components/file-attachment";
import { stripMarkdown } from "@/lib/utils";

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
    description: stripMarkdown(article.content).substring(0, 150) + "...",
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
              <BreadcrumbItem>
                <BreadcrumbPage>{article.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <h1 className="text-4xl font-bold text-red-600 mb-4 opacity-0 animate-fade-up [animation-delay:100ms] [animation-fill-mode:forwards]">{article.title}</h1>
        {(!article.genInfo) && (
          <p className="text-gray-400 mb-8 opacity-0 animate-fade-up [animation-delay:200ms] [animation-fill-mode:forwards]">{new Date(article.date).toLocaleDateString()}</p>
        )}
        <div className="prose max-w-none opacity-0 animate-fade-up [animation-delay:300ms] [animation-fill-mode:forwards]">
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 opacity-0 animate-fade-up [animation-delay:400ms] [animation-fill-mode:forwards]">
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
        {article.files && article.files.length > 0 && (
          <div className="mt-8 opacity-0 animate-fade-up [animation-delay:450ms] [animation-fill-mode:forwards]">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Attachments</h2>
            <div className="grid gap-4">
              {article.files.map((file, index) => (
                <div key={index} className="border rounded-lg p-4">
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

