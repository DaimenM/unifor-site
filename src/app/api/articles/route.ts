import { NextResponse } from 'next/server';
import { kv } from "@vercel/kv";
import type { Article } from "@/types/article";

export async function GET() {
  try {
    // Get all article keys
    const keys = await kv.keys("article:*");
    
    // Fetch all articles
    const articles = await Promise.all(
      keys.map(key => kv.get<Article>(key))
    );

    return NextResponse.json(articles);
  } catch (error) {
    console.error("Failed to fetch articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
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

    // Save to KV
    await kv.set(`article:${article.id}`, article);
    
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error('Failed to create article:', err);
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
} 