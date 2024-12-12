import { articles } from "@/data/articles";
import ArticleList from "@/components/article-list";
import SearchBar from "@/components/search-bar";

export default function Home() {
  return (
    <main className="w-full px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-red-600">District 300</h1>
        <h2 className="text-2l font-bold text-gray-600 mb-8">Unifor Local 2002</h2>
        <SearchBar />
        <ArticleList articles={articles} />
      </div>
    </main>
  );
}
