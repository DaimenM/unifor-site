import { articles } from "@/data/articles";
import ArticleList from "@/components/article-list";
import SearchBar from "@/components/search-bar";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-red-600 mb-6">
        Welcome to District 300!
      </h1>

      <div className="sticky top-0 z-50 bg-white py-4 -mx-4 px-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger
            className="md:hidden text-red-600 flex-shrink-0"
            size="default"
          />
          <div className="flex-1">
            <SearchBar />
          </div>
        </div>
      </div>

      <ArticleList articles={articles} />
    </main>
  );
}
