import { getAllArticles } from '@/lib/articles';
import { Article } from "@/types/article";

const ITEMS_PER_PAGE = 12;

export async function getArticles(page: number = 1, archived: boolean = false): Promise<{
  articles: Article[];
  totalPages: number;
  currentPage: number;
}> {
  try {
    const allArticles = await getAllArticles();
    // Sort articles by date (most recent first)
    let sortedArticles = allArticles.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    if(archived) {
      sortedArticles = sortedArticles.filter(article => article.archived);
    }

    const totalPages = Math.ceil(sortedArticles.length / ITEMS_PER_PAGE);
    const start = (page - 1) * ITEMS_PER_PAGE;
    const paginatedArticles = sortedArticles.slice(start, start + ITEMS_PER_PAGE);

    return {
      articles: paginatedArticles,
      totalPages,
      currentPage: page,
    };
  } catch (error) {
    console.error('Failed to fetch articles from KV:', error);
    return {
      articles: [],
      totalPages: 0,
      currentPage: 1,
    };
  }
}

