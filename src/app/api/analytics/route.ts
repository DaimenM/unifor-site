import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import type { Article } from "@/types/article";

export async function POST(request: NextRequest) {
  try {
    const { articleId, platform } = await request.json();

    if (!articleId) {
      return NextResponse.json({ error: "Article ID is required" }, { status: 400 });
    }

    const visit = {
      date: new Date().toISOString(),
      platform,
    };

    // Get the current article and type it properly
    const article = await kv.get<Article>(`article:${articleId}`);
    
    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    if (article.genInfo) {
      if(article.genInfo === true) {
        return NextResponse.json({ success: true });
      }
    }

    // Update visitors array
    const updatedArticle = {
      ...article,
      visitors: [...(article.visitors || []), visit],
    };

    // Save back to KV
    await kv.set(`article:${articleId}`, updatedArticle);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}



