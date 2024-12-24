import { getAllArticles, createArticle } from '@/lib/articles';
import { Article } from '@/types/article';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { kv } from "@vercel/kv";

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
    const headersList = await headers();
    const authHeader = headersList.get('authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.exp * 1000 <= Date.now()) {
        return NextResponse.json({ error: 'Token expired' }, { status: 401 });
      }
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

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
  } catch (err) {
    console.error('Failed to create article:', err);
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
} 
export async function DELETE(request: Request) {
  try {
    // Verify auth token
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await request.json();
    await kv.del(id); // This will now delete the correctly prefixed key
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete article error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete article" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const headersList = headers();
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.exp * 1000 <= Date.now()) {
        return NextResponse.json({ error: 'Token expired' }, { status: 401 });
      }
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const article: Article = await request.json();
    
    // Update in KV store
    await kv.set(`article:${article.id}`, article);
    
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Failed to update article:', err);
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
  }
}