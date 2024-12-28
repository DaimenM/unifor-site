import { NextResponse } from "next/server";
import { getAllArticles } from "@/lib/articles";

export async function GET() {
    try {   
        const articles = await getAllArticles();
        return NextResponse.json(articles);
    } catch (error) {
        return NextResponse.json({ error: "Error fetching articles: " + error }, { status: 500 });
    }
}
