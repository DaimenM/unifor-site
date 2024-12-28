import { NextResponse } from "next/server";
import { getAllArticles, seedArticles } from "@/lib/articles";
import articlesData from "../../../../public/articles.json";

export async function GET() {
    try {   
        const articles = await getAllArticles();
        return NextResponse.json(articles);
    } catch (error) {
        return NextResponse.json({ error: "Error fetching articles: " + error }, { status: 500 });
    }
}

export async function POST() {
    try {
        await seedArticles(articlesData);
        return NextResponse.json({ message: "Articles seeded successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Error seeding articles: " + error }, { status: 500 });
    }
}
