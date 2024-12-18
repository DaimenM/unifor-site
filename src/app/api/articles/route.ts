import { NextResponse } from 'next/server';
import { getAllArticles, getArticle, createArticle } from '@/lib/articles';
import { Article } from '@/types/article';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (id) {
    const article = await getArticle(id);
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }
    return NextResponse.json(article);
  }

  const articles = await getAllArticles();
  return NextResponse.json(articles);
}

export async function POST(request: Request) {
  try {
    const article: Article = await request.json();
    await createArticle(article);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error('Failed to create article:', err);
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
} 