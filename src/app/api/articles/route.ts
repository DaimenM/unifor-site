import { articles } from '@/data/articles';
import { seedArticles, getAllArticles, getArticle, createArticle, deleteArticle } from '@/lib/articles';

// Seed your existing articles
await seedArticles(articles);

// Get all articles
const allArticles = await getAllArticles();

// Get a single article
const article = await getArticle('1');

// Create a new article
await createArticle({
  id: '11',
  title: 'New Article',
  content: 'Content here...',
  images: ['/placeholder.png'],
  date: new Date().toISOString().split('T')[0]
}); 