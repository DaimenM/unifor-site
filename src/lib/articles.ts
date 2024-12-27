import { kv } from '@vercel/kv';
import { Article } from '@/types/article';

// Prefix for article keys to create a "collection"
const ARTICLE_PREFIX = 'article:';
const ARTICLE_IDS_KEY = 'articles:ids';

export async function createArticle(article: Article) {
  // Store the article with a prefixed key
  await kv.set(`${ARTICLE_PREFIX}${article.id}`, article);
  
  // Add the ID to our list of article IDs
  await kv.sadd(ARTICLE_IDS_KEY, article.id);
}

export async function getArticle(id: string): Promise<Article | null> {
  return await kv.get(`${ARTICLE_PREFIX}${id}`);
}

export async function getAllArticles(): Promise<Article[]> {
  // Get all article IDs
  const articleIds = await kv.smembers(ARTICLE_IDS_KEY);
  
  // Get all articles in parallel
  const articles = await Promise.all(
    articleIds.map(id => kv.get(`${ARTICLE_PREFIX}${id}`))
  );
  
  return articles.filter((article): article is Article => article !== null);
}

export async function deleteArticle(id: string) {
  await kv.del(`${ARTICLE_PREFIX}${id}`);
  await kv.srem(ARTICLE_IDS_KEY, id);
}

export async function updateArticle(article: Article) {
  // Update the article in KV store
  await kv.set(`${ARTICLE_PREFIX}${article.id}`, article);

  // Ensure the article ID is in our index
  await kv.sadd(ARTICLE_IDS_KEY, article.id);
  
  return article;
}

// Example of how to store your current articles:
export async function seedArticles(articles: Article[]) {
  for (const article of articles) {
    await createArticle(article);
  }
}

export async function searchArticles(query: string): Promise<Article[]> {
  const articles = await getAllArticles();
  
  return articles.filter(article => 
    article.title.toLowerCase().includes(query.toLowerCase()) ||
    article.content.toLowerCase().includes(query.toLowerCase())
  );
}