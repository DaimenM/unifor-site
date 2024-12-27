import { NextResponse } from 'next/server';
import { getAllArticles } from '@/lib/articles';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.toLowerCase() || '';

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  const articles = await getAllArticles();
  
  const searchResults = articles.filter(article => 
    article.title.toLowerCase().includes(query) || 
    article.content.toLowerCase().includes(query)
  ).slice(0, 5); // Limit to 5 suggestions

  return NextResponse.json({ results: searchResults });
}