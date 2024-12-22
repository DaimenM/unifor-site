import { getAllArticles, createArticle } from '@/lib/articles';
import { Article } from '@/types/article';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const articles = await getAllArticles();
    return NextResponse.json(articles);
  } catch (error) {
    console.error('Failed to fetch articles:', error);
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const article: Article = await request.json();
    
    // Ensure article has an id
    if (!article.id) {
      article.id = crypto.randomUUID();
    }

    // Initialize visitors array if not present
    if (!article.visitors) {
      article.visitors = [];
    }

    if(!article.images) {
      article.images = [];
    }

    if(!article.files) {
      article.files = [];
    }

    // Save to KV
    await createArticle(article);
    
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error('Failed to create article:', err);
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
} 