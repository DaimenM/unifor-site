import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip');
    return NextResponse.json({ ip });
}

