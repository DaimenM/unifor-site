import { getArticles } from "@/data/articles";
import ArticleList from "@/components/article-list";
import SearchBar from "@/components/search-bar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const searchParamsResolved = await searchParams;
  const currentPage = Number(searchParamsResolved.page) || 1;
  const { articles, totalPages } = await getArticles(currentPage);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-red-600 mb-6">
        Welcome to District 300!
      </h1>

      <div className="sticky top-0 z-50 bg-white py-4 -mx-4 px-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger
            className="md:hidden text-red-600 flex-shrink-0 -translate-y-4"
            size={"icon"}
          />
          <div className="flex-1">
            <SearchBar initialArticles={articles} />
          </div>
        </div>
      </div>

      <ArticleList articles={articles} />

      <div className="mt-8">
        <Pagination>
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious href={`/?page=${currentPage - 1}`} />
              </PaginationItem>
            )}
            
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i + 1}>
                <PaginationLink
                  href={`/?page=${i + 1}`}
                  isActive={currentPage === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext href={`/?page=${currentPage + 1}`} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    </main>
  );
}