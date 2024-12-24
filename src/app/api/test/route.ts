import { NextResponse } from "next/server";
import type { Article } from "@/types/article";
import { seedArticles } from "@/lib/articles";

export async function POST(request: Request) {
    const articles: Article[] = await request.json();

    try {   
        seedArticles(articles)
    } catch (error) {
        return NextResponse.json({ error: "Error seeding articles, " + error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
