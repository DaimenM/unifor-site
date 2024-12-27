import { searchArticles } from "@/lib/articles";
import ArticleList from "@/components/article-list";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";

export default async function SearchResults({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  const query = searchParams.q;
  const articles = await searchArticles(query);

  return (
    <main className="container mx-auto px-4 py-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Search Results</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold text-red-600 mb-4">
        Search Results for "{query}"
      </h1>

      {articles.length > 0 ? (
        <ArticleList 
          articles={articles} 
          urlPrefix={`/article/`}
          urlSuffix={`?from=search&q=${encodeURIComponent(query)}`}
        />
      ) : (
        <div className="text-center py-8 text-gray-500">
          No results found
        </div>
      )}
    </main>
  );
}