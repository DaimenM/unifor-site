import { articles } from "@/data/articles";
import ArticleList from "@/components/article-list";
import SearchBar from "@/components/search-bar";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-red-600 mb-6">Welcome to District 300!</h1>
      <SearchBar />
      <ArticleList articles={articles} />
    </main>
  );
}

